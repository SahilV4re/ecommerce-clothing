import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

function createSupabase() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
}

interface CheckoutItem {
  product_id: string;
  quantity: number;
  price_at_purchase: number;
  size?: string;
  color?: string;
}

interface CheckoutBody {
  items: CheckoutItem[];
  shipping_address: Record<string, string>;
  payment_method: string;
  total_amount: number;
}

// POST /api/checkout
// Atomic checkout: decrement stock → create order → create order items
export async function POST(req: NextRequest) {
  const supabase = createSupabase();

  // Verify authenticated user
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body: CheckoutBody = await req.json();
  const { items, shipping_address, payment_method, total_amount } = body;

  if (!items || items.length === 0) {
    return NextResponse.json(
      { error: 'No items in the order' },
      { status: 400 }
    );
  }

  // Step 1: Atomically decrement stock via RPC
  const stockItems = items.map((item) => ({
    product_id: item.product_id,
    quantity: item.quantity,
  }));

  const { error: stockError } = await supabase.rpc('decrement_stock', {
    items: stockItems,
  });

  if (stockError) {
    console.error('STOCK ERROR FULL:', JSON.stringify(stockError, null, 2));
    // Parse the error message for user-friendly feedback
    const message = stockError.message || 'Failed to reserve stock';

    if (message.includes('Insufficient stock')) {
      return NextResponse.json(
        {
          error: 'Some items in your cart are no longer available in the requested quantity. Please review your cart.',
          details: message,
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to process order', details: message },
      { status: 500 }
    );
  }

  // Step 2: Create order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: session.user.id,
      total_amount,
      status: 'pending',
      shipping_address,
      payment_method,
    })
    .select()
    .single();

  if (orderError) {
    // Stock was decremented but order failed — attempt to restore stock
    // In production, you'd use a saga/compensation pattern or a single DB transaction
    const restoreItems = items.map((item) => ({
      product_id: item.product_id,
      quantity: -item.quantity, // negative to add back
    }));

    await supabase.rpc('decrement_stock', { items: restoreItems });

    return NextResponse.json(
      { error: 'Failed to create order', details: orderError.message },
      { status: 500 }
    );
  }

  // Step 3: Create order items
  const orderItems = items.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
    price_at_purchase: item.price_at_purchase,
    size: item.size,
    color: item.color,
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) {
    return NextResponse.json(
      { error: 'Order created but failed to add items', details: itemsError.message },
      { status: 500 }
    );
  }

  // Step 4: Clear user's cart
  await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', session.user.id);

  return NextResponse.json({
    success: true,
    orderId: order.id,
  });
}

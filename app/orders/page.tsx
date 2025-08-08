'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Package, Eye } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface OrderItem {
  id: string;
  quantity: number;
  price_at_purchase: number;
  size?: string;
  color?: string;
  product: {
    name: string;
    image_url: string;
  };
}

interface Order {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  order_items: OrderItem[];
}

export default function OrdersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin');
      return;
    }

    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          quantity,
          price_at_purchase,
          size,
          color,
          products (
            name,
            image_url
          )
        )
      `)
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
    } else {
      setOrders(data?.map(order => ({
        ...order,
        order_items: order.order_items.map((item: any) => ({
          ...item,
          product: item.products
        }))
      })) || []);
    }
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Please Sign In</h2>
          <p className="text-muted-foreground mb-6">
            You need to sign in to view your orders
          </p>
          <Button asChild>
            <Link href="/auth/signin">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-muted rounded-lg h-32"></div>
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No orders yet</h2>
          <p className="text-muted-foreground mb-6">
            Start shopping to see your orders here
          </p>
          <Button asChild>
            <Link href="/">Start Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    Order #{order.id.slice(0, 8).toUpperCase()}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <Badge className={`${getStatusColor(order.status)} capitalize`}>
                    {order.status}
                  </Badge>
                  <p className="text-lg font-bold mt-1">₹{order.total_amount}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Order Items Preview */}
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {order.order_items.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex-shrink-0 flex items-center gap-3 min-w-[200px]">
                      <div className="relative w-12 h-12">
                        <Image
                          src={item.product.image_url}
                          alt={item.product.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-1">
                          {item.product.name}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          {item.size && <Badge variant="outline" className="text-xs">{item.size}</Badge>}
                          {item.color && <Badge variant="outline" className="text-xs">{item.color}</Badge>}
                          <span>Qty: {item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {order.order_items.length > 3 && (
                    <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-muted rounded-md">
                      <span className="text-xs font-medium">
                        +{order.order_items.length - 3}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    {order.order_items.length} item{order.order_items.length !== 1 ? 's' : ''}
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/order-confirmation/${order.id}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
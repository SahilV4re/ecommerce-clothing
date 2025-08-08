'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Package, MapPin, CreditCard, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

interface OrderItem {
  id: string;
  quantity: number;
  price_at_purchase: number; // Updated field name
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
  shipping_address: any;
  payment_method: string;
  order_items: OrderItem[];
}

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin');
      return;
    }

    fetchOrder();
  }, [user, id]);

  const fetchOrder = async () => {
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
      .eq('id', id)
      .eq('user_id', user!.id)
      .single();

    if (error) {
      console.error('Error fetching order:', error);
      router.push('/');
    } else {
      setOrder({
        ...data,
        order_items: data.order_items.map((item: any) => ({
          ...item,
          product: item.products
        }))
      });
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-2">Order not found</h2>
          <p className="text-muted-foreground mb-6">
            The order you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.
          </p>
          <Button asChild>
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  const estimatedDelivery = new Date(order.created_at);
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5); // 5 days from order date

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Success Header */}
      <div className="text-center mb-8">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-green-600 mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground">
          Thank you for your order. We&apos;ll send you a confirmation email shortly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Order ID</p>
                  <p className="font-medium">{order.id.slice(0, 8).toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Order Date</p>
                  <p className="font-medium">
                    {new Date(order.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant="secondary" className="capitalize">
                    {order.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                  <p className="font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {estimatedDelivery.toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long'
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="font-medium">{order.shipping_address.fullName}</p>
                <p>{order.shipping_address.phone}</p>
                <p>{order.shipping_address.addressLine1}</p>
                {order.shipping_address.addressLine2 && (
                  <p>{order.shipping_address.addressLine2}</p>
                )}
                <p>
                  {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span>Cash on Delivery</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Pay ₹{order.total_amount} when your order is delivered.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Order Items */}
              <div className="space-y-3">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={item.product.image_url}
                        alt={item.product.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2">
                        {item.product.name}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {item.size && <Badge variant="outline">{item.size}</Badge>}
                        {item.color && <Badge variant="outline">{item.color}</Badge>}
                        <span>Qty: {item.quantity}</span>
                      </div>
                      <p className="font-semibold text-sm">
                        ₹{item.price_at_purchase * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total Paid</span>
                <span>₹{order.total_amount}</span>
              </div>

              <div className="space-y-2">
                <Button className="w-full" asChild>
                  <Link href="/orders">View All Orders</Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/">Continue Shopping</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
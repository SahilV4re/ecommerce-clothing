'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Package, MapPin, CreditCard, User, Calendar, Phone } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';

interface OrderItem {
  price_at_purchase: number;
  id: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
  products: {
    name: string;
    image_url: string;
  };
}

interface Order {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  payment_method: string;
  shipping_address: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  users: {
    name: string;
    email: string;
  };
  order_items: OrderItem[];
}

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const { user, userRole, loading: authLoading } = useAuth();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {

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
        ),
        users (
          name,
          email
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching order:', error);
      router.push('/admin/orders');
    } else {
      // Parse JSON strings for addresses
      if (data.shipping_address && typeof data.shipping_address === 'string') {
        try {
          data.shipping_address = JSON.parse(data.shipping_address);
        } catch (e) {
          console.error('Error parsing shipping_address:', e);
        }
      }
      
      if (data.billing_address && typeof data.billing_address === 'string') {
        try {
          data.billing_address = JSON.parse(data.billing_address);
        } catch (e) {
          console.error('Error parsing billing_address:', e);
        }
      }
      
      setOrder(data);
    }
    setLoading(false);
    };
    
    if (!authLoading) {
      if (!user || userRole !== 'admin') {
        router.push('/');
        return;
      }
      fetchOrder();
    }
  }, [user, userRole, authLoading, router, id]);

  

  const updateOrderStatus = async (newStatus: string) => {
    if (!order) return;

    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', order.id);

    if (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    } else {
      setOrder({ ...order, status: newStatus });
      toast.success('Order status updated successfully');
    }
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

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-48"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-muted rounded"></div>
              <div className="h-48 bg-muted rounded"></div>
            </div>
            <div className="h-96 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user || userRole !== 'admin' || !order) {
    return null;
  }
  const subtotal = order.order_items.reduce(
  (sum, item) => sum + item.price_at_purchase * item.quantity,
  0
);

const shippingCharge = subtotal < 500 ? 99 : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/orders">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">
          Order #{order.id.slice(0, 8).toUpperCase()}
        </h1>
        <Badge className={`${getStatusColor(order.status)} capitalize`}>
          {order.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Order ID</p>
                  <p className="font-medium">{order.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Order Date</p>
                  <p className="font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(order.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="font-bold text-lg">₹{subtotal + shippingCharge}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <Badge variant="outline" className="capitalize">
                    {order.payment_method || 'Cash on Delivery'}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Update Status</p>
                <Select value={order.status} onValueChange={updateOrderStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">{order.users?.name || 'N/A'}</p>
                <p className="text-muted-foreground">{order.users?.email || 'N/A'}</p>
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
                <p className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {order.shipping_address.phone}
                </p>
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
        </div>

        {/* Order Items */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Items ({order.order_items.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 border rounded-lg">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={item.products.image_url}
                        alt={item.products.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2 mb-1">
                        {item.products.name}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        {item.size && <Badge variant="outline" className="text-xs">{item.size}</Badge>}
                        {/* {item.color && <Badge variant="outline" className="text-xs">{item.color}</Badge>} */}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Qty: {item.quantity}</span>
                        <span className="font-semibold">₹{item.price_at_purchase * item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{order.order_items.reduce((sum, item) => sum + (item.price_at_purchase * item.quantity), 0)}</span>
                </div>
                <div className="flex justify-between">
  <span>Shipping</span>
  {shippingCharge === 0 ? (
    <span className="text-green-600 font-medium">Free</span>
  ) : (
    <span>₹{shippingCharge}</span>
  )}
</div>

              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{subtotal + shippingCharge}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
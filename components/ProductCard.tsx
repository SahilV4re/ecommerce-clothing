

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  image_url: string;
  category: string;
  stock: number;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, loading } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const discountPercentage = Math.round(
    ((product.original_price! - product.price) / product.original_price!) * 100
  );


  const handleAddToCart = (e: React.MouseEvent) => {
  e.preventDefault(); // Prevent parent <Link> from navigating
  router.push(`/product/${product.id}`);
};

  // const handleAddToCart = async () => {
  //   if (!user) {
  //     toast.error('Please sign in to add items to cart');
  //     router.push('/auth/signin');
  //     return;
  //   }

  //   if (product.stock <= 0) {
  //     toast.error('Product is out of stock');
  //     return;
  //   }

  //   try {
  //     await addToCart(product.id);
  //     toast.success('Added to cart successfully!');
  //   } catch (error) {
  //     toast.error('Failed to add to cart');
  //   }
  // };

  return (
    <Link href={`/product/${product.id}`} className="block">
      <Card className="group hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-4">
          <div className="relative mb-4 overflow-hidden rounded-lg">
            <Image
              src={product.image_url}
              alt={product.name}
              width={300}
              height={300}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {discountPercentage > 0 && (
              <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                {discountPercentage}% OFF
              </Badge>
            )}
            {product.stock <= 5 && product.stock > 0 && (
              <Badge className="absolute top-2 right-2 bg-orange-500 hover:bg-orange-600">
                Only {product.stock} left
              </Badge>
            )}
            {product.stock <= 0 && (
              <Badge className="absolute top-2 right-2 bg-gray-500">
                Out of Stock
              </Badge>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-sm line-clamp-2 min-h-[2.5rem]">
              {product.name}
            </h3>
            
            {/* <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-3 w-3 fill-yellow-400 text-yellow-400"
                />
              ))}
              <span className="text-xs text-muted-foreground ml-1">(4.5)</span>
            </div> */}

            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">₹{product.price}</span>
              {product.original_price! > product.price && (
                <span className="text-sm text-muted-foreground line-through">
                  ₹{product.original_price}
                </span>
              )}
            </div>

            <Button
  className="w-full"
  onClick={handleAddToCart}
  disabled={product.stock <= 0}
>
  <ShoppingCart className="h-4 w-4 mr-2" />
  {product.stock <= 0 ? 'Out of Stock' : 'View Product'}
</Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
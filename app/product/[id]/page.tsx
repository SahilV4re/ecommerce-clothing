'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import { Star } from 'lucide-react';
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
  featured: boolean;
  description?: string;
  available_sizes?: string[];
  available_colors?: string[];
  additional_images?: string[];
}

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart, loading: cartLoading } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const stickyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      if (error) console.error('Error fetching product:', error);
      else {
        setProduct(data);
        setSelectedImage(data.image_url);
        setSelectedSize(data.available_sizes?.[0] || '');
        setSelectedColor(data.available_colors?.[0] || '');
      }
      setLoading(false);
    };
    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-muted-foreground">Product not found.</p>
      </div>
    );
  }

  const additionalImages = product.additional_images || [];
  const hasDiscount = product.original_price !== undefined && product.original_price > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.original_price! - product.price) / product.original_price!) * 100)
    : 0;
  const deliveryDate = new Date('2025-08-04T17:02:00+05:30'); // Current time: 05:02 PM IST, August 4, 2025
  deliveryDate.setDate(deliveryDate.getDate() + 1); // Assuming 1-day delivery

  const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const isSizeAvailable = (size: string) => product.available_sizes?.includes(size) || false;

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please sign in to add items to cart');
      router.push('/auth/signin');
      return;
    }

    if (!selectedSize || !selectedColor) {
      toast.error('Please select a size and color.');
      return;
    }

    if (product.stock <= 0) {
      toast.error('Product is out of stock');
      return;
    }

    try {
      await addToCart(product.id, 1, selectedSize, selectedColor);
      toast.success('Added to cart successfully!');
    } catch (error) {
      toast.error('Failed to add to cart');
      console.error('Cart error:', error);
    }
  };

  const handleBuyNow = () => {
    if (!selectedSize || !selectedColor) {
      toast.error('Please select a size and color.');
      return;
    }
    console.log(`Buying ${product.name} - Size: ${selectedSize}, Color: ${selectedColor}`);
  };

  const colorMap: { [key: string]: string } = {
    Black: '#000000',
    White: '#FFFFFF',
    Blue: '#0000FF',
    Red: '#FF0000',
    Green: '#00FF00',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 max-w-7xl mx-auto">
          {/* Image Gallery */}
          <div className="space-y-6">
            <div className="w-full h-[500px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-contain p-4 transition-transform hover:scale-105"
              />
            </div>
            <div className="grid grid-cols-5 gap-4">
              {[product.image_url, ...additionalImages].map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className="w-full h-24 bg-gray-100 rounded-lg overflow-hidden hover:border-2 hover:border-primary transition-all shadow-md hover:shadow-lg"
                >
                  <img
                    src={img}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="w-full h-full object-contain p-2 transition-opacity hover:opacity-90"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info and Sticky Actions */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current animate-pulse" />
                ))}
                <span className="text-sm text-gray-600">(4.5 | 1,234 ratings)</span>
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-xl font-bold text-gray-900">
                  ₹{product.price.toFixed(2)}
                  {hasDiscount && (
                    <span className="text-lg text-gray-500 line-through ml-2">
                      ₹{product.original_price!.toFixed(2)}
                    </span>
                  )}
                  {hasDiscount && (
                    <span className="text-red-500 font-semibold ml-2">
                      ({discountPercentage}% off)
                    </span>
                  )}
                </p>
                <p className="text-sm text-gray-600">
                  Inclusive of all taxes | Free delivery by {deliveryDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {product.stock > 0 ? `In Stock: ${product.stock} units` : 'Out of Stock'}
              </p>
            </div>

            {/* Sticky Action Panel */}
            <div
              ref={stickyRef}
              className="lg:sticky lg:top-20 p-6 bg-white rounded-xl shadow-lg border border-gray-200"
            >
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Size</label>
                  <div className="grid grid-cols-3 gap-3">
                    {allSizes.map((size) => (
                      <label key={size} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="size"
                          value={size}
                          checked={selectedSize === size}
                          onChange={(e) => setSelectedSize(e.target.value)}
                          disabled={!isSizeAvailable(size)}
                          className="hidden"
                        />
                        <span
                          className={`w-12 h-12 flex items-center justify-center rounded-full border-2 cursor-pointer transition-all text-lg font-semibold ${
                            selectedSize === size
                              ? 'border-primary bg-gradient-to-br from-primary/20 to-white text-primary'
                              : isSizeAvailable(size)
                              ? 'border-gray-300 hover:border-primary hover:bg-gray-100'
                              : 'border-gray-400 bg-gray-200 line-through text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {size}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Color</label>
                  <div className="flex gap-3 flex-wrap">
                    {product.available_colors?.map((color) => (
                      <label key={color} className="flex items-center space-x-1">
                        <input
                          type="radio"
                          name="color"
                          value={color}
                          checked={selectedColor === color}
                          onChange={(e) => setSelectedColor(e.target.value)}
                          className="hidden"
                        />
                        <span
                          className={`w-10 h-10 rounded-full border-2 cursor-pointer transition-all flex items-center justify-center ${
                            selectedColor === color ? 'border-primary' : 'border-gray-300 hover:border-primary'
                          }`}
                          style={{ backgroundColor: colorMap[color] || '#000000' }}
                          title={color}
                        >
                          {selectedColor === color && <span className="text-white text-xs">✔</span>}
                        </span>
                      </label>
                    )) || <p className="text-sm text-gray-500">No colors available</p>}
                  </div>
                </div>
                <Button
                  className="w-full rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors"
                  onClick={handleAddToCart}
                  disabled={cartLoading || product.stock <= 0 || !selectedSize || !selectedColor}
                >
                  {cartLoading ? 'Adding...' : 'Add to Cart'}
                </Button>
                <Button
                  variant="secondary"
                  className="w-full rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0 || !selectedSize || !selectedColor}
                >
                  Buy Now
                </Button>
              </div>
            </div>

            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-gradient-to-b from-gray-100 to-gray-200 p-1 rounded-lg">
                <TabsTrigger value="description" className="data-[state=active]:bg-white data-[state=active]:shadow-md">Description</TabsTrigger>
                <TabsTrigger value="reviews" className="data-[state=active]:bg-white data-[state=active]:shadow-md">Reviews</TabsTrigger>
                <TabsTrigger value="details" className="data-[state=active]:bg-white data-[state=active]:shadow-md">Additional Details</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-4 text-gray-700">
                <p className="text-left">
                  {product.description || 'No description available for this product.'}
                </p>
              </TabsContent>
              <TabsContent value="reviews" className="mt-4 text-gray-700">
                <p className="text-left">
                  No reviews yet. Be the first to review this product!
                </p>
              </TabsContent>
              <TabsContent value="details" className="mt-4 text-gray-700">
                <ul className="list-disc list-inside space-y-2">
                  <li>Category: {product.category}</li>
                  <li>Material: 100% Cotton (example)</li>
                  <li>Care Instructions: Machine wash cold</li>
                </ul>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Call to Action */}
        <section className="text-center mt-16">
          <h2 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
            Explore More Styles
          </h2>
          <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
            Discover other products in this category.
          </p>
          <Button asChild className="rounded-full bg-gradient-to-r from-primary to-blue-600 text-white hover:from-primary/80 hover:to-blue-500 px-6 py-2">
            <Link href={`/category/${product.category.toLowerCase()}`}>Shop Category</Link>
          </Button>
        </section>
      </main>
    </div>
  );
}
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import ProductCard from '@/components/ProductCard';

interface Product {
  id: string;
  name: string;
  price: number;
  original_price: number;
  image_url: string;
  category: string;
  stock: number;
  featured: boolean;
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    
    const [featuredResponse, popularResponse] = await Promise.all([
      supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .gt('stock', 0)
        .limit(6),
      supabase
        .from('products')
        .select('*')
        .gt('stock', 0)
        .order('created_at', { ascending: false })
        .limit(6)
    ]);

    if (featuredResponse.data) {
      setFeaturedProducts(featuredResponse.data);
    }
    if (popularResponse.data) {
      setPopularProducts(popularResponse.data);
    }
    
    setLoading(false);
  };

  const categories = [
    {
      name: 'Men\'s Fashion',
      href: '/category/men',
      image: 'https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg',
    },
    {
      name: 'Women\'s Fashion',
      href: '/category/women',
      image: 'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg',
    },
    {
      name: 'Kids\' Fashion',
      href: '/category/kids',
      image: 'https://images.pexels.com/photos/1648377/pexels-photo-1648377.jpeg',
    },
    {
      name: 'New Collections',
      href: '/new-collections',
      image: 'https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg',
    },
    {
      name: 'Special Offers',
      href: '/offers',
      image: 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg',
    },
  ];

  const reviews = [
    {
      name: 'Sarah Johnson',
      rating: 5,
      comment: 'Amazing quality and fast delivery! Will definitely shop again.',
      avatar: 'S'
    },
    {
      name: 'Mike Chen',
      rating: 5,
      comment: 'Great selection of trendy clothes. Perfect fit and comfortable.',
      avatar: 'M'
    },
    {
      name: 'Emily Davis',
      rating: 5,
      comment: 'Excellent customer service and beautiful designs. Highly recommended!',
      avatar: 'E'
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/5 to-primary/10 py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Discover Unique Styles –{' '}
                <span className="text-primary">New Arrivals!</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Shop the latest in comfort and culture-inspired fashion for all ages.
                From trendy streetwear to elegant formal wear, find your perfect style.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/category/men">Shop Men&apos;s</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/category/women">Shop Women&apos;s</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/hero1.jpg"
                alt="Fashion Collection"
                width={600}
                height={400}
                className="rounded-xl shadow-2xl object-cover w-full h-[400px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category, index) => (
              <Link key={index} href={category.href}>
                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <div className="relative mb-4 overflow-hidden rounded-full">
                      <Image
                        src={category.image}
                        alt={category.name}
                        width={80}
                        height={80}
                        className="mx-auto w-20 h-20 object-cover rounded-full transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-bold">Featured Products</h2>
              <Button variant="outline" asChild>
                <Link href="/category/men">View All</Link>
              </Button>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-muted rounded-lg h-48 mb-4"></div>
                    <div className="space-y-2">
                      <div className="bg-muted rounded h-4 w-3/4"></div>
                      <div className="bg-muted rounded h-4 w-1/2"></div>
                      <div className="bg-muted rounded h-8 w-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Popular Products */}
      {popularProducts.length > 0 && (
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-bold">Popular Products</h2>
              <Button variant="outline" asChild>
                <Link href="/category/women">View All</Link>
              </Button>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-muted rounded-lg h-48 mb-4"></div>
                    <div className="space-y-2">
                      <div className="bg-muted rounded h-4 w-3/4"></div>
                      <div className="bg-muted rounded h-4 w-1/2"></div>
                      <div className="bg-muted rounded h-8 w-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {popularProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Customer Reviews */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Customers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <Avatar className="mx-auto mb-4 w-16 h-16">
                    <AvatarFallback className="text-lg font-semibold">
                      {review.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex justify-center mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-lg">★</span>
                    ))}
                  </div>
                  <blockquote className="italic text-muted-foreground mb-4">
                    &quot;{review.comment}&quot;
                  </blockquote>
                  <cite className="font-semibold">{review.name}</cite>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-lg mb-8 opacity-90">
            Subscribe to our newsletter for the latest fashion trends and exclusive offers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-md text-foreground"
            />
            <Button variant="secondary">Subscribe</Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">UrbanAttire</h3>
              <p className="text-muted-foreground">
                Your destination for trendy and comfortable fashion for all ages.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/category/men" className="hover:text-foreground">Men&apos;s Fashion</Link></li>
                <li><Link href="/category/women" className="hover:text-foreground">Women&apos;s Fashion</Link></li>
                <li><Link href="/category/kids" className="hover:text-foreground">Kid&apos;s Fashion</Link></li>
                <li><Link href="/new-collections" className="hover:text-foreground">New Collections</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Customer Service</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/contact" className="hover:text-foreground">Contact Us</Link></li>
                <li><Link href="/shipping" className="hover:text-foreground">Shipping Info</Link></li>
                <li><Link href="/returns" className="hover:text-foreground">Returns</Link></li>
                <li><Link href="/size-guide" className="hover:text-foreground">Size Guide</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground">Terms of Service</Link></li>
                <li><Link href="/cookies" className="hover:text-foreground">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 UrbanAttire. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
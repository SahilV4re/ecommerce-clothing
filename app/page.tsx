'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import ProductCard from '@/components/ProductCard';
import { useKeenSlider } from 'keen-slider/react';


const heroSlides = [
  {
    image: 'https://images.pexels.com/photos/1670766/pexels-photo-1670766.jpeg',
    title: 'Unleash Your Style',
    subtitle: 'Bold. Fresh. Unapologetic.',
    buttonText: 'Shop Now',
    href: '/new-collection',
  },
  {
    image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg',
    title: 'Elevate Everyday',
    subtitle: 'Trendy fits for every vibe.',
    buttonText: 'Shop Men',
    href: '/category/men',
  },
  {
    image: '/new-clloection.jpg',
    title: 'Own the Moment',
    subtitle: 'Curated for the fearless.',
    buttonText: 'Shop Women',
    href: '/category/women',
  },
];

const categories = [
  { name: "Men's Fashion", href: '/category/men', image: 'https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg' },
  { name: "Women's Fashion", href: '/category/women', image: 'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg' },
  { name: "Kids' Fashion", href: '/category/kids', image: 'https://images.pexels.com/photos/1648377/pexels-photo-1648377.jpeg' },
  { name: 'New Collections', href: '/new-collection', image: 'https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg' },
  { name: 'Special Offers', href: '/special-offers', image: 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg' },
];

const testimonials = [
  {
    name: 'Alex Thompson',
    initials: 'AT',
    quote: 'The quality and style of the clothes are unmatched! Fast shipping and great customer service.',
    image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
  },
  {
    name: 'Sarah Lee',
    initials: 'SL',
    quote: 'I love the curated collections! It’s so easy to find trendy outfits for any occasion.',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
  },
  {
    name: 'Michael Chen',
    initials: 'MC',
    quote: 'Amazing deals and super comfortable clothing. This is my go-to store now!',
    image: 'https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg',
  },
];

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
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);

    const [featuredResponse, popularResponse] = await Promise.all([
      supabase.from('products').select('*').eq('featured', true).gt('stock', 0).limit(6),
      supabase.from('products').select('*').gt('stock', 0).order('created_at', { ascending: false }).limit(6),
    ]);

    if (featuredResponse.data) {
      setFeaturedProducts(featuredResponse.data);
    }
    if (popularResponse.data) {
      setPopularProducts(popularResponse.data);
    }

    setLoading(false);
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('newsletter_subscribers').insert([{ email }]);
      if (error) throw error;
      setNewsletterStatus('success');
      setEmail('');
      setTimeout(() => setNewsletterStatus('idle'), 3000);
    } catch (error) {
      setNewsletterStatus('error');
      setTimeout(() => setNewsletterStatus('idle'), 3000);
    }
  };

  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 1 },
    drag: true,
    created(s) {
      setInterval(() => s.next(), 3000);
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative -mt-[120px] z-10">
        <div ref={sliderRef} className="keen-slider h-[110vh] overflow-hidden">
          {heroSlides.map((slide, index) => (
            <div key={index} className="keen-slider__slide relative will-change-transform">
              <Image
                src={slide.image}
                alt={slide.title}
                width={256}
                height={256}
                className="w-full h-full object-cover opacity-90 transition-transform duration-1000 ease-in-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-center items-center text-center px-4">
                <h2 className="text-white text-4xl md:text-6xl font-extrabold drop-shadow-lg mb-4 will-change-opacity transition-opacity duration-500">
                  {slide.title}
                </h2>
                <p className="text-white text-xl md:text-2xl drop-shadow-md mb-6 will-change-opacity transition-opacity duration-500">
                  {slide.subtitle}
                </p>
                <a
                  href={slide.href}
                  className="inline-flex items-center justify-center rounded-full bg-stone-200 text-black px-6 py-3 text-lg font-semibold hover:bg-white transition-colors duration-300 will-change-transform"
                >
                  {slide.buttonText}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {categories.map((category, index) => (
              <Link key={index} href={category.href} className="group">
                <Card className="overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all">
                  <CardContent className="p-4">
                    <div className="relative w-full h-32 rounded-xl overflow-hidden mb-4">
                      <Image src={category.image} alt={category.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <h3 className="text-center font-semibold text-base text-foreground group-hover:text-primary">
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
        <section className="py-20 px-6 bg-muted/30">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-4xl font-bold">Featured Products</h2>
              <Button variant="outline" asChild>
                <Link href="/category/men">View All</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {loading
                ? [...Array(4)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-muted rounded-lg h-48 mb-4"></div>
                      <div className="space-y-2">
                        <div className="bg-muted rounded h-4 w-3/4"></div>
                        <div className="bg-muted rounded h-4 w-1/2"></div>
                        <div className="bg-muted rounded h-8 w-full"></div>
                      </div>
                    </div>
                  ))
                : featuredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          </div>
        </section>
      )}

      {/* Customer Testimonials */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 shadow-md hover:shadow-lg transition-all">
                <CardContent className="flex flex-col items-center text-center">
                  <Avatar className="w-16 h-16 mb-4">
                    <Image src={testimonial.image} alt={testimonial.name} width={256} height={256} className="object-cover" />
                    <AvatarFallback>{testimonial.initials}</AvatarFallback>
                  </Avatar>
                  <p className="text-muted-foreground italic mb-4">{testimonial.quote}</p>
                  <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 px-6 bg-primary/10">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Join Our Newsletter</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
            Stay updated with the latest trends, exclusive offers, and more!
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row justify-center gap-4 max-w-lg mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-full px-6 py-3"
              required
            />
            <Button type="submit" className="rounded-full px-6 py-3">
              Subscribe
            </Button>
          </form>
          {newsletterStatus === 'success' && (
            <p className="text-green-600 mt-4">Thank you for subscribing!</p>
          )}
          {newsletterStatus === 'error' && (
            <p className="text-red-600 mt-4">Something went wrong. Please try again.</p>
          )}
        </div>
      </section>

      {/* Popular Products */}
      {popularProducts.length > 0 && (
        <section className="py-20 px-6">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-4xl font-bold">Popular Products</h2>
              <Button variant="outline" asChild>
                <Link href="/category/women">View All</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {loading
                ? [...Array(4)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-muted rounded-lg h-48 mb-4"></div>
                      <div className="space-y-2">
                        <div className="bg-muted rounded h-4 w-3/4"></div>
                        <div className="bg-muted rounded h-4 w-1/2"></div>
                        <div className="bg-muted rounded h-8 w-full"></div>
                      </div>
                    </div>
                  ))
                : popularProducts.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
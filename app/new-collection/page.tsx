// app/new-collections/page.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import Image from 'next/image';

const products = [
  {
    id: 1,
    title: 'Minimal Hoodie',
    price: 999,
    originalPrice: 1499,
    discount: '33% OFF',
    rating: 4.5,
    image: '/hoodie.png',
  },
  {
    id: 2,
    title: 'Casual Jacket',
    price: 1299,
    originalPrice: 1899,
    discount: '31% OFF',
    rating: 4.7,
    image: '/jacket.png',
  },
];

export default function NewCollectionsPage() {
  return (
    <div className="px-4 sm:px-6 md:px-10 py-12 max-w-8xl mx-auto">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-white to-gray-100 rounded-3xl shadow-md p-10 mb-16 flex flex-col-reverse md:flex-row items-center gap-10 overflow-hidden">
        <div className="max-w-xl">
          <h1 className="text-5xl font-extrabold tracking-tight leading-tight">
            Step Into Style
          </h1>
          <p className="text-muted-foreground mt-4 text-lg">
            Explore our exclusive new arrivals made for your everyday looks.
          </p>
          <Button className="mt-6 px-6 py-3 text-lg">Shop Now</Button>
        </div>
        <div className="w-full ">
          <Image
            src="https://i2.ppvise.site/gimg/c7ec44c562.jpg" // Replace with your own hero image
            alt="New Collection"
            width={500}
            height={500}
            className="object-fit"
          />
        </div>
      </section>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-10">
        <Input placeholder="Search new arrivals..." className="w-full max-w-md" />
        <Button variant="outline">Filter</Button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="group hover:shadow-xl transition-shadow">
            <div className="relative">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-64 object-cover rounded-t-md"
              />
              <Badge className="absolute top-2 left-2">{product.discount}</Badge>
            </div>
            <CardContent className="py-4">
              <h3 className="font-medium text-lg">{product.title}</h3>
              <div className="flex items-center mt-1 text-sm text-muted-foreground">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                {product.rating}
              </div>
              <div className="mt-2 text-lg font-semibold text-black">
                ₹{product.price}{' '}
                <span className="line-through text-sm text-muted-foreground ml-2">
                  ₹{product.originalPrice}
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Add to Cart</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

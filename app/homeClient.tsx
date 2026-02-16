'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import ProductCard from '@/components/ProductCard';
import { useKeenSlider } from 'keen-slider/react';

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

interface HomeClientProps {
  featuredProducts: Product[];
  popularProducts: Product[];
}

/* ------------------- STATIC DATA ------------------- */

const heroSlides = [
  {
    image: '/mens-hero.webp',
    title: 'Unleash Your Style',
    subtitle: 'Bold. Fresh. Unapologetic.',
    buttonText: 'Shop Now',
    href: '/new-collection',
  },
  {
    image: '/mens-hero2.webp',
    title: 'Elevate Everyday',
    subtitle: 'Trendy fits for every vibe.',
    buttonText: 'Shop Men',
    href: '/category/men',
  },
  {
    image: '/new-collection.webp',
    title: 'Own the Moment',
    subtitle: 'Curated for the fearless.',
    buttonText: 'Shop Women',
    href: '/category/women',
  },
];

const categories = [
  { name: "Men's Fashion", href: '/category/men', image: '/mens-cat.webp' },
  { name: "Women's Fashion", href: '/category/women', image: '/womens-cat.webp' },
  { name: "Kids' Fashion", href: '/category/kids', image: '/kids-cat.webp' },
  { name: 'New Collections', href: '/new-collection', image: '/new-col-cat.webp' },
  { name: 'Special Offers', href: '/special-offers', image: '/special-cat.webp' },
];

const testimonials = [
  { name: 'Sunil Dhage', initials: 'SD', quote: 'The quality and style are unmatched!' },
  { name: 'Aadesh Lad', initials: 'AL', quote: 'Love the curated collections!' },
  { name: 'Avaneesh Kadam', initials: 'AK', quote: 'Amazing deals and comfort!' },
];

/* ------------------- COMPONENT ------------------- */

export default function HomeClient({
  featuredProducts,
  popularProducts,
}: HomeClientProps) {
  
  /* ---------- Slider Setup ---------- */

  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 1 },
    created(slider) {
      const interval = setInterval(() => slider.next(), 4000);
      slider.on('destroyed', () => clearInterval(interval));
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ================= HERO ================= */}
<section className="relative -mt-[120px] z-10">
  <div ref={sliderRef} className="keen-slider h-[110vh] overflow-hidden">
    {heroSlides.map((slide, index) => (
      <div key={index} className="keen-slider__slide relative">
        
        {/* Image Wrapper */}
        <div className="relative w-full h-[110vh]">
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover"
          />
        </div>

        {/* Overlay Content */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-center items-center text-center px-4">
          <h2 className="text-white text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
            {slide.title}
          </h2>

          <p className="text-white text-xl md:text-2xl mb-6 drop-shadow-md">
            {slide.subtitle}
          </p>

          <Link href={slide.href}>
            <Button size="lg" className="inline-flex items-center justify-center rounded-full bg-stone-200 text-black px-6 py-3 text-lg font-semibold hover:bg-white transition-colors duration-300 will-change-transform">
              {slide.buttonText}
            </Button>
          </Link>
        </div>

      </div>
    ))}
  </div>
</section>


      {/* ================= CATEGORY ================= */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Shop by Category
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category, index) => (
              <Link key={index} href={category.href}>
                <Card className="overflow-hidden hover:shadow-lg transition">
                  <CardContent className="p-4">
                    <div className="relative w-full h-32 mb-4">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        sizes="(max-width:768px) 50vw, 20vw"
                        className="object-cover rounded-md"
                      />
                    </div>
                    <h3 className="text-center font-medium">
                      {category.name}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURED ================= */}
      {featuredProducts.length > 0 && (
        <section className="py-16 px-6 bg-muted/30">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-bold">Featured Products</h2>
              <Link href="/category/men">
                <Button variant="outline">View All</Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= TESTIMONIALS ================= */}
      <section className="py-16 px-6 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Customers Say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <CardContent className="text-center">
                  <Avatar className="w-14 h-14 mx-auto mb-4">
                    <AvatarFallback>
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <p className="italic mb-3 text-muted-foreground">
                    {testimonial.quote}
                  </p>
                  <h3 className="font-semibold">{testimonial.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ================= POPULAR ================= */}
      {popularProducts.length > 0 && (
        <section className="py-16 px-6">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-bold">Popular Products</h2>
              <Link href="/category/women">
                <Button variant="outline">View All</Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {popularProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

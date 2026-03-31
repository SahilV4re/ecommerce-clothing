'use client';

import React from 'react';
import IKProductImage from '@/components/IKProductImage';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';

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

interface HeroSlide {
  id: string;
  image_url: string;
  title: string;
  subtitle: string;
  button_text: string;
  button_link: string;
}

interface HomeClientProps {
  heroSlides: HeroSlide[];
  featuredProducts: Product[];
  popularProducts: Product[];
}

/* ------------------- STATIC CATEGORY DATA ------------------- */
const categories = [
  { name: "Men", href: '/category/men', image: 'https://ik.imagekit.io/opc6rkvof/heroes/hero-11df740e-f17a-4786-a09d-70ea06b73680_jsr4BZpGr?updatedAt=1774956574528' },
  { name: "Women", href: '/category/women', image: 'https://ik.imagekit.io/opc6rkvof/heroes/hero-a3705ae0-37f6-49bb-9fc3-07b9708930ff_4GG0keOq7?updatedAt=1774957803847' },
  { name: "Kids", href: '/category/kids', image: 'https://ik.imagekit.io/opc6rkvof/heroes/hero-052e4083-e954-4f12-b9eb-84c9a77b5efe_elJnkYYfF?updatedAt=1774958035559' },
  { name: 'New Drops', href: '/new-collection', image: 'https://ik.imagekit.io/opc6rkvof/static/new-col-cat_ipFqffCpN.webp' },
];

export default function HomeClient({
  heroSlides,
  featuredProducts,
  popularProducts,
}: HomeClientProps) {
  
  /* ---------- Slider Setup ---------- */
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 1 },
    created(slider) {
      const interval = setInterval(() => slider.next(), 5000);
      slider.on('destroyed', () => clearInterval(interval));
    },
  });

  const [categorySliderRef] = useKeenSlider<HTMLDivElement>({
    loop: false,
    mode: "free-snap",
    slides: {
      perView: 1.5,
      spacing: 16,
    },
    breakpoints: {
      "(min-width: 640px)": {
        slides: { perView: 2.5, spacing: 20 },
      },
      "(min-width: 1024px)": {
        slides: { perView: 4, spacing: 24 },
      },
    },
  });

  // Default fallback slides if none in DB
  const displayHeroes = heroSlides.length > 0 ? heroSlides : [
     {
      id: 'fallback',
      image_url: 'https://ik.imagekit.io/opc6rkvof/static/mens-hero_XZe_-Mw99.webp',
      title: 'UNLEASH YOUR STYLE',
      subtitle: 'Bold. Fresh. Unapologetic.',
      button_text: 'Shop Now',
      button_link: '/new-collection',
    }
  ];

  return (
    <div className="min-h-screen bg-white selection:bg-black selection:text-white -mt-[92px]">
      
      {/* ================= HERO ================= */}
      <section className="relative h-[100vh] md:h-[calc(100vh+92px)] w-full bg-black">
        <div ref={sliderRef} className="keen-slider h-full w-full">
          {displayHeroes.map((slide, index) => (
            <div key={slide.id} className="keen-slider__slide relative w-full h-full">
              {/* Image */}
              <div className="absolute inset-0 w-full h-full">
                <IKProductImage
                  src={slide.image_url}
                  alt={slide.title}
                  fill
                  priority={index === 0}
                  className="object-cover opacity-80"
                  transformation={[{ quality: "85", f: "auto" }]}
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end items-center text-center px-4 pb-20 md:pb-32">
                <h2 className="text-white text-5xl md:text-7xl lg:text-8xl font-medium uppercase tracking-wide mb-2 leading-none">
                  {slide.title}
                </h2>
                
                {slide.subtitle && (
                  <p className="text-gray-300 text-lg md:text-2xl font-light uppercase tracking-widest mb-8">
                    {slide.subtitle}
                  </p>
                )}

                <Link href={slide.button_link}>
                  <Button className="bg-white text-black hover:bg-gray-200 hover:text-black rounded-none px-10 py-6 text-sm md:text-base font-bold uppercase tracking-widest transition-all">
                    {slide.button_text}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Minimal Indicators */}
        {displayHeroes.length > 1 && (
          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-10">
            {displayHeroes.map((_, idx) => (
              <button
                key={idx}
                onClick={() => instanceRef.current?.moveToIdx(idx)}
                className="w-12 h-1 bg-white/40 hover:bg-white transition-colors"
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* ================= CATEGORY SCROLL (Snitch Style) ================= */}
      <section className="py-20 px-4 md:px-8 bg-white">
        <div className="container mx-auto max-w-[1600px]">
          <h2 className="text-3xl md:text-4xl font-medium uppercase tracking-wide mb-10">
            Shop By Category
          </h2>

          <div ref={categorySliderRef} className="keen-slider cursor-grab active:cursor-grabbing">
            {categories.map((category, index) => (
              <div key={index} className="keen-slider__slide relative group aspect-[3/4] overflow-hidden bg-gray-100">
                <Link href={category.href} className="w-full h-full block">
                  <IKProductImage
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 640px) 70vw, (max-width: 1024px) 40vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    transformation={[{ width: "600", height: "800", quality: "80", f: "auto" }]}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />
                  
                  <div className="absolute bottom-6 left-6">
                    <h3 className="text-2xl font-bold text-white uppercase tracking-wider mb-2">
                      {category.name}
                    </h3>
                    <div className="w-8 h-[2px] bg-white group-hover:w-16 transition-all duration-300" />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURED ================= */}
      {featuredProducts.length > 0 && (
        <section className="py-20 px-4 md:px-8 bg-gray-50 border-t border-b border-gray-100">
          <div className="container mx-auto max-w-[1600px]">
            <div className="flex justify-between items-end mb-12">
              <h2 className="text-3xl md:text-4xl font-medium uppercase tracking-wide">
                Featured
              </h2>
              <Link href="/category/men" className="text-sm font-bold uppercase tracking-widest border-b-2 border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors">
                View All
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}
          
      {/* ================= BRAND STORY (Editorial Style) ================= */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8 max-w-[1200px]">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            
            <div className="relative">
              <div className="text-8xl text-gray-100 font-serif absolute -top-12 -left-6 -z-10">"</div>
              <h3 className="text-4xl md:text-5xl font-medium uppercase tracking-wide leading-tight mb-8">
                Your <br/><span className="text-gray-400">Satisfaction</span><br/> is our <br/>Motivation.
              </h3>
              <p className="font-bold uppercase tracking-widest text-sm text-gray-400">
                — Rachana Palav, Founder
              </p>
            </div>

            <div className="space-y-6 text-gray-600 text-lg leading-relaxed font-light">
              <p>
                <strong className="text-black font-semibold">Kalastra Clothing</strong> embarked on its journey on October 1, 2020. The idea was born from a deep passion for fashion and a desire to create a brand that seamlessly blends style with quality.
              </p>
              <p>
                The name Kalastra combines <span className="italic">“Kala”</span> (Art) and <span className="italic">“Vastra”</span> (Clothing), symbolizing wearable art crafted with creativity and purpose.
              </p>
              <p>
                Inspired by her mother’s dedication to stitching at home, Kalastra aims to create trendsetting pieces that empower individuals to embrace their personal, unapologetic style.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ================= POPULAR ================= */}
      {popularProducts.length > 0 && (
        <section className="py-20 px-4 md:px-8 bg-white border-t border-gray-100">
          <div className="container mx-auto max-w-[1600px]">
            <div className="flex justify-between items-end mb-12">
              <h2 className="text-3xl md:text-4xl font-medium uppercase tracking-wide">
                Trending Now
              </h2>
              <Link href="/category/women" className="text-sm font-bold uppercase tracking-widest border-b-2 border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors">
                View All
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
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

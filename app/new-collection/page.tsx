'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard'; // Import the ProductCard component
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  description?: string;
  category: string;
  subcategory?: string;
  image_url: string;
  stock: number;
  featured: boolean;
}

const categories = ['All', 'men', 'women', 'kids'];

export default function NewCollectionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const { addToCart, loading: cartLoading } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchNewArrivals() {
      setLoadingProducts(true);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, original_price, description, category, subcategory, image_url, stock, featured, created_at')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching new arrivals:', error);
        toast({
          title: 'Error',
          description: 'Failed to load new arrivals. Please try again.',
          variant: 'destructive',
          duration: 3000,
        });
      } else {
        setProducts(
          data?.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            original_price: item.original_price,
            description: item.description,
            category: item.category,
            subcategory: item.subcategory,
            image_url: item.image_url,
            stock: item.stock,
            featured: item.featured,
          })) || []
        );
      }
      setLoadingProducts(false);
    }
    fetchNewArrivals();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="px-4 sm:px-6 md:px-10 py-12 max-w-8xl mx-auto bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-teal-500 to-red-400 rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 mb-16 flex flex-col-reverse md:flex-row items-center gap-6 md:gap-8 overflow-hidden">
        <motion.div
          className="max-w-lg text-center md:text-left z-10"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-white">
            Discover Fresh Styles
          </h1>
          <p className="text-gray-100 mt-4 text-base sm:text-lg">
            Unveil our latest collection crafted for bold, everyday fashion.
          </p>
          <Button
            className="mt-6 px-6 py-2 text-base sm:text-lg bg-white text-black hover:bg-gray-200 transition-colors"
            asChild
          >
            <a href="#products">Shop Now</a>
          </Button>
        </motion.div>
        <motion.div
          className="w-full"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Image
            src="/hero.jpg"
            alt="New Collection"
            width={400}
            height={400}
            className="object-cover md:object-fit rounded-lg w-full h-auto md:h-96"
            priority
          />
        </motion.div>
        <div className="absolute inset-0 bg-black/30 z-0" />
      </section>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12">
        <Input
          placeholder="Search new arrivals..."
          className="w-full max-w-md border-gray-300 focus:ring-teal-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search products"
        />
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              className={`px-4 py-2 ${selectedCategory === category ? 'bg-black text-white' : 'text-gray-700'}`}
              onClick={() => setSelectedCategory(category)}
              aria-pressed={selectedCategory === category}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {loadingProducts ? (
        <motion.p
          className="text-center text-gray-500 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Loading new arrivals...
        </motion.p>
      ) : (
        <motion.div
          id="products"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard product={product} /> {/* Use the ProductCard component */}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {!loadingProducts && filteredProducts.length === 0 && (
        <motion.p
          className="text-center text-gray-500 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          No products found. Try adjusting your search or filters.
        </motion.p>
      )}
    </div>
  );
}
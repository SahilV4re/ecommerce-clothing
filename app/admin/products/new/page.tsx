'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const COLORS = ['Black', 'White', 'Blue', 'Red', 'Green'];

export default function NewProductPage() {
  const { user, userRole } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<FileList | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    category: '',
    subcategory: '',
    stock: '',
    featured: false,
    available_sizes: [] as string[],
    available_colors: [] as string[],
  });

  useEffect(() => {
    if (!user || userRole !== 'admin') router.push('/');
  }, [user, userRole, router]);

  /* ---------------- IMAGE UPLOAD ---------------- */
  const uploadImages = async (files: FileList) => {
    const urls: string[] = [];

    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop();
      const fileName = `products/${crypto.randomUUID()}.${ext}`;

      const { error } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (error) throw error;

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      urls.push(data.publicUrl);
    }

    return urls;
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!images || images.length === 0) {
        toast.error('Please upload at least one image');
        return;
      }

      if (formData.available_sizes.length === 0) {
        toast.error('Select at least one size');
        return;
      }
      

      const imageUrls = await uploadImages(images);

      const { error } = await supabase.from('products').insert({
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        original_price: Number(formData.original_price),
        category: formData.category,
        subcategory: formData.subcategory,
        stock: Number(formData.stock),
        featured: formData.featured,
        image_url: imageUrls[0],
        additional_images: imageUrls.slice(1),
        available_sizes: formData.available_sizes,
        available_colors: formData.available_colors,
      });

      if (error) throw error;

      toast.success('Product added successfully');
      router.push('/admin');
    } catch (err: any) {
      toast.error(err.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <Label>Product Name</Label>
              <Input required onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea required onChange={e => setFormData({ ...formData, description: e.target.value })} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="Sale Price" type="number" required onChange={e => setFormData({ ...formData, price: e.target.value })} />
              <Input placeholder="Original Price" type="number" required onChange={e => setFormData({ ...formData, original_price: e.target.value })} />
            </div>

            <Select onValueChange={v => setFormData({ ...formData, category: v })}>
              <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="men">Men</SelectItem>
                <SelectItem value="women">Women</SelectItem>
                <SelectItem value="kids">Kids</SelectItem>
              </SelectContent>
            </Select>

            <Input placeholder="Subcategory" required onChange={e => setFormData({ ...formData, subcategory: e.target.value })} />

            {/* -------- SIZES -------- */}
            <div>
              <Label>Available Sizes</Label>
              <div className="flex gap-2 flex-wrap mt-2">
                {SIZES.map(size => (
                  <Button
                    type="button"
                    key={size}
                    variant={formData.available_sizes.includes(size) ? 'default' : 'outline'}
                    onClick={() =>
                      setFormData(prev => ({
                        ...prev,
                        available_sizes: prev.available_sizes.includes(size)
                          ? prev.available_sizes.filter(s => s !== size)
                          : [...prev.available_sizes, size],
                      }))
                    }
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {/* -------- COLORS -------- */}
            {/* <div>
              <Label>Available Colors</Label>
              <div className="flex gap-2 flex-wrap mt-2">
                {COLORS.map(color => (
                  <Button
                    type="button"
                    key={color}
                    variant={formData.available_colors.includes(color) ? 'default' : 'outline'}
                    onClick={() =>
                      setFormData(prev => ({
                        ...prev,
                        available_colors: prev.available_colors.includes(color)
                          ? prev.available_colors.filter(c => c !== color)
                          : [...prev.available_colors, color],
                      }))
                    }
                  >
                    {color}
                  </Button>
                ))}
              </div>
            </div> */}

            {/* -------- IMAGES -------- */}
            <div>
              <Label>Product Images</Label>
              <Input type="file" multiple accept="image/*" onChange={e => setImages(e.target.files)} />

              {images && (
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {Array.from(images).map((file, i) => (
                    <Image
                      key={i}
                      src={URL.createObjectURL(file)}
                      alt=""
                      width={100}
                      height={100}
                      className="h-24 w-full object-cover rounded"
                    />
                  ))}
                </div>
              )}
            </div>

            <Input placeholder="Stock Quantity" type="number" required onChange={e => setFormData({ ...formData, stock: e.target.value })} />

            <div className="flex items-center gap-2">
              <Checkbox checked={formData.featured} onCheckedChange={v => setFormData({ ...formData, featured: Boolean(v) })} />
              <Label>Featured Product</Label>
            </div>

            <Button disabled={loading}>
              {loading ? 'Adding...' : 'Add Product'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

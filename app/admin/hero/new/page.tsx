'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { upload } from '@imagekit/next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Upload } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function NewHeroSlidePage() {
  const { user, userRole } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    button_text: 'Shop Now',
    button_link: '/new-collection',
    sort_order: '0',
    is_active: true,
  });

  useEffect(() => {
    if (!user || userRole !== 'admin') {
      router.push('/');
    }
  }, [user, userRole, router]);

  const authenticator = async () => {
    try {
      const response = await fetch('/api/imagekit-auth');
      if (!response.ok) throw new Error('Auth failed');
      return response.json();
    } catch (error) {
      console.error('ImageKit auth error:', error);
      throw error;
    }
  };

  const uploadImage = async (file: File) => {
    const authParams = await authenticator();
    const result = await upload({
      file,
      fileName: `hero-${crypto.randomUUID()}`,
      folder: '/heroes',
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
      urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/opc6rkvof',
      ...authParams,
    });
    if (!result?.url) throw new Error('Upload failed');
    return result.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!imageFile) {
        toast.error('Please upload an image for the hero slide');
        setLoading(false);
        return;
      }

      // 1. Upload the image to ImageKit
      const imageUrl = await uploadImage(imageFile);

      // 2. Insert into Supabase hero_slides
      const { error } = await supabase.from('hero_slides').insert({
        image_url: imageUrl,
        title: formData.title,
        subtitle: formData.subtitle || null,
        button_text: formData.button_text,
        button_link: formData.button_link,
        sort_order: Number(formData.sort_order),
        is_active: formData.is_active,
      });

      if (error) throw error;

      toast.success('Hero slide created successfully');
      router.push('/admin');
    } catch (err: any) {
      toast.error(err.message || 'Failed to create hero slide');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Hero Slide</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <Label>Slide Image *</Label>
              <div className="mt-2 flex items-center gap-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Recommended: 1920x1080 portrait/landscape depending on layout</p>
            </div>

            <div>
              <Label>Main Title *</Label>
              <Input
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Unapologetic Style"
              />
            </div>

            <div>
              <Label>Subtitle (Optional)</Label>
              <Input
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="e.g. Bold. Fresh. New."
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Button Text *</Label>
                <Input
                  required
                  value={formData.button_text}
                  onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                />
              </div>
              <div>
                <Label>Button Link *</Label>
                <Input
                  required
                  value={formData.button_link}
                  onChange={(e) => setFormData({ ...formData, button_link: e.target.value })}
                  placeholder="/category/men"
                />
              </div>
            </div>

            <div>
              <Label>Sort Order</Label>
              <Input
                type="number"
                required
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })}
              />
              <p className="text-xs text-muted-foreground mt-1">Lower numbers appear first</p>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, is_active: checked as boolean })
                }
              />
              <Label htmlFor="is_active">Make this slide active to show immediately on landing page</Label>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating...' : 'Create Hero Slide'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

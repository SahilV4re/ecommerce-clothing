'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { upload } from '@imagekit/next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import IKProductImage from '@/components/IKProductImage';

export default function EditHeroSlidePage() {
  const { id } = useParams();
  const { user, userRole } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    image_url: '',
    title: '',
    subtitle: '',
    button_text: '',
    button_link: '',
    sort_order: '0',
    is_active: true,
  });

  useEffect(() => {
    if (!user || userRole !== 'admin') {
      router.push('/');
      return;
    }

    const fetchSlide = async () => {
      setFetching(true);
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        toast.error('Slide not found');
        router.push('/admin');
        return;
      }

      setFormData({
        image_url: data.image_url,
        title: data.title,
        subtitle: data.subtitle || '',
        button_text: data.button_text,
        button_link: data.button_link,
        sort_order: String(data.sort_order),
        is_active: data.is_active,
      });
      setFetching(false);
    };

    if (id) fetchSlide();
  }, [id, user, userRole, router]);

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
      let finalImageUrl = formData.image_url;

      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile);
      }

      const { error } = await supabase
        .from('hero_slides')
        .update({
          image_url: finalImageUrl,
          title: formData.title,
          subtitle: formData.subtitle || null,
          button_text: formData.button_text,
          button_link: formData.button_link,
          sort_order: Number(formData.sort_order),
          is_active: formData.is_active,
        })
        .eq('id', id);

      if (error) throw error;

      toast.success('Hero slide updated successfully');
      router.push('/admin');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update hero slide');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-48"></div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

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
          <CardTitle>Edit Hero Slide</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <Label>Current Image</Label>
              {formData.image_url && (
                <div className="mt-2 relative w-full h-40 rounded overflow-hidden">
                  <IKProductImage
                    src={formData.image_url}
                    alt="Current Slide"
                    fill
                    className="object-cover"
                    transformation={[{ width: '400', height: '200', quality: '80', f: 'auto' }]}
                  />
                </div>
              )}
            </div>

            <div>
              <Label>Replace Image (Optional)</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Main Title *</Label>
              <Input
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, is_active: checked as boolean })
                }
              />
              <Label htmlFor="is_active">Active (Show on landing page)</Label>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Updating...' : 'Update Hero Slide'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

-- ============================================================
-- Create hero_slides table for dynamic landing page heroes
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

CREATE TABLE IF NOT EXISTS public.hero_slides (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url text NOT NULL,
  title text NOT NULL,
  subtitle text,
  button_text text NOT NULL DEFAULT 'Shop Now',
  button_link text NOT NULL DEFAULT '/new-collection',
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policies
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;

-- Anyone can read active slides
CREATE POLICY "Public profiles are viewable by everyone." 
ON public.hero_slides FOR SELECT 
USING ( true );

-- Only authenticated users (admins) can insert/update/delete (Your API routes will use service role anyway, but just in case)
CREATE POLICY "Users can insert hero_slides" 
ON public.hero_slides FOR INSERT 
TO authenticated 
WITH CHECK ( true );

CREATE POLICY "Users can update hero_slides" 
ON public.hero_slides FOR UPDATE 
TO authenticated 
USING ( true );

CREATE POLICY "Users can delete hero_slides" 
ON public.hero_slides FOR DELETE 
TO authenticated 
USING ( true );

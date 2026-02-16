import { createSupabaseServerClient } from '@/lib/supabase/server';
import HomeClient from './homeClient';

export const revalidate = 60; // cache 60 seconds

export default async function HomePage() {
  const supabase = createSupabaseServerClient();

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
      .limit(6),
  ]);

  return (
    <HomeClient
      featuredProducts={featuredResponse.data || []}
      popularProducts={popularResponse.data || []}
    />
  );
}

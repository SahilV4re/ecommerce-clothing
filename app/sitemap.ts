import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  
  const { data: products } = await supabase.from('products').select('id, created_at')

  const baseUrl = 'https://www.kalastrastyle.com'

  const productUrls: MetadataRoute.Sitemap = products?.map((product) => ({
    url: `${baseUrl}/product/${product.id}`,
    lastModified: product.created_at ? new Date(product.created_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  })) || []

  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/category/men',
    '/category/women',
    '/category/kids',
    '/new-collection',
    '/special-offers',
    '/contact-us',
    '/privacypolicy',
    '/shipping-info',
    '/size-guide',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  return [...staticRoutes, ...productUrls]
}

import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.kalastrastyle.com'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/cart/', '/checkout/', '/auth/', '/orders/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

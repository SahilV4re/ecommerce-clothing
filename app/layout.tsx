import './globals.css'
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/sonner';
import CookieConsent from '@/components/CookieConsent';
import { ImageKitProvider } from '@imagekit/next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Kalastrastyle - Premium Fashion Store',
  description: 'Discover unique styles and trendy fashion for men, women, and kids',
  
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="uVPnzBMrps7w9s83uRGI264ZZxxr_KaiClbtAftTNsI" />
      </head>
      
      <body className={inter.className}>
        <ImageKitProvider urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/opc6rkvof'}>
          <AuthProvider>
            <CartProvider>
              <Header />
              <main>
                {children}
                <CookieConsent />
              </main>
              
              <Toaster />
              <Footer />
            </CartProvider>
          </AuthProvider>
        </ImageKitProvider>
      </body>
    </html>
  );
}



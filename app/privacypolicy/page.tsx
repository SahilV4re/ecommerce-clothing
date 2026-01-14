'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-center mb-12">Privacy Policy</h1>
        <p className="text-lg text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
          At Kalastrastyle, we value your privacy. This Privacy Policy explains how we collect, use, and protect your personal information in compliance with applicable laws, including the Information Technology Act, 2000.
        </p>

        {/* Privacy Policy Details */}
        <section className="mb-20">
          <div className="max-w-2xl mx-auto text-left bg-white shadow-md rounded-2xl p-8">
            <div className="space-y-8 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-lg mb-2">1. Information We Collect</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Personal Information:</strong> Name, email, phone number, shipping/billing address, and payment details provided during account creation or checkout.</li>
                  <li><strong>Usage Data:</strong> Browsing history, IP address, device information, and interactions with our website (e.g., pages visited, products viewed).</li>
                  <li><strong>Cookies:</strong> Data collected via cookies to enhance your browsing experience (see our Cookie Policy for details).</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">2. How We Use Your Information</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Order Processing:</strong> To process and deliver your orders, including sending order confirmations and tracking updates.</li>
                  <li><strong>Personalization:</strong> To tailor product recommendations and marketing communications.</li>
                  <li><strong>Customer Support:</strong> To respond to inquiries and provide assistance.</li>
                  <li><strong>Analytics:</strong> To analyze website usage and improve our services.</li>
                  <li><strong>Legal Compliance:</strong> To comply with legal obligations under the Information Technology Act, 2000, and other regulations.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">3. Data Sharing</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Service Providers:</strong> We share data with trusted partners (e.g., payment processors, shipping companies) to fulfill orders.</li>
                  <li><strong>Legal Requirements:</strong> We may disclose data if required by law or to protect our rights.</li>
                  <li><strong>No Third-Party Sales:</strong> We do not sell your personal information to third parties.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">4. Data Security</h3>
                <p>We use industry-standard encryption (e.g., SSL) to protect your data. However, no online transmission is 100% secure, and we encourage you to take precautions.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">5. Your Rights</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Access and Correction:</strong> You can access or update your personal information via your account or by contacting us.</li>
                  <li><strong>Opt-Out:</strong> Unsubscribe from marketing emails using the link in our communications.</li>
                  <li><strong>Data Deletion:</strong> Request deletion of your data, subject to legal retention requirements.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">6. Contact Us</h3>
                <p>For privacy-related inquiries, reach us at support@kalastrastyle.com or Kalyan, Mumbai, Maharashtra.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <h2 className="text-3xl font-semibold mb-6">Explore Our Collections</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
            Shop with confidence, knowing your privacy is protected.
          </p>
          <Button asChild className="rounded-full px-6 py-3">
            <Link href="/new-collection">Shop Now</Link>
          </Button>
        </section>
      </main>
    </div>
  );
}
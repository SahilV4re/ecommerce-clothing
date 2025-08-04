'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-center mb-12">Terms of Service</h1>
        <p className="text-lg text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
          These Terms of Service govern your use of UrbanAttire’s website and services. By accessing our site, you agree to comply with these terms and applicable laws, including the Consumer Protection Act, 2019.
        </p>

        {/* Terms of Service Details */}
        <section className="mb-20">
          <div className="max-w-2xl mx-auto text-left bg-white shadow-md rounded-2xl p-8">
            <div className="space-y-8 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-lg mb-2">1. Use of Our Website</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>You must be at least 18 years old or have parental consent to use our services.</li>
                  <li>You agree not to use our site for unlawful purposes or to disrupt its functionality.</li>
                  <li>We reserve the right to suspend or terminate access for violations of these terms.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">2. Purchases</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>All prices are in INR and include applicable taxes (e.g., GST).</li>
                  <li>We reserve the right to refuse or cancel orders due to stock issues, pricing errors, or suspected fraud.</li>
                  <li>Payment must be completed via our secure payment gateway before order processing.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">3. Shipping and Returns</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Shipping details are outlined in our <Link href="/shipping-info" className="text-primary hover:underline">Shipping Information</Link> page.</li>
                  <li>Returns are accepted within 30 days for eligible items, per our <Link href="/returns" className="text-primary hover:underline">Returns Policy</Link>.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">4. Intellectual Property</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>All content on our website (e.g., images, logos, text) is owned by UrbanAttire or its licensors.</li>
                  <li>You may not reproduce, distribute, or modify our content without permission.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">5. Limitation of Liability</h3>
                <p>We are not liable for indirect damages, including loss of profits, arising from your use of our site. Our liability is limited to the purchase price of your order.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">6. Governing Law</h3>
                <p>These terms are governed by the laws of India. Disputes will be resolved in courts located in New Delhi, India.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">7. Contact Us</h3>
                <p>For questions about these terms, contact us at support@urbanattire.com or 123 Fashion St, New York, NY 10001.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <h2 className="text-3xl font-semibold mb-6">Start Shopping</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
            Explore our collections and shop with confidence.
          </p>
          <Button asChild className="rounded-full px-6 py-3">
            <Link href="/new-collection">Shop Now</Link>
          </Button>
        </section>
      </main>
    </div>
  );
}
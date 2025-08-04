'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-center mb-12">Cookie Policy</h1>
        <p className="text-lg text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
          UrbanAttire uses cookies to enhance your browsing experience. This Cookie Policy explains what cookies are, how we use them, and your choices regarding their use.
        </p>

        {/* Cookie Policy Details */}
        <section className="mb-20">
          <div className="max-w-2xl mx-auto text-left bg-white shadow-md rounded-2xl p-8">
            <div className="space-y-8 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-lg mb-2">1. What Are Cookies?</h3>
                <p>Cookies are small text files stored on your device to remember preferences, track usage, and improve site functionality.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">2. Types of Cookies We Use</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Essential Cookies:</strong> Necessary for website functionality, such as maintaining your cart or login session.</li>
                  <li><strong>Analytics Cookies:</strong> Track site usage to improve performance (e.g., Google Analytics).</li>
                  <li><strong>Marketing Cookies:</strong> Deliver personalized ads based on your browsing behavior.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">3. How We Use Cookies</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Site Functionality:</strong> Enable features like account login and checkout.</li>
                  <li><strong>Analytics:</strong> Analyze traffic and user behavior to enhance our services.</li>
                  <li><strong>Advertising:</strong> Show relevant ads on our site and third-party platforms.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">4. Managing Cookies</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Consent:</strong> You consent to cookies via our cookie banner. You can withdraw consent at any time.</li>
                  <li><strong>Browser Settings:</strong> Disable cookies in your browser, but this may affect site functionality.</li>
                  <li><strong>Opt-Out:</strong> Opt out of marketing cookies via our <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link> or ad platform settings.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">5. Third-Party Cookies</h3>
                <p>We use third-party services (e.g., Google Analytics, advertising networks) that may set their own cookies. These are governed by their respective privacy policies.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">6. Contact Us</h3>
                <p>For questions about cookies, contact us at support@urbanattire.com or 123 Fashion St, New York, NY 10001.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <h2 className="text-3xl font-semibold mb-6">Explore Our Collections</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
            Shop now and enjoy a personalized browsing experience.
          </p>
          <Button asChild className="rounded-full px-6 py-3">
            <Link href="/new-collection">Shop Now</Link>
          </Button>
        </section>
      </main>
    </div>
  );
}
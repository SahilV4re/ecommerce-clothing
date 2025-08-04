'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ShippingInfo() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-center mb-12">Shipping Information</h1>
        <p className="text-lg text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
          We ensure fast and reliable delivery across India and to select international destinations. Below are details on our shipping options, delivery times, and policies.
        </p>

        {/* Shipping Details */}
        <section className="mb-20">
          <h2 className="text-3xl font-semibold text-center mb-8">Shipping Details</h2>
          <div className="max-w-2xl mx-auto text-center bg-white shadow-md rounded-2xl p-8">
            <div className="space-y-8 text-muted-foreground">
              {/* Domestic Shipping */}
              <div>
                <h3 className="font-semibold text-lg mb-2">Domestic Shipping</h3>
                <ul className="list-disc list-inside space-y-2 text-left">
                  <li><strong>Standard Shipping:</strong> ₹99 (Free on orders over ₹999)</li>
                  <li><strong>Delivery Time:</strong> 3-5 business days for metro cities, 5-7 business days for other areas</li>
                  <li><strong>Express Shipping:</strong> ₹249, 1-2 business days for select cities</li>
                  <li><strong>Available Ports:</strong> Nhava Sheva (JNPT), Mundra, Chennai, Visakhapatnam, Kolkata</li>
                </ul>
              </div>
            
              {/* Shipping Policies */}
              <div>
                <h3 className="font-semibold text-lg mb-2">Shipping Policies</h3>
                <ul className="list-disc list-inside space-y-2 text-left">
                  <li>Orders are processed within 1-2 business days.</li>
                  <li>Tracking information is provided via email once your order ships.</li>
                  <li>We are not responsible for delays due to carrier issues or customs processing.</li>
                  <li>Ensure your shipping address is correct, as we cannot modify it after dispatch.</li>
                  <li>Transshipment permit fees are waived for faster cargo movement, per CBIC regulations (April 2025).</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <h2 className="text-3xl font-semibold mb-6">Ready to Shop?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
            Explore our collections and enjoy fast, reliable shipping.
          </p>
          <Button asChild className="rounded-full px-6 py-3">
            <Link href="/new-collection">Shop Now</Link>
          </Button>
        </section>
      </main>
    </div>
  );
}
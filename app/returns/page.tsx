'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Returns() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-center mb-12">Returns & Refunds</h1>
        <p className="text-lg text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
          We want you to love your purchase! If you’re not satisfied, review our return policy below for a hassle-free return process.
        </p>

        {/* Return Eligibility */}
        <section className="mb-20">
          <h2 className="text-3xl font-semibold text-center mb-8">Return Eligibility</h2>
          <Card className="shadow-md max-w-2xl mx-auto">
            <CardContent className="p-6">
              <ul className="list-disc list-inside space-y-4 text-muted-foreground">
                <li>Items must be returned within 30 days of delivery.</li>
                <li>Products must be unused, unworn, and in original packaging with tags attached.</li>
                <li>Final sale items, including clearance products, are not eligible for return.</li>
                <li>Personalized or custom-made items cannot be returned.</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Return Process */}
        <section className="mb-20">
          <h2 className="text-3xl font-semibold text-center mb-8">How to Return</h2>
          <Card className="shadow-md max-w-2xl mx-auto">
            <CardContent className="p-6">
              <ol className="list-decimal list-inside space-y-4 text-muted-foreground">
                <li>Contact our support team at support@urbanattire.com to initiate a return.</li>
                <li>Receive a return authorization and shipping label via email.</li>
                <li>Package your items securely and include the return authorization form.</li>
                <li>Drop off the package at a designated carrier location.</li>
                <li>Refunds are processed within 7-10 business days after we receive your return.</li>
              </ol>
            </CardContent>
          </Card>
        </section>

        {/* Refund Details */}
        <section className="mb-20">
          <h2 className="text-3xl font-semibold text-center mb-8">Refund Details</h2>
          <Card className="shadow-md max-w-2xl mx-auto">
            <CardContent className="p-6">
              <ul className="list-disc list-inside space-y-4 text-muted-foreground">
                <li>Refunds are issued to the original payment method.</li>
                <li>Shipping costs are non-refundable unless the return is due to our error.</li>
                <li>Customers are responsible for return shipping costs unless the item is defective.</li>
                <li>Defective or incorrect items are eligible for full refunds, including shipping.</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <h2 className="text-3xl font-semibold mb-6">Need Assistance?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
            Contact our support team for help with returns or explore our collections.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild className="rounded-full px-6 py-3">
              <Link href="/contact">Contact Support</Link>
            </Button>
            <Button variant="outline" asChild className="rounded-full px-6 py-3">
              <Link href="/new-collection">Shop Now</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
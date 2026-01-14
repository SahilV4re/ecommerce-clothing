'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase/client';

export default function ContactUs() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('contact_messages').insert([formData]);
      if (error) throw error;
      setFormStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setFormStatus('idle'), 3000);
    } catch (error) {
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-center mb-12">Contact Us</h1>
        <p className="text-lg text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
          We’re here to help! Reach out with any questions, concerns, or feedback, and our team will get back to you as soon as possible.
        </p>

        {/* Contact Form */}
        <section className="mb-20">
          <Card className="shadow-md max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Send Us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="rounded-full"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="rounded-full"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="rounded-xl"
                    rows={5}
                    required
                  />
                </div>
                <Button type="submit" className="rounded-full w-full">
                  Send Message
                </Button>
                {formStatus === 'success' && (
                  <p className="text-green-600 text-center mt-4">Message sent successfully!</p>
                )}
                {formStatus === 'error' && (
                  <p className="text-red-600 text-center mt-4">Something went wrong. Please try again.</p>
                )}
              </form>
            </CardContent>
          </Card>
        </section>

        {/* Get in Touch */}
        <section className="mb-20">
          <h2 className="text-3xl font-semibold text-center mb-8">Get in Touch</h2>
          <div className="max-w-2xl mx-auto text-center bg-white shadow-md rounded-2xl p-8">
            <div className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-lg">Email</h3>
                <p>support@kalastrastyle.com</p>
              </div>
              {/* <div>
                <h3 className="font-semibold text-lg">Phone</h3>
                <p>+91 (800) 123-4567</p>
              </div> */}
              <div>
                <h3 className="font-semibold text-lg">Address</h3>
                <p>Mumbai, Maharashtra</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <h2 className="text-3xl font-semibold mb-6">Explore Our Collections</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
            Discover the latest trends and find your perfect style.
          </p>
          <Button asChild className="rounded-full px-6 py-3">
            <Link href="/new-collection">Shop Now</Link>
          </Button>
        </section>
      </main>
    </div>
  );
}
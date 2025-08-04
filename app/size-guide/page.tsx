'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SizeGuide() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header placeholder (assumes Header component is included in layout) */}
      <main className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-center mb-12">Size Guide</h1>
        <p className="text-lg text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
          Find the perfect fit with our comprehensive size guide. Use the charts below to select the right size for Men’s, Women’s, and Kids’ clothing. For best results, measure yourself and compare with the provided measurements.
        </p>

        {/* How to Measure */}
        <section className="mb-20">
          <h2 className="text-3xl font-semibold text-center mb-8">How to Measure</h2>
          <Card className="shadow-md">
            <CardContent className="p-6">
              <ul className="list-disc list-inside space-y-4 text-muted-foreground">
                <li>
                  <strong>Chest:</strong> Measure around the fullest part of your chest, keeping the tape measure horizontal.
                </li>
                <li>
                  <strong>Waist:</strong> Measure around the narrowest part of your waist, typically above the belly button.
                </li>
                <li>
                  <strong>Hips:</strong> Measure around the fullest part of your hips, keeping the tape measure horizontal.
                </li>
                <li>
                  <strong>Inseam:</strong> Measure from the top of your inner thigh to the bottom of your ankle.
                </li>
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">
                Note: All measurements are in inches. If you’re between sizes, we recommend sizing up for comfort.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Men's Size Chart */}
        <section className="mb-20">
          <h2 className="text-3xl font-semibold text-center mb-8">Men’s Size Chart</h2>
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Tops (T-Shirts, Shirts, Hoodies)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-muted-foreground">
                  <thead className="text-xs uppercase bg-muted/50">
                    <tr>
                      <th className="px-4 py-3">Size</th>
                      <th className="px-4 py-3">Chest (in)</th>
                      <th className="px-4 py-3">Shoulder (in)</th>
                      <th className="px-4 py-3">Length (in)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-3">S</td>
                      <td className="px-4 py-3">36-38</td>
                      <td className="px-4 py-3">17</td>
                      <td className="px-4 py-3">27</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">M</td>
                      <td className="px-4 py-3">38-40</td>
                      <td className="px-4 py-3">18</td>
                      <td className="px-4 py-3">28</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">L</td>
                      <td className="px-4 py-3">40-42</td>
                      <td className="px-4 py-3">19</td>
                      <td className="px-4 py-3">29</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">XL</td>
                      <td className="px-4 py-3">42-44</td>
                      <td className="px-4 py-3">20</td>
                      <td className="px-4 py-3">30</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-md mt-6">
            <CardHeader>
              <CardTitle>Bottoms (Pants, Jeans)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-muted-foreground">
                  <thead className="text-xs uppercase bg-muted/50">
                    <tr>
                      <th className="px-4 py-3">Size</th>
                      <th className="px-4 py-3">Waist (in)</th>
                      <th className="px-4 py-3">Inseam (in)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-3">S</td>
                      <td className="px-4 py-3">30-32</td>
                      <td className="px-4 py-3">31</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">M</td>
                      <td className="px-4 py-3">32-34</td>
                      <td className="px-4 py-3">32</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">L</td>
                      <td className="px-4 py-3">34-36</td>
                      <td className="px-4 py-3">32</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">XL</td>
                      <td className="px-4 py-3">36-38</td>
                      <td className="px-4 py-3">33</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Women's Size Chart */}
        <section className="mb-20">
          <h2 className="text-3xl font-semibold text-center mb-8">Women’s Size Chart</h2>
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Tops (T-Shirts, Blouses, Sweaters)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-muted-foreground">
                  <thead className="text-xs uppercase bg-muted/50">
                    <tr>
                      <th className="px-4 py-3">Size</th>
                      <th className="px-4 py-3">Bust (in)</th>
                      <th className="px-4 py-3">Waist (in)</th>
                      <th className="px-4 py-3">Length (in)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-3">XS</td>
                      <td className="px-4 py-3">32-34</td>
                      <td className="px-4 py-3">24-26</td>
                      <td className="px-4 py-3">24</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">S</td>
                      <td className="px-4 py-3">34-36</td>
                      <td className="px-4 py-3">26-28</td>
                      <td className="px-4 py-3">25</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">M</td>
                      <td className="px-4 py-3">36-38</td>
                      <td className="px-4 py-3">28-30</td>
                      <td className="px-4 py-3">26</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">L</td>
                      <td className="px-4 py-3">38-40</td>
                      <td className="px-4 py-3">30-32</td>
                      <td className="px-4 py-3">27</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-md mt-6">
            <CardHeader>
              <CardTitle>Bottoms (Pants, Skirts)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-muted-foreground">
                  <thead className="text-xs uppercase bg-muted/50">
                    <tr>
                      <th className="px-4 py-3">Size</th>
                      <th className="px-4 py-3">Waist (in)</th>
                      <th className="px-4 py-3">Hips (in)</th>
                      <th className="px-4 py-3">Inseam (in)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-3">XS</td>
                      <td className="px-4 py-3">24-26</td>
                      <td className="px-4 py-3">34-36</td>
                      <td className="px-4 py-3">30</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">S</td>
                      <td className="px-4 py-3">26-28</td>
                      <td className="px-4 py-3">36-38</td>
                      <td className="px-4 py-3">31</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">M</td>
                      <td className="px-4 py-3">28-30</td>
                      <td className="px-4 py-3">38-40</td>
                      <td className="px-4 py-3">31</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">L</td>
                      <td className="px-4 py-3">30-32</td>
                      <td className="px-4 py-3">40-42</td>
                      <td className="px-4 py-3">32</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Kids' Size Chart */}
        <section className="mb-20">
          <h2 className="text-3xl font-semibold text-center mb-8">Kids’ Size Chart</h2>
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Tops & Bottoms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-muted-foreground">
                  <thead className="text-xs uppercase bg-muted/50">
                    <tr>
                      <th className="px-4 py-3">Size</th>
                      <th className="px-4 py-3">Age</th>
                      <th className="px-4 py-3">Chest (in)</th>
                      <th className="px-4 py-3">Waist (in)</th>
                      <th className="px-4 py-3">Height (in)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-3">2T</td>
                      <td className="px-4 py-3">1-2</td>
                      <td className="px-4 py-3">20-21</td>
                      <td className="px-4 py-3">19-20</td>
                      <td className="px-4 py-3">33-35</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">4T</td>
                      <td className="px-4 py-3">3-4</td>
                      <td className="px-4 py-3">22-23</td>
                      <td className="px-4 py-3">21-22</td>
                      <td className="px-4 py-3">39-41</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">6</td>
                      <td className="px-4 py-3">5-6</td>
                      <td className="px-4 py-3">24-25</td>
                      <td className="px-4 py-3">22-23</td>
                      <td className="px-4 py-3">45-47</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">8</td>
                      <td className="px-4 py-3">7-8</td>
                      <td className="px-4 py-3">26-27</td>
                      <td className="px-4 py-3">23-24</td>
                      <td className="px-4 py-3">49-51</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <h2 className="text-3xl font-semibold mb-6">Still Unsure?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
            Contact our support team for personalized sizing assistance or explore our products to find your perfect fit.
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
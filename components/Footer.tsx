import React from 'react'
import Link from 'next/link'

function Footer() {
  return (
    <div>
      <footer className="bg-background border-t py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">UrbanAttire</h3>
              <p className="text-muted-foreground">
                Your destination for trendy and comfortable fashion for all ages.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/category/men" className="hover:text-foreground">Men&apos;s Fashion</Link></li>
                <li><Link href="/category/women" className="hover:text-foreground">Women&apos;s Fashion</Link></li>
                <li><Link href="/category/kids" className="hover:text-foreground">Kid&apos;s Fashion</Link></li>
                <li><Link href="/new-collections" className="hover:text-foreground">New Collections</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Customer Service</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/contact-us" className="hover:text-foreground">Contact Us</Link></li>
                <li><Link href="/shipping-info" className="hover:text-foreground">Shipping Info</Link></li>
                <li><Link href="/returns" className="hover:text-foreground">Returns</Link></li>
                <li><Link href="/size-guide" className="hover:text-foreground">Size Guide</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/privacypolicy" className="hover:text-foreground">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground">Terms of Service</Link></li>
                <li><Link href="/cookie" className="hover:text-foreground">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 Kalastrastyle. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer

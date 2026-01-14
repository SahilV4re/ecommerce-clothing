// CookieConsent.tsx
'use client'

import { useEffect, useState } from 'react'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const hasConsent = document.cookie
      .split('; ')
      .some(c => c.startsWith('cookie_consent='))

    if (!hasConsent) setVisible(true)
  }, [])

  const acceptCookies = () => {
    document.cookie =
      'cookie_consent=true; max-age=31536000; path=/; SameSite=Lax; Secure'
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 inset-x-0 bg-black text-white p-4 z-50">
      <p className="text-sm">
        We use cookies to improve your shopping experience.
      </p>
      <button onClick={acceptCookies} className="mt-2 bg-white text-black px-4 py-1 rounded">
        Accept
      </button>
    </div>
  )
}

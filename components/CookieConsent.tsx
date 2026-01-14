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
    // <div className="fixed bottom-0 inset-x-0 bg-black text-white p-4 z-50">
    //   <p className="text-sm">
    //     We use cookies to improve your shopping experience.
    //   </p>
    //   <button onClick={acceptCookies} className="mt-2 bg-white text-black px-4 py-1 rounded">
    //     Accept
    //   </button>
    //   </div>
      <div className="fixed bottom-0 inset-x-0 z-50 bg-black text-white px-6 py-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-sm text-gray-200">
          We use cookies to enhance your shopping experience, analyze traffic,
          and personalize content. By clicking “Accept”, you agree to our use of
          cookies.
        </p>

        <div className="flex gap-3">
          <button
            onClick={acceptCookies}
            className="rounded-md bg-white text-black px-5 py-2 text-sm font-semibold hover:bg-gray-200 transition"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}

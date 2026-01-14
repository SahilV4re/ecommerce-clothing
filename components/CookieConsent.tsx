'use client'

import { useEffect, useState } from 'react'
import { getCookie, setCookie } from 'cookies-next'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = getCookie('cookie_consent')
    if (!consent) {
      setVisible(true)
    }
  }, [])

  if (!visible) return null

  const acceptCookies = () => {
    setCookie('cookie_consent', 'true', {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'lax',
      secure: true,
    })
    setVisible(false)
  }

  return (
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

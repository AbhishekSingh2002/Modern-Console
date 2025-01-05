'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SpotifyCallback() {
  const router = useRouter()

  useEffect(() => {
    const hash = window.location.hash
      .substring(1)
      .split('&')
      .reduce((initial: { [key: string]: string }, item) => {
        const parts = item.split('=')
        initial[parts[0]] = decodeURIComponent(parts[1])
        return initial
      }, {})

    if (hash.access_token) {
      localStorage.setItem('spotify_access_token', hash.access_token)
      localStorage.setItem('spotify_token_expiry', (Date.now() + 3600 * 1000).toString())
      router.push('/')
    } else {
      console.error('No access token found in URL')
      router.push('/')
    }
  }, [router])

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg">Authenticating with Spotify...</p>
    </div>
  )
}


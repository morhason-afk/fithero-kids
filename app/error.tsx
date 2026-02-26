'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      fontFamily: 'system-ui, sans-serif',
      background: '#1A1A2E',
      color: '#EAEAEA',
      textAlign: 'center',
    }}>
      <h2 style={{ marginBottom: 16, fontSize: '1.25rem' }}>Something went wrong</h2>
      <p style={{ marginBottom: 24, color: '#8899AA', fontSize: 14 }}>
        {error?.message || 'An error occurred'}
      </p>
      <button
        type="button"
        onClick={() => reset()}
        style={{
          padding: '12px 24px',
          fontSize: 16,
          fontWeight: 700,
          background: '#FF6B35',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
        }}
      >
        Try again
      </button>
    </div>
  )
}

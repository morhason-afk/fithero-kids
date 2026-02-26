import Link from 'next/link'

export default function NotFound() {
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
      <h1 style={{ marginBottom: 8, fontSize: '2rem' }}>404</h1>
      <p style={{ marginBottom: 24, color: '#8899AA' }}>This page could not be found.</p>
      <Link
        href="/"
        style={{
          padding: '12px 24px',
          fontSize: 16,
          fontWeight: 700,
          background: '#FF6B35',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          textDecoration: 'none',
        }}
      >
        Go home
      </Link>
    </div>
  )
}

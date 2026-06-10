import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Layout } from '../components/Layout'

export function NotFound() {
  return (
    <Layout>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        minHeight: '60vh', padding: 'var(--space-10) var(--space-6)', textAlign: 'center',
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-5xl)',
          fontWeight: 'var(--weight-bold)', color: 'var(--fg-4)',
          letterSpacing: 'var(--tracking-tight)', lineHeight: 1,
          marginBottom: 'var(--space-4)',
        }}>
          404
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)',
          fontWeight: 'var(--weight-bold)', color: 'var(--fg-1)',
          letterSpacing: 'var(--tracking-tight)', marginBottom: 'var(--space-2)',
        }}>
          Page not found
        </h1>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--fg-3)', marginBottom: 'var(--space-6)' }}>
          This page doesn't exist or has been moved.
        </p>
        <Link to="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
          height: 38, padding: '0 18px', borderRadius: 'var(--radius-lg)',
          background: 'var(--surface-1)', color: 'var(--fg-2)',
          border: '1px solid var(--border-default)',
          fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)',
          textDecoration: 'none', fontFamily: 'var(--font-body)',
          transition: 'var(--transition-fast)',
        }}>
          <ArrowLeft size={14} />
          Back to home
        </Link>
      </div>
    </Layout>
  )
}

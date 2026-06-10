import { useState, useEffect } from 'react'
import { Activity, Server, Cpu, Clock, CheckCircle, AlertCircle, Wifi } from 'lucide-react'
import { Layout } from '../components/Layout'

function StatusDot({ ok }) {
  return (
    <div style={{
      width: 8, height: 8, borderRadius: '50%',
      background: ok ? 'var(--success)' : 'var(--error)',
      boxShadow: ok ? '0 0 8px rgba(62,207,142,0.4)' : '0 0 8px rgba(248,113,113,0.4)',
    }} />
  )
}

function MetricCard({ icon: Icon, label, value, sub, status }) {
  return (
    <div style={{
      padding: 'var(--space-5)', borderRadius: 'var(--radius-xl)',
      border: '1px solid var(--border-default)',
      background: 'var(--surface-1)', boxShadow: 'var(--shadow-xs)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Icon size={13} style={{ color: 'var(--fg-3)' }} />
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-3)', fontWeight: 'var(--weight-medium)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)' }}>{label}</span>
        </div>
        {status !== undefined && <StatusDot ok={status} />}
      </div>
      <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', color: 'var(--fg-1)', fontFamily: 'var(--font-mono)', letterSpacing: 'var(--tracking-tight)', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-4)', marginTop: 'var(--space-1-5)' }}>{sub}</div>}
    </div>
  )
}

export function Status() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setData(d); else setError(true) })
      .catch(() => setError(true))
  }, [])

  const operational = data && !error

  return (
    <Layout>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: 'var(--space-10) var(--space-6) var(--space-20)' }}>
        {/* Header */}
        <div style={{ marginBottom: 'var(--space-10)', animation: 'fade-up 0.4s var(--ease-default) both' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)',
            fontWeight: 'var(--weight-bold)', color: 'var(--fg-1)',
            letterSpacing: 'var(--tracking-tight)', marginBottom: 'var(--space-2)',
          }}>
            Status
          </h1>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--fg-3)' }}>
            Real-time bot health and performance metrics.
          </p>
        </div>

        {/* Overall status banner */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
          padding: 'var(--space-4) var(--space-5)', borderRadius: 'var(--radius-xl)',
          border: `1px solid ${operational ? 'rgba(62,207,142,0.25)' : error ? 'rgba(248,113,113,0.25)' : 'var(--border-default)'}`,
          background: operational ? 'var(--success-subtle)' : error ? 'var(--error-subtle)' : 'var(--surface-1)',
          marginBottom: 'var(--space-6)',
          animation: 'fade-up 0.4s var(--ease-default) 0.06s both',
        }}>
          {operational ? (
            <CheckCircle size={18} style={{ color: 'var(--success)' }} />
          ) : error ? (
            <AlertCircle size={18} style={{ color: 'var(--error)' }} />
          ) : (
            <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid var(--border-default)', borderTopColor: 'var(--accent)', animation: 'spin 0.7s linear infinite' }} />
          )}
          <div>
            <div style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-semibold)', color: 'var(--fg-1)' }}>
              {operational ? 'All Systems Operational' : error ? 'Service Unavailable' : 'Checking...'}
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-3)' }}>
              {operational ? 'Bot is online and responding normally' : error ? 'Cannot reach the bot API' : 'Fetching status...'}
            </div>
          </div>
        </div>

        {/* Metrics */}
        {data && (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-3)',
            animation: 'fade-up 0.5s var(--ease-default) 0.12s both',
          }}>
            <MetricCard icon={Clock} label="Uptime" value={formatUptime(data.uptime)} sub="Since last restart" status={true} />
            <MetricCard icon={Wifi} label="Latency" value={`${data.ping || '~'}ms`} sub="WebSocket heartbeat" status={(data.ping || 0) < 200} />
            <MetricCard icon={Server} label="Servers" value={data.guilds} sub="Active guilds" />
            <MetricCard icon={Cpu} label="Memory" value={data.memory ? `${Math.round(data.memory)}MB` : 'N/A'} sub="Heap usage" />
          </div>
        )}

        {/* Services */}
        <div style={{
          marginTop: 'var(--space-6)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-default)',
          background: 'var(--surface-1)',
          overflow: 'hidden', boxShadow: 'var(--shadow-xs)',
          animation: 'fade-up 0.5s var(--ease-default) 0.18s both',
        }}>
          <div style={{
            fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-semibold)', color: 'var(--fg-2)',
            textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)',
            padding: 'var(--space-4) var(--space-5) var(--space-3)',
            borderBottom: '1px solid var(--border-subtle)',
          }}>Services</div>
          {[
            { name: 'Discord Gateway', desc: 'WebSocket connection to Discord', ok: operational },
            { name: 'Command Handler', desc: 'Slash and prefix commands', ok: operational },
            { name: 'Music Player', desc: 'Audio playback engine', ok: operational },
            { name: 'Database', desc: 'SQLite persistence layer', ok: operational },
            { name: 'AI (Groq)', desc: 'Language model inference', ok: operational },
            { name: 'Dashboard API', desc: 'REST API for web dashboard', ok: operational },
          ].map((svc, i) => (
            <div key={svc.name} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: 'var(--space-3) var(--space-5)',
              borderBottom: i < 5 ? '1px solid var(--border-subtle)' : 'none',
            }}>
              <div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-1)', fontWeight: 'var(--weight-medium)' }}>{svc.name}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-4)' }}>{svc.desc}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: svc.ok ? 'var(--success)' : 'var(--error)', fontFamily: 'var(--font-mono)' }}>
                  {svc.ok ? 'Operational' : 'Down'}
                </span>
                <StatusDot ok={svc.ok} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

function formatUptime(seconds) {
  if (!seconds) return '0m'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 24) return `${Math.floor(h / 24)}d ${h % 24}h`
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

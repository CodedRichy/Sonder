import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Shield, Zap, Bot, Music, Gamepad2, ArrowRight, Plus, Terminal, Sparkles, ChevronRight } from 'lucide-react'
import { Layout } from '../components/Layout'

function ScrollReveal({ children, delay = 0 }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true)
    }, { threshold: 0.1 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.6s var(--ease-default) ${delay}ms, transform 0.6s var(--ease-default) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description, cta, color, index }) {
  const [h, setH] = useState(false)
  return (
    <div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)',
        border: `1px solid ${h ? 'var(--border-strong)' : 'var(--border-default)'}`,
        background: h ? 'var(--surface-1)' : 'transparent',
        transition: 'all 200ms var(--ease-default)',
        transform: h ? 'translateY(-4px)' : 'none',
        boxShadow: h ? 'var(--shadow-md)' : 'none',
        cursor: 'default', height: '100%',
        position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute', top: -40, right: -40, width: 120, height: 120,
        background: `radial-gradient(circle, ${color}10 0%, transparent 70%)`,
        borderRadius: '50%', transition: 'opacity 300ms', opacity: h ? 1 : 0,
      }} />
      <div style={{ position: 'relative' }}>
        <div style={{
          width: 40, height: 40, borderRadius: 'var(--radius-lg)',
          background: `${color}12`, border: `1px solid ${color}25`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 'var(--space-5)',
        }}>
          <Icon size={20} strokeWidth={1.8} style={{ color }} />
        </div>
        <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-semibold)', color: 'var(--fg-1)', marginBottom: 'var(--space-2)' }}>{title}</h4>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--fg-3)', lineHeight: 1.7 }}>{description}</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1-5)', marginTop: 'var(--space-5)' }}>
        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', color: h ? 'var(--fg-1)' : 'var(--fg-3)', transition: 'color 150ms' }}>{cta}</span>
        <ArrowRight size={13} style={{ color: h ? 'var(--accent)' : 'var(--fg-4)', transition: 'all 200ms', transform: h ? 'translateX(2px)' : 'none' }} />
      </div>
    </div>
  )
}

function StatPill({ value, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)', color: 'var(--fg-1)', letterSpacing: 'var(--tracking-tight)' }}>{value}</span>
      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)' }}>{label}</span>
    </div>
  )
}

export function Landing() {
  return (
    <Layout>
      <style>{`
        @keyframes hero-reveal { from { opacity: 0; transform: translateY(32px) scale(0.98) } to { opacity: 1; transform: translateY(0) scale(1) } }
        @keyframes glow-pulse { 0%, 100% { opacity: 0.3 } 50% { opacity: 0.6 } }
        @keyframes float { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }
        @media (max-width: 768px) {
          .hero-title { font-size: var(--text-3xl) !important; }
          .hero-sub { font-size: var(--text-base) !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .stats-row { flex-direction: column; gap: var(--space-4) !important; }
          .cta-buttons { flex-direction: column; align-items: stretch; }
          .footer-grid { grid-template-columns: 1fr !important; gap: var(--space-8) !important; }
        }
      `}</style>

      {/* Hero */}
      <section style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        minHeight: '75vh', padding: 'var(--space-16) var(--space-6) var(--space-20)',
        textAlign: 'center', position: 'relative',
      }}>
        {/* Ambient glow */}
        <div style={{
          position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 600,
          background: 'radial-gradient(circle, rgba(94,106,210,0.1) 0%, transparent 60%)',
          pointerEvents: 'none', animation: 'glow-pulse 6s ease infinite',
        }} />

        <div style={{ animation: 'hero-reveal 0.8s var(--ease-default) both', position: 'relative' }}>
          <div style={{ animation: 'float 5s ease-in-out infinite', marginBottom: 'var(--space-8)' }}>
            <img
              src="/logo.jpg" alt="Sonder"
              style={{
                width: 88, height: 88, borderRadius: 24, objectFit: 'cover',
                boxShadow: 'var(--shadow-accent-lg)',
                border: '1px solid var(--border-accent)',
              }}
            />
          </div>
        </div>

        <div style={{ animation: 'hero-reveal 0.8s var(--ease-default) 0.1s both' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1-5)',
            background: 'var(--accent-subtle)', border: '1px solid var(--border-accent)',
            borderRadius: 'var(--radius-full)', padding: '4px 12px', marginBottom: 'var(--space-6)',
          }}>
            <Sparkles size={11} style={{ color: 'var(--accent)' }} />
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-medium)', color: 'var(--accent)' }}>every person has a story</span>
          </div>
        </div>

        <h1 className="hero-title" style={{
          fontFamily: 'var(--font-display)', fontSize: 'var(--text-5xl)',
          fontWeight: 'var(--weight-extrabold)', color: 'var(--fg-1)',
          lineHeight: 1.05, letterSpacing: '-0.04em',
          maxWidth: 680, textWrap: 'balance',
          animation: 'hero-reveal 0.8s var(--ease-default) 0.15s both',
        }}>
          every stranger has a story.{' '}
          <span style={{ color: 'var(--accent)' }}>sonder</span>{' '}
          helps you see it.
        </h1>

        <p className="hero-sub" style={{
          fontSize: 'var(--text-lg)', color: 'var(--fg-3)', lineHeight: 1.7,
          maxWidth: 480, textWrap: 'balance', marginTop: 'var(--space-4)',
          animation: 'hero-reveal 0.8s var(--ease-default) 0.25s both',
        }}>
          an AI that watches, listens, and understands your community — not just commands, but the people behind them.
        </p>

        <div className="cta-buttons" style={{
          display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', marginTop: 'var(--space-8)',
          animation: 'hero-reveal 0.8s var(--ease-default) 0.35s both',
        }}>
          <Link to="/dashboard" style={{
            display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
            height: 44, padding: '0 22px', borderRadius: 'var(--radius-lg)',
            background: 'var(--accent)', color: 'var(--accent-fg)',
            fontSize: 'var(--text-base)', fontWeight: 'var(--weight-semibold)',
            textDecoration: 'none', fontFamily: 'var(--font-body)',
            boxShadow: 'var(--shadow-accent), var(--shadow-sm)',
            transition: 'transform 120ms var(--ease-default), box-shadow 160ms',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = 'var(--shadow-accent-lg), var(--shadow-md)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-accent), var(--shadow-sm)' }}
          >
            <Plus size={15} />
            Get started
          </Link>
          <Link to="/commands" style={{
            display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
            height: 44, padding: '0 22px', borderRadius: 'var(--radius-lg)',
            background: 'var(--surface-1)', color: 'var(--fg-2)',
            fontSize: 'var(--text-base)', fontWeight: 'var(--weight-medium)',
            textDecoration: 'none', fontFamily: 'var(--font-body)',
            border: '1px solid var(--border-default)',
            boxShadow: 'var(--shadow-xs)',
            transition: 'all 120ms var(--ease-default)',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--fg-1)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.color = 'var(--fg-2)' }}
          >
            <Terminal size={15} />
            View commands
          </Link>
        </div>

        {/* Stats row */}
        <div className="stats-row" style={{
          display: 'flex', gap: 'var(--space-10)', marginTop: 'var(--space-16)',
          animation: 'hero-reveal 0.8s var(--ease-default) 0.5s both',
        }}>
          <StatPill value="152" label="commands" />
          <StatPill value="9" label="categories" />
          <StatPill value="∞" label="free tier" />
        </div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '0 var(--space-6) var(--space-24)' }}>
        <ScrollReveal>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-3)' }}>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)',
              fontWeight: 'var(--weight-bold)', color: 'var(--fg-1)',
              letterSpacing: 'var(--tracking-tight)', textWrap: 'balance',
            }}>
              it notices what{' '}
              <span style={{ color: 'var(--accent)' }}>others</span> miss.
            </h2>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={80}>
          <p style={{
            fontSize: 'var(--text-md)', color: 'var(--fg-3)', textAlign: 'center',
            marginBottom: 'var(--space-12)', textWrap: 'balance',
          }}>
            most bots execute commands. sonder understands context.
          </p>
        </ScrollReveal>

        <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-4)' }}>
          {[
            { icon: Shield, title: 'Moderation', description: 'watches for trouble before it happens. anti-nuke, anti-raid, graduated enforcement — protection that thinks, not just reacts.', cta: 'Explore commands', color: 'var(--error)' },
            { icon: Music, title: 'Music', description: 'vibes matter. play from youtube, spotify, soundcloud. queue management that keeps the energy right.', cta: 'Start listening', color: 'var(--info)' },
            { icon: Zap, title: 'Leveling', description: 'reward the people who show up. xp curves that recognize real engagement, not just message spam.', cta: 'See how it works', color: 'var(--warning)' },
            { icon: Gamepad2, title: 'Economy', description: 'a world inside your server. daily rewards, heists, fishing, shops — balanced so everyone can play.', cta: 'View economy', color: 'var(--success)' },
          ].map((f, i) => (
            <ScrollReveal key={f.title} delay={i * 80}>
              <FeatureCard {...f} index={i} />
            </ScrollReveal>
          ))}
        </div>

        {/* AI Feature — full width */}
        <div style={{ marginTop: 'var(--space-4)' }}>
          <ScrollReveal delay={320}>
            <AIFeatureCard />
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '0 var(--space-6) var(--space-20)' }}>
        <ScrollReveal>
          <div style={{
            maxWidth: 1000, margin: '0 auto',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-5)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-accent)',
            background: 'var(--accent-subtle)',
            padding: 'var(--space-12) var(--space-8)', textAlign: 'center',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(circle at 50% 0%, rgba(94,106,210,0.12) 0%, transparent 60%)',
              pointerEvents: 'none',
            }} />
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--weight-bold)', color: 'var(--fg-1)',
              letterSpacing: 'var(--tracking-tight)', position: 'relative',
            }}>
              your community is already alive. let sonder see it.
            </h2>
            <p style={{ fontSize: 'var(--text-md)', color: 'var(--fg-3)', position: 'relative', textWrap: 'balance' }}>
              free to start. no credit card.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-2)', position: 'relative' }}>
              <Link to="/dashboard" style={{
                display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
                height: 42, padding: '0 20px', borderRadius: 'var(--radius-lg)',
                background: 'var(--accent)', color: 'var(--accent-fg)',
                fontSize: 'var(--text-base)', fontWeight: 'var(--weight-semibold)',
                textDecoration: 'none',
                boxShadow: 'var(--shadow-accent)',
              }}>
                <Plus size={15} />
                Get started
              </Link>
              <Link to="/commands" style={{
                display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1-5)',
                height: 42, padding: '0 18px', borderRadius: 'var(--radius-lg)',
                color: 'var(--fg-2)', fontSize: 'var(--text-base)', fontWeight: 'var(--weight-medium)',
                textDecoration: 'none',
              }}>
                Browse commands
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Footer */}
      <footer className="footer-grid" style={{
        maxWidth: 1000, margin: '0 auto',
        padding: 'var(--space-8) var(--space-6)',
        borderTop: '1px solid var(--border-subtle)',
        display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 'var(--space-12)',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2-5)', marginBottom: 'var(--space-3)' }}>
            <img src="/logo.jpg" alt="Sonder" style={{ width: 24, height: 24, borderRadius: 'var(--radius-md)', objectFit: 'cover' }} />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', fontWeight: 'var(--weight-semibold)', color: 'var(--fg-1)' }}>sonder</span>
          </div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-3)', lineHeight: 1.6, maxWidth: 280 }}>
            the realization that every passerby lives a life as vivid as your own.
          </p>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-4)', marginTop: 'var(--space-4)' }}>
            &copy; sonder.gg 2025 – 2026. All rights reserved.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2-5)' }}>
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-semibold)', color: 'var(--fg-2)', marginBottom: 'var(--space-1)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)' }}>Product</span>
          <Link to="/commands" style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-3)', textDecoration: 'none' }}>Commands</Link>
          <Link to="/dashboard" style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-3)', textDecoration: 'none' }}>Dashboard</Link>
          <Link to="/status" style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-3)', textDecoration: 'none' }}>Status</Link>
          <Link to="/dashboard" style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-3)', textDecoration: 'none' }}>Support</Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2-5)' }}>
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-semibold)', color: 'var(--fg-2)', marginBottom: 'var(--space-1)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)' }}>Legal</span>
          <Link to="/terms" style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-3)', textDecoration: 'none' }}>Terms of Service</Link>
          <Link to="/privacy" style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-3)', textDecoration: 'none' }}>Privacy Policy</Link>
        </div>
      </footer>
    </Layout>
  )
}

function AIFeatureCard() {
  const [h, setH] = useState(false)
  return (
    <div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        borderRadius: 'var(--radius-xl)', padding: 'var(--space-8)',
        border: `1px solid ${h ? 'var(--border-accent)' : 'var(--border-default)'}`,
        background: h ? 'var(--accent-subtle)' : 'transparent',
        transition: 'all 200ms var(--ease-default)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute', top: 0, right: 0, width: 300, height: 200,
        background: 'radial-gradient(circle at 100% 0%, rgba(94,106,210,0.08) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-8)', flexWrap: 'wrap' }}>
        <div style={{ maxWidth: 480 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1-5)',
            background: 'var(--accent-subtle)', border: '1px solid var(--border-accent)',
            borderRadius: 'var(--radius-full)', padding: '3px 10px', marginBottom: 'var(--space-4)',
          }}>
            <Sparkles size={10} style={{ color: 'var(--accent)' }} />
            <span style={{ fontSize: 10, fontWeight: 'var(--weight-semibold)', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)' }}>Powered by AI</span>
          </div>
          <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)', color: 'var(--fg-1)', marginBottom: 'var(--space-2)', letterSpacing: 'var(--tracking-tight)' }}>it reads the room.</h4>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--fg-3)', lineHeight: 1.7 }}>
            sonder doesn't just respond to commands — it understands mood, detects tension, summarizes what you missed. AI that actually gets your community.
          </p>
        </div>
        <Link to="/commands" style={{
          display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1-5)',
          fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)',
          color: 'var(--accent)', textDecoration: 'none', marginTop: 'var(--space-2)',
        }}>
          see AI commands
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  )
}

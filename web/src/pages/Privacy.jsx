import { Layout } from '../components/Layout'

export function Privacy() {
  return (
    <Layout>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: 'var(--space-16) var(--space-6)' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)',
          fontWeight: 'var(--weight-bold)', color: 'var(--fg-1)',
          letterSpacing: 'var(--tracking-tight)', marginBottom: 'var(--space-8)',
        }}>
          privacy policy
        </h1>

        <div style={{ fontSize: 'var(--text-base)', color: 'var(--fg-3)', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <p style={{ color: 'var(--fg-4)', fontSize: 'var(--text-sm)' }}>Last updated: June 2026</p>

          <section>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-semibold)', color: 'var(--fg-2)', marginBottom: 'var(--space-2)' }}>what we collect</h2>
            <p>Sonder stores the minimum data needed to function:</p>
            <ul style={{ marginTop: 'var(--space-2)', paddingLeft: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
              <li><strong style={{ color: 'var(--fg-2)' }}>Server config</strong> — settings you configure (welcome messages, modlog channels, prefix, automod rules)</li>
              <li><strong style={{ color: 'var(--fg-2)' }}>Moderation data</strong> — warnings, notes, and modlog entries for your server</li>
              <li><strong style={{ color: 'var(--fg-2)' }}>Economy & XP</strong> — balances, inventory, and experience points per user per server</li>
              <li><strong style={{ color: 'var(--fg-2)' }}>User IDs</strong> — Discord user and server IDs to associate data with the correct accounts</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-semibold)', color: 'var(--fg-2)', marginBottom: 'var(--space-2)' }}>what we don't collect</h2>
            <ul style={{ paddingLeft: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
              <li>We do not permanently store message content</li>
              <li>We do not track users across servers</li>
              <li>We do not sell or share data with advertisers</li>
              <li>We do not log DMs</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-semibold)', color: 'var(--fg-2)', marginBottom: 'var(--space-2)' }}>AI features</h2>
            <p>When you use AI-powered commands (ask, vibe, sentiment, summarize, roast, persona), message content from the channel is sent to a third-party AI provider (Groq) for processing. This data is used only to generate the immediate response and is not stored by Sonder or retained long-term by the provider beyond their standard processing.</p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-semibold)', color: 'var(--fg-2)', marginBottom: 'var(--space-2)' }}>data retention</h2>
            <p>Server data is retained as long as Sonder is in your server. When Sonder is removed, server configuration is retained for 30 days in case of accidental removal, then permanently deleted.</p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-semibold)', color: 'var(--fg-2)', marginBottom: 'var(--space-2)' }}>your rights</h2>
            <p>You can request deletion of all data associated with your server by removing Sonder and contacting us. Server owners can view stored data through the dashboard.</p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-semibold)', color: 'var(--fg-2)', marginBottom: 'var(--space-2)' }}>dashboard authentication</h2>
            <p>The web dashboard uses Discord OAuth2 for authentication. We receive your Discord user ID, username, and server list. We do not store your Discord password or OAuth tokens beyond the active session.</p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-semibold)', color: 'var(--fg-2)', marginBottom: 'var(--space-2)' }}>changes</h2>
            <p>We may update this policy. Material changes will be announced in the support server.</p>
          </section>

          <p style={{ color: 'var(--fg-4)', fontSize: 'var(--text-sm)', borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-6)' }}>
            Questions about your data? Reach out through our Discord support server.
          </p>
        </div>
      </div>
    </Layout>
  )
}

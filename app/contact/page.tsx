import { Page } from '@/components/basic'
import PortfolioEnhancements from '@/components/portfolio/PortfolioEnhancements'

export const metadata = {
  title: 'Contact - Jacky FAN',
  description: 'Get in touch with Jacky FAN.',
}

export default function ContactPage() {
  return (
    <Page>
      <PortfolioEnhancements />

      <section className="slide" style={{ paddingTop: '9rem' }}>
        <div className="geo-circle lg" style={{ top: '-100px', right: '-100px' }}></div>
        <div className="geo-circle sm" style={{ bottom: '10%', left: '8%' }}></div>
        <div className="container">
          <span className="slide-label reveal">Let&apos;s Talk</span>
          <h1 className="slide-headline reveal">Contact</h1>
          <p className="slide-subtitle reveal" style={{ marginBottom: '3rem' }}>
            I&apos;d love to hear from you — collaboration, project ideas, or just to say hi.
          </p>
          <div className="contact-grid">
            <div className="reveal">
              <div className="contact-methods">
                <a href="mailto:contact@jacky.fan" className="contact-method">
                  <div className="contact-method-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 7l10 7 10-7" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
                  <div className="contact-method-text"><div className="contact-method-label">Email</div><div className="contact-method-value">contact@jacky.fan</div></div>
                </a>
                <a href="https://github.com/redfrogsss" target="_blank" rel="noopener" className="contact-method">
                  <div className="contact-method-icon"><svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor"><path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg></div>
                  <div className="contact-method-text"><div className="contact-method-label">GitHub</div><div className="contact-method-value">@redfrogsss</div></div>
                </a>
                <a href="https://www.linkedin.com/in/jacky-fan-dev/" target="_blank" rel="noopener" className="contact-method">
                  <div className="contact-method-icon"><svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" /></svg></div>
                  <div className="contact-method-text"><div className="contact-method-label">LinkedIn</div><div className="contact-method-value">jacky-fan-dev</div></div>
                </a>
                <a href="https://blog.jacky.fan" target="_blank" rel="noopener" className="contact-method">
                  <div className="contact-method-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5v-15A2.5 2.5 0 016.5 2H20v20H6.5a2.5 2.5 0 01-2.5-2.5z" /><line x1="8" y1="7" x2="16" y2="7" /><line x1="8" y1="11" x2="14" y2="11" /></svg></div>
                  <div className="contact-method-text"><div className="contact-method-label">Blog</div><div className="contact-method-value">blog.jacky.fan</div></div>
                </a>
              </div>
            </div>
            <div className="reveal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="contact-card">
                <div style={{ marginBottom: '1rem' }}><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><polyline points="8 12 11 15 16 9" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
                <h3 style={{ marginBottom: '0.5rem' }}>Let&apos;s build something</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', lineHeight: 1.6, maxWidth: '260px' }}>Always excited to collaborate on meaningful projects. Drop me a message.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Page>
  )
}
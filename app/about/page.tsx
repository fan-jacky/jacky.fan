import { Page } from '@/components/basic'
import PortfolioEnhancements from '@/components/portfolio/PortfolioEnhancements'

export const metadata = {
  title: 'About - Jacky FAN',
  description: 'About Jacky FAN — Frontend Developer in Hong Kong.',
}

export default function AboutPage() {
  return (
    <Page>
      <PortfolioEnhancements />

      <section className="slide" style={{ paddingTop: '9rem' }}>
        <div className="geo-circle sm" style={{ top: '15%', right: '6%' }}></div>
        <div className="container">
          <span className="slide-label reveal">Get to Know Me</span>
          <h1 className="slide-headline reveal">About</h1>
          <p className="slide-subtitle reveal" style={{ marginBottom: '3rem' }}>
            A frontend developer passionate about building things for the web.
          </p>
          <div className="about-grid">
            <div className="about-bio reveal">
              <p>
                Hi, I&apos;m <strong>Jacky Fan</strong> — a Frontend Developer based in Hong Kong. I build responsive,
                accessible web experiences with TypeScript, React, Vue, and modern JavaScript frameworks.
              </p>
              <p>
                I&apos;m currently expanding further into full-stack work with Next.js, Nuxt, and Payload CMS while
                keeping a strong bias toward clean, maintainable frontend systems.
              </p>
              <p>
                Beyond code, I&apos;m a street photographer with a Ricoh GR IIIx and a self-hosting enthusiast. That mix
                of technical and visual thinking shapes the way I approach interfaces.
              </p>
            </div>
            <aside className="about-sidebar" style={{ position: 'sticky', top: '100px' }}>
              <div className="info-card reveal">
                <div className="about-avatar">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="8" r="5" />
                    <path d="M3 21c0-4.97 4.03-9 9-9s9 4.03 9 9" strokeLinecap="round" />
                  </svg>
                </div>
                <h3>Details</h3>
                <ul className="info-list">
                  <li><span className="info-label">Location</span><span className="info-value">Hong Kong</span></li>
                  <li><span className="info-label">Role</span><span className="info-value">Frontend Developer</span></li>
                  <li><span className="info-label">Focus</span><span className="info-value">React, Vue, TypeScript</span></li>
                  <li><span className="info-label">CMS</span><span className="info-value">Payload CMS</span></li>
                  <li><span className="info-label">Gear</span><span className="info-value">Ricoh GR IIIx</span></li>
                </ul>
                <div className="social-links">
                  <a href="https://github.com/redfrogsss" className="social-link" target="_blank" rel="noopener" aria-label="GitHub">
                    <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor"><path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>
                  </a>
                  <a href="https://www.linkedin.com/in/jacky-fan-dev/" className="social-link" target="_blank" rel="noopener" aria-label="LinkedIn">
                    <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" /></svg>
                  </a>
                  <a href="https://blog.jacky.fan" className="social-link" target="_blank" rel="noopener" aria-label="Blog">
                    <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor"><path d="M1 2.5A1.5 1.5 0 012.5 1h3A1.5 1.5 0 017 2.5v3A1.5 1.5 0 015.5 7h-3A1.5 1.5 0 011 5.5v-3zM2.5 2a.5.5 0 00-.5.5v3a.5.5 0 00.5.5h3a.5.5 0 00.5-.5v-3a.5.5 0 00-.5-.5h-3zm6.5.5a.5.5 0 01.5-.5h3a.5.5 0 010 1H9.5a.5.5 0 01-.5-.5zm.5 2.5a.5.5 0 000 1h4a.5.5 0 000-1H9.5zm0 3a.5.5 0 000 1h4a.5.5 0 000-1H9.5zm-8 2.5A1.5 1.5 0 013 9h3A1.5 1.5 0 017.5 10.5v3A1.5 1.5 0 016 15H3a1.5 1.5 0 01-1.5-1.5v-3zm1.5-.5a.5.5 0 00-.5.5v3a.5.5 0 00.5.5h3a.5.5 0 00.5-.5v-3a.5.5 0 00-.5-.5H3zm6.5.5a.5.5 0 01.5-.5h3a.5.5 0 010 1H9.5a.5.5 0 01-.5-.5zm.5 2.5a.5.5 0 000 1h4a.5.5 0 000-1H9.5z" /></svg>
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="slide slide-tinted">
        <div className="geo-dots" style={{ top: 0, right: 0, width: '240px', height: '100%' }}></div>
        <div className="container">
          <span className="slide-label reveal">What I Work With</span>
          <h2 className="slide-headline reveal">Core Skills</h2>
          <p className="slide-subtitle reveal" style={{ marginBottom: '2.5rem' }}>
            Technologies I use daily to build and ship.
          </p>
          <div className="skills-grid reveal">
            <div className="skill-bar-group">
              <div className="skill-bar"><span className="skill-bar-label">TypeScript</span><div className="skill-bar-track"><div className="skill-bar-fill" style={{ width: '90%' }}></div></div></div>
              <div className="skill-bar"><span className="skill-bar-label">React</span><div className="skill-bar-track"><div className="skill-bar-fill" style={{ width: '85%' }}></div></div></div>
              <div className="skill-bar"><span className="skill-bar-label">Vue / Nuxt</span><div className="skill-bar-track"><div className="skill-bar-fill" style={{ width: '80%' }}></div></div></div>
            </div>
            <div className="skill-bar-group">
              <div className="skill-bar"><span className="skill-bar-label">Next.js</span><div className="skill-bar-track"><div className="skill-bar-fill" style={{ width: '75%' }}></div></div></div>
              <div className="skill-bar"><span className="skill-bar-label">Tailwind</span><div className="skill-bar-track"><div className="skill-bar-fill" style={{ width: '90%' }}></div></div></div>
              <div className="skill-bar"><span className="skill-bar-label">Docker</span><div className="skill-bar-track"><div className="skill-bar-fill" style={{ width: '60%' }}></div></div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="slide slide-dark">
        <div className="geo-circle lg" style={{ borderColor: 'rgba(245,243,239,0.06)', top: '-80px', right: '-80px' }}></div>
        <div className="geo-accent" style={{ bottom: '-100px', right: '-80px' }}></div>
        <div className="container">
          <span className="slide-label reveal" style={{ color: 'rgba(245,243,239,0.6)' }}>Beyond the Screen</span>
          <h2 className="slide-headline reveal">What I Love</h2>
          <p className="slide-subtitle reveal" style={{ marginBottom: '3rem' }}>When I&apos;m not writing code, you&apos;ll find me here.</p>
          <div className="passions-grid reveal-stagger">
            <div className="passion-card">
              <div className="passion-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="3" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="1.5" fill="currentColor" /><path d="M4 9h2.5M17.5 9H20" /></svg>
              </div>
              <h3 className="passion-title">Street Photography</h3>
              <p className="passion-desc">I carry a Ricoh GR IIIx everywhere. Hong Kong streets, geometry, light, and unexpected moments keep my visual instincts sharp.</p>
            </div>
            <div className="passion-card">
              <div className="passion-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" /><rect x="2" y="14" width="20" height="8" rx="2" /><circle cx="6" cy="6" r="1" fill="currentColor" /><circle cx="6" cy="18" r="1" fill="currentColor" /><line x1="8" y1="18" x2="16" y2="18" /><line x1="8" y1="6" x2="16" y2="6" /></svg>
              </div>
              <h3 className="passion-title">Self-Hosting</h3>
              <p className="passion-desc">I run my own servers for blogs, game servers, and home services. It keeps my Linux, networking, and ops instincts honest.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="slide slide-tinted">
        <div className="geo-dots" style={{ top: 0, left: 0, width: '200px', height: '100%' }}></div>
        <div className="container">
          <span className="slide-label reveal">How I Work</span>
          <h2 className="slide-headline reveal">Principles</h2>
          <p className="slide-subtitle reveal" style={{ marginBottom: '3rem' }}>The values that guide how I build.</p>
          <div className="principles-grid reveal-stagger">
            <div className="principle-card"><div className="principle-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M4 12h10M4 18h14" /><circle cx="17" cy="12" r="3" /><path d="M19 10l2 2-2 2" /></svg></div><h4>Clean &amp; Maintainable</h4><p>I write code that the next developer can understand quickly, with consistent patterns and clear intent.</p></div>
            <div className="principle-card"><div className="principle-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2" /></svg></div><h4>Performance First</h4><p>Lighthouse scores and Core Web Vitals are part of the build process, not cleanup work left for later.</p></div>
            <div className="principle-card"><div className="principle-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg></div><h4>Always Learning</h4><p>The web moves fast. Staying useful means staying curious and putting new tools through real projects.</p></div>
          </div>
        </div>
      </section>
    </Page>
  )
}
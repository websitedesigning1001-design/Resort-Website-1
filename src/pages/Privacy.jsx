import React from 'react';
import PageTransition from '../components/PageTransition';
import { useCMSContent } from '../hooks/useCMS';

const fallbackPrivacy = {
  header: {
    title: 'PRIVACY POLICY',
    last_updated: 'Last Updated: June 1, 2026'
  },
  section1: {
    title: '1. Information We Collect',
    desc: 'At Aura Cove, we respect the privacy of our sanctuary guests. When you submit inquiries through our online forms or engage in our stay curation planner tools, we collect identifying information such as your name, email address, phone number, and stay preference details. This information is utilized purely to curate custom staying proposals.'
  },
  section2: {
    title: '2. How We Use Your Details',
    desc: 'We do not sell, trade, or distribute your private stay details to unauthorized third-party agencies. All guest files, accommodation selections, and wellness specifications are secured on encrypted clouds accessible only by our internal resort booking team and selected service execution partners.'
  },
  section3: {
    title: '3. Cookies & Analytical Data',
    desc: 'Our digital gallery uses silent session cookies to register viewport coordinates, custom cursor actions, and navigation speeds. This aggregated statistics file does not identify individual names and is used solely to enhance the visual performance of our web animations.'
  },
  section4: {
    title: '4. Contact Legal Office',
    desc: 'If you have questions regarding our data policies or request the complete deletion of your booking history files, please email us directly at legal@auracove.com.'
  }
};

export default function Privacy() {
  const { content: cms } = useCMSContent('privacy', fallbackPrivacy);

  return (
    <PageTransition>
      <section 
        style={{
          padding: '160px 10% 100px',
          backgroundColor: 'var(--bg-primary)',
          color: 'var(--text-primary)',
          minHeight: '100vh',
          fontFamily: 'var(--sans)',
          position: 'relative',
          zIndex: 3,
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span className="catalog-tag">LEGAL // DOCUMENTS</span>
          <h1 
            style={{
              fontFamily: 'var(--serif)',
              fontSize: '44px',
              fontWeight: 400,
              textTransform: 'uppercase',
              color: 'var(--text-primary)',
              margin: '10px 0 35px 0',
              borderBottom: '1px solid var(--border-formal)',
              paddingBottom: '20px',
            }}
          >
            {cms.header.title.split(' ')[0]} <span style={{ fontStyle: 'italic', color: 'var(--accent-gold)' }}>{cms.header.title.split(' ').slice(1).join(' ')}</span>
          </h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', fontSize: '14px', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
            <p>
              {cms.header.last_updated}
            </p>

            <div>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: '20px', color: 'var(--text-primary)', marginBottom: '10px', fontWeight: 500 }}>{cms.section1.title}</h3>
              <p>
                {cms.section1.desc}
              </p>
            </div>

            <div>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: '20px', color: 'var(--text-primary)', marginBottom: '10px', fontWeight: 500 }}>{cms.section2.title}</h3>
              <p>
                {cms.section2.desc}
              </p>
            </div>

            <div>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: '20px', color: 'var(--text-primary)', marginBottom: '10px', fontWeight: 500 }}>{cms.section3.title}</h3>
              <p>
                {cms.section3.desc}
              </p>
            </div>

            <div>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: '20px', color: 'var(--text-primary)', marginBottom: '10px', fontWeight: 500 }}>{cms.section4.title}</h3>
              <p>
                {cms.section4.desc}
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}

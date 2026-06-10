import React from 'react';
import PageTransition from '../components/PageTransition';
import { useCMSContent } from '../hooks/useCMS';

const fallbackTerms = {
  header: {
    title: 'TERMS OF SERVICE',
    last_updated: 'Last Updated: June 1, 2026'
  },
  section1: {
    title: '1. Reservations & Deposit',
    desc: 'To reserve a stay at Aura Cove, an initial booking deposit is required. This secures your villa or suite, spa appointments, and custom dining curations. Stays scheduled during peak seasons must be settled in full prior to check-in as per resort seasonal policies.'
  },
  section2: {
    title: '2. Property Care & Heritage Integrity',
    desc: 'Aura Cove is constructed using historic, preserved Tharavadu structures and teakwood. Guests are requested to respect the physical integrity of the historical buildings and gardens. Any damage to traditional woodwork or installations will be subject to repair fees.'
  },
  section3: {
    title: '3. Cancellation & Postponements',
    desc: 'Due to the highly bespoke nature of our spa therapies, cruises, and custom dining logistics, cancellations or reservation modifications must be submitted in writing at least 30 days prior to the scheduled arrival date to receive a refund or credit.'
  },
  section4: {
    title: '4. Local Jurisdictions',
    desc: 'These terms are governed by and construed in accordance with the local laws of Kerala, India.'
  }
};

export default function Terms() {
  const { content: cms } = useCMSContent('terms', fallbackTerms);

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

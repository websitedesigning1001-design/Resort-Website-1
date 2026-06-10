import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowUp } from 'lucide-react';
import { useSettings } from '../hooks/useCMS';

const fallbackSettings = {
  site_name: "Aura Cove",
  contact_email: "reservations@auracove.com",
  contact_phone: "+91 481 252 4310",
  contact_address: "Vembanad Lakefront, Kumarakom, Kottayam, Kerala - 686563, India",
  footer_text: "© 2026 Aura Cove Sanctuary. All rights reserved."
};

export default function Footer() {
  const topBtnRef = useRef(null);
  const { settings } = useSettings(fallbackSettings);

  useEffect(() => {
    const btn = topBtnRef.current;
    if (!btn) return;

    // Magnetic effect on back to top button
    const xTo = gsap.quickTo(btn, 'x', { duration: 0.3, ease: 'power3.out' });
    const yTo = gsap.quickTo(btn, 'y', { duration: 0.3, ease: 'power3.out' });

    const handleMouseMove = (e) => {
      const { left, top, width, height } = btn.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      const x = e.clientX - centerX;
      const y = e.clientY - centerY;
      xTo(x * 0.4);
      yTo(y * 0.4);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    btn.addEventListener('mousemove', handleMouseMove);
    btn.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      btn.removeEventListener('mousemove', handleMouseMove);
      btn.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer 
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-formal)',
        padding: '100px 5% 50px',
        color: 'var(--text-primary)',
        fontFamily: "var(--sans)",
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '50px',
          marginBottom: '80px',
        }}
      >
        {/* Brand Block */}
        <div style={{ gridColumn: 'span 2' }}>
          <h2 
            style={{
              fontFamily: "var(--serif)",
              fontSize: '34px',
              fontWeight: 600,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: 'var(--accent-gold)',
              marginBottom: '20px',
            }}
          >
            {settings.site_name}
          </h2>
          <p 
            style={{
              fontSize: '14px',
              lineHeight: '1.8',
              color: 'var(--text-secondary)',
              maxWidth: '350px',
            }}
          >
            {settings.site_description || "Bespoke backwater heritage luxury resort & spa. Nestled along the serene waters of Vembanad Lake in Kumarakom, Kerala, offering a seamless blend of traditional architectural design, bespoke wellness, and fine lakeside dining."}
          </p>
        </div>

        {/* Links with hover classes */}
        <div>
          <h4 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '25px', color: 'var(--accent-gold)' }}>Sanctuary</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <li><Link to="/" className="footer-link">Home</Link></li>
            <li><Link to="/portfolio" className="footer-link">Rooms & Suites</Link></li>
            <li><Link to="/services" className="footer-link">Experiences</Link></li>
            <li><Link to="/about" className="footer-link">Heritage</Link></li>
            <li><Link to="/contact" className="footer-link">Reserve Stay</Link></li>
          </ul>
        </div>

        {/* Office */}
        <div>
          <h4 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '25px', color: 'var(--accent-gold)' }}>Resort Sanctuary</h4>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.8', margin: 0, whiteSpace: 'pre-line' }}>
            {settings.contact_address}
          </p>
        </div>

        {/* Contact/Socials with hover classes */}
        <div>
          <h4 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '25px', color: 'var(--accent-gold)' }}>Reservations</h4>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 20px 0' }}>
            {settings.contact_email}<br />
            {settings.contact_phone}
          </p>
          <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
            <a 
              href={settings.instagram_url || "https://instagram.com"} 
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link"
              data-cursor="follow"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', transition: 'color 0.3s' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-gold)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a 
              href="https://pinterest.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link"
              data-cursor="follow"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', transition: 'color 0.3s' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-gold)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.289 2C6.617 2 2 6.617 2 12.289c0 4.354 2.707 8.077 6.541 9.585-.1-.812-.19-2.062.039-2.951.208-.883 1.34-5.679 1.34-5.679s-.342-.686-.342-1.7c0-1.592.924-2.781 2.072-2.781.977 0 1.448.733 1.448 1.61 0 .981-.625 2.45-.947 3.812-.269 1.14.576 2.068 1.7 2.068 2.04 0 3.606-2.152 3.606-5.259 0-2.75-1.977-4.672-4.796-4.672-3.266 0-5.184 2.45-5.184 4.985 0 .986.38 2.043.854 2.616.094.113.107.212.079.329l-.317 1.292c-.052.21-.173.255-.398.152-1.488-.693-2.419-2.868-2.419-4.616 0-3.757 2.73-7.208 7.872-7.208 4.133 0 7.344 2.945 7.344 6.88 0 4.106-2.589 7.41-6.183 7.41-1.208 0-2.343-.628-2.73-1.365l-.746 2.844c-.269 1.04-.997 2.344-1.487 3.141 1.14.352 2.35.544 3.608.544 5.671 0 10.288-4.618 10.288-10.289C22.578 6.617 17.96 2 12.289 2z"/>
              </svg>
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link"
              data-cursor="follow"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', transition: 'color 0.3s' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-gold)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div 
        style={{
          borderTop: '1px solid var(--border-formal)',
          paddingTop: '40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            {settings.footer_text || `© ${new Date().getFullYear()} ${settings.site_name} Resort & Spa. All rights reserved. Managed by Heritage Curation.`}
          </span>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link to="/privacy" className="footer-link" style={{ fontSize: '11px' }}>Privacy Policy</Link>
            <Link to="/terms" className="footer-link" style={{ fontSize: '11px' }}>Terms of Service</Link>
          </div>
        </div>

        {/* Back to top magnetic button */}
        <button
          ref={topBtnRef}
          onClick={scrollToTop}
          data-cursor="up"
          style={{
            width: '45px',
            height: '45px',
            borderRadius: '50%',
            backgroundColor: 'transparent',
            border: '1px solid var(--accent-gold)',
            color: 'var(--accent-gold)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            transition: 'background-color 0.3s, color 0.3s',
            outline: 'none',
          }}
        >
          <ArrowUp size={18} />
        </button>
      </div>
    </footer>
  );
}

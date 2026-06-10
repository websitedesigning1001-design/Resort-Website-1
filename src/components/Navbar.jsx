import React, { useRef, useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import gsap from 'gsap';
import { Menu, X, Phone, Mail, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../hooks/useCMS';

export default function Navbar() {
  const { settings } = useSettings({ logo_text: 'Aura Cove' });
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const itemsRef = useRef([]);
  const menuBtnRef = useRef(null);

  // Handle scroll to change navbar background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open to prevent background scrolling
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Magnetic hover effect function - Caches getBoundingClientRect to avoid layout thrashing
  const applyMagneticEffect = (el) => {
    if (!el) return;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.3, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.3, ease: 'power3.out' });

    let rect = null;

    const handleMouseEnter = () => {
      rect = el.getBoundingClientRect();
    };

    const handleMouseMove = (e) => {
      if (!rect) {
        rect = el.getBoundingClientRect();
      }
      const { left, top, width, height } = rect;
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      const x = e.clientX - centerX;
      const y = e.clientY - centerY;
      
      // Pull strength (30% of offset)
      xTo(x * 0.3);
      yTo(y * 0.3);
    };

    const handleMouseLeave = () => {
      rect = null;
      xTo(0);
      yTo(0);
    };

    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  };

  useEffect(() => {
    const cleanups = [];
    
    // Apply magnetic force to nav links and CTA button
    itemsRef.current.forEach((item) => {
      if (item) {
        const cleanup = applyMagneticEffect(item);
        if (cleanup) cleanups.push(cleanup);
      }
    });

    if (menuBtnRef.current) {
      const cleanup = applyMagneticEffect(menuBtnRef.current);
      if (cleanup) cleanups.push(cleanup);
    }

    return () => {
      cleanups.forEach((c) => c());
    };
  }, []);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/portfolio', label: 'Rooms & Suites' },
    { path: '/services', label: 'Experiences' },
    { path: '/about', label: 'Heritage' },
  ];

  return (
    <header 
      className={`navbar-header ${scrolled ? 'navbar-scrolled' : ''}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '90px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 5%',
        zIndex: 1000,
        transition: 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
        backgroundColor: scrolled ? 'var(--glass-bg)' : 'transparent',
        backdropFilter: scrolled ? 'blur(15px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--glass-border)' : '1px solid transparent',
      }}
    >
      {/* Logo */}
      <Link 
        to="/" 
        className="nav-logo"
        data-cursor="home"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          textDecoration: 'none',
        }}
      >
        {settings.logo_url ? (
          <img 
            src={settings.logo_url} 
            alt={settings.site_name || "Aura Cove Logo"} 
            style={{ 
              height: `${settings.logo_height || 35}px`, 
              width: 'auto', 
              objectFit: 'contain'
            }} 
          />
        ) : (
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: '1px solid var(--accent-gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontFamily: 'var(--serif)',
            color: 'var(--accent-gold)',
            fontWeight: 'bold'
          }}>
            {settings.logo_text ? settings.logo_text[0] : 'A'}
          </div>
        )}
        {settings.show_logo_text !== '0' && (
          <span 
            style={{
              fontFamily: "var(--serif)",
              fontSize: '20px',
              fontWeight: 600,
              letterSpacing: '2px',
              color: 'var(--text-primary)',
              textTransform: 'uppercase',
            }}
          >
            {settings.logo_text || settings.site_name || 'Aura Cove'}
          </span>
        )}
      </Link>

      {/* Desktop Links */}
      <nav 
        className="desktop-nav"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '40px',
        }}
      >
        <div style={{ display: 'flex', gap: '30px' }}>
          {navLinks.map((link, idx) => (
            <NavLink
              key={link.path}
              to={link.path}
              ref={(el) => (itemsRef.current[idx] = el)}
              data-cursor="explore"
              className={({ isActive }) => `nav-link-item ${isActive ? 'active-link' : ''}`}
              style={{
                fontFamily: "var(--sans)",
                fontSize: '12px',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                padding: '10px 15px',
                display: 'inline-block',
                position: 'relative',
                transition: 'color 0.3s ease',
              }}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <Link
          to="/contact"
          ref={(el) => (itemsRef.current[navLinks.length] = el)}
          data-cursor="reserve"
          className="btn-formal-double nav-cta-btn"
          style={{
            fontFamily: "var(--sans)",
            fontSize: '11px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '2px',
            color: 'var(--bg-primary)',
            backgroundColor: 'var(--accent-gold)',
            padding: '14px 28px',
            border: 'none',
            borderRadius: '0px',
            cursor: 'pointer',
            textDecoration: 'none',
            display: 'inline-block',
          }}
        >
          Reserve Stay
        </Link>
      </nav>

      {/* Mobile Menu Trigger */}
      <button
        ref={menuBtnRef}
        className="mobile-nav-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        data-cursor={menuOpen ? 'close' : 'menu'}
        style={{
          display: 'none', // Managed in media query
          background: 'none',
          border: 'none',
          color: 'var(--text-primary)',
          cursor: 'pointer',
          padding: '10px',
          zIndex: 1001,
        }}
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Navigation Drawer with elegant Framer Motion animations */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-nav-drawer"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(8, 8, 8, 0.98)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              zIndex: 999,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '120px 10% 60px',
            }}
          >
            {/* Background Grid Accent inside mobile drawer for premium feel */}
            <div className="background-grid" style={{ zIndex: 1 }}>
              <div className="grid-col-line" />
              <div className="grid-col-line" />
            </div>
            <div className="blueprint-dots" style={{ zIndex: 1 }} />

            <div 
              style={{ 
                position: 'relative', 
                zIndex: 2, 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '24px',
                marginTop: '10px'
              }}
            >
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + idx * 0.06, duration: 0.4 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      fontFamily: "var(--serif)",
                      fontSize: 'clamp(20px, 6.5vw, 32px)',
                      color: 'var(--text-primary)',
                      textDecoration: 'none',
                      textTransform: 'uppercase',
                      letterSpacing: '3px',
                      display: 'block',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      paddingBottom: '12px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <span style={{ fontSize: '11px', fontFamily: 'var(--sans)', color: 'var(--accent-gold)', marginRight: '15px', verticalAlign: 'middle' }}>
                      0{idx + 1}
                    </span>
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '30px' }}
            >
              <Link
                to="/contact"
                onClick={() => setMenuOpen(false)}
                className="btn-formal-double"
                style={{
                  fontFamily: "var(--sans)",
                  fontSize: '11px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  color: 'var(--bg-primary)',
                  backgroundColor: 'var(--accent-gold)',
                  padding: '14px 0',
                  textAlign: 'center',
                  textDecoration: 'none',
                  width: '100%',
                }}
              >
                Reserve Stay
              </Link>
              
              {/* Contact Information Footer */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px', fontFamily: 'var(--sans)', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={12} color="var(--accent-gold)" />
                  <span>Vembanad Lakefront, Kumarakom, Kerala</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Phone size={12} color="var(--accent-gold)" />
                  <span>+91 481 252 4310</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

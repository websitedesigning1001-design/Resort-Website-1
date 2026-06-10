import React, { useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import SmoothScroll from './components/SmoothScroll';
import CanvasParticles from './components/CanvasParticles';
import FloatingContactWidget from './components/FloatingContactWidget';

import Home from './pages/Home';
const Portfolio = React.lazy(() => import('./pages/Portfolio'));
const Services = React.lazy(() => import('./pages/Services'));
const About = React.lazy(() => import('./pages/About'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Privacy = React.lazy(() => import('./pages/Privacy'));
const Terms = React.lazy(() => import('./pages/Terms'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));

import { useSettings } from './hooks/useCMS';

// Scroll recovery component to snap window to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Animated routes wrapper enabling exit-before-enter page curtains
function AnimatedRoutes() {
  const location = useLocation();
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0a0a0a' }} />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

function AppContent() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  if (isAdminPath) {
    return <AnimatedRoutes />;
  }

  return (
    <SmoothScroll>
      <CustomCursor />
      
      {/* Background Architectural Grid Lines & Blueprint Dots */}
      <div className="background-grid">
        <div className="grid-col-line" />
        <div className="grid-col-line" />
        <div className="grid-col-line" />
        <div className="grid-col-line" />
      </div>
      <div className="blueprint-dots" />

      {/* Global ambient particle stars running behind pages in the darkest areas */}
      <CanvasParticles preset="stars" count={45} zIndex={1} opacityMax={0.4} />
      
      {/* Persistent global Navigation */}
      <Navbar />
      
      {/* Route-driven main container */}
      <main style={{ minHeight: '80vh', width: '100%', overflow: 'hidden', position: 'relative', zIndex: 10 }}>
        <AnimatedRoutes />
      </main>
      
      {/* Persistent global Footer */}
      <Footer />
      
      {/* Floating contact buttons (WhatsApp & Phone) */}
      <FloatingContactWidget />
    </SmoothScroll>
  );
}

export default function App() {
  const { settings } = useSettings({
    seo_title: 'Aura Cove Sanctuary - Heritage Luxury Resort & Spa Kumarakom',
    seo_description: 'Immerse in private infinity pool villas, Ayurvedic healing arts, and Vembanad Lake sunset cruises in Kumarakom, Kerala.',
    seo_keywords: 'luxury resort kerala, kumarakom resort, pool villa kumarakom, ayurveda retreat kerala, backwaters resort'
  });

  useEffect(() => {
    if (settings) {
      if (settings.seo_title) {
        document.title = settings.seo_title;
      }
      
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', settings.seo_description || '');
      } else {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        metaDesc.setAttribute('content', settings.seo_description || '');
        document.head.appendChild(metaDesc);
      }

      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', settings.seo_keywords || '');
      } else {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        metaKeywords.setAttribute('content', settings.seo_keywords || '');
        document.head.appendChild(metaKeywords);
      }

      // Helper to upsert meta tags by property or name
      const setMeta = (attr, key, content) => {
        if (!content) return;
        let el = document.querySelector(`meta[${attr}="${key}"]`);
        if (el) {
          el.setAttribute('content', content);
        } else {
          el = document.createElement('meta');
          el.setAttribute(attr, key);
          el.setAttribute('content', content);
          document.head.appendChild(el);
        }
      };

      // Open Graph tags
      setMeta('property', 'og:title', settings.og_title || settings.seo_title);
      setMeta('property', 'og:description', settings.og_description || settings.seo_description);
      setMeta('property', 'og:type', 'website');
      if (settings.og_image) setMeta('property', 'og:image', settings.og_image);
      if (settings.canonical_url) setMeta('property', 'og:url', settings.canonical_url);

      // Twitter Card tags
      setMeta('name', 'twitter:card', settings.twitter_card || 'summary_large_image');
      setMeta('name', 'twitter:title', settings.og_title || settings.seo_title);
      setMeta('name', 'twitter:description', settings.og_description || settings.seo_description);
      if (settings.og_image) setMeta('name', 'twitter:image', settings.og_image);
      if (settings.twitter_handle) setMeta('name', 'twitter:site', settings.twitter_handle);

      // Robots meta
      if (settings.robots_meta) setMeta('name', 'robots', settings.robots_meta);

      // Google Site Verification
      if (settings.google_verification) setMeta('name', 'google-site-verification', settings.google_verification);

      // Canonical URL
      if (settings.canonical_url) {
        let canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) {
          canonical.setAttribute('href', settings.canonical_url);
        } else {
          canonical = document.createElement('link');
          canonical.setAttribute('rel', 'canonical');
          canonical.setAttribute('href', settings.canonical_url);
          document.head.appendChild(canonical);
        }
      }

      // Google Analytics
      if (settings.ga_tracking_id && !document.querySelector(`script[src*="${settings.ga_tracking_id}"]`)) {
        const gaScript = document.createElement('script');
        gaScript.async = true;
        gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${settings.ga_tracking_id}`;
        document.head.appendChild(gaScript);
        const gaInit = document.createElement('script');
        gaInit.textContent = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${settings.ga_tracking_id}');`;
        document.head.appendChild(gaInit);
      }
    }
  }, [settings]);

  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}


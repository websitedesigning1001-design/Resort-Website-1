import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import TickerBanner from '../components/TickerBanner';
import CanvasParticles from '../components/CanvasParticles';
import { ArrowRight, MapPin, Info, X, Calendar, Compass, Star } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

import { useCMSContent, useSettings } from '../hooks/useCMS';

const FEATURED_ACCOMMODATIONS = [
  {
    id: 1,
    catalog: 'SANCTUARY N°01',
    title: 'The Vembanad Pool Villa',
    category: 'Villas',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=800&auto=format&fit=crop',
    location: 'Kumarakom, Kerala',
    coords: '9.5931° N, 76.4225° E',
    specs: { guests: '3 Guests', space: '1,800 sq ft', view: 'Private Infinity Pool' },
    desc: 'Our premier luxury villa, perched elegantly at the lake edge. Handcrafted from historic teakwood with traditional gabled ceilings, it offers a private infinity plunge pool, open-sky rain shower, and a wooden deck facing the sunset over Vembanad Lake.',
    gallery: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=600&auto=format&fit=crop'
    ]
  },
  {
    id: 2,
    catalog: 'SANCTUARY N°04',
    title: 'Lakeside Heritage Suite',
    category: 'Suites',
    image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=800&auto=format&fit=crop',
    location: 'Kumarakom, Kerala',
    coords: '9.5932° N, 76.4226° E',
    specs: { guests: '3 Guests', space: '1,200 sq ft', view: 'Private Open Courtyard' },
    desc: 'A stunning heritage suite built using authentic Tharavadu architecture. Unites antique copper details and hand-woven furnishings with a private open-air courtyard bath, offering pristine backwater views.',
    gallery: [
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=600&auto=format&fit=crop'
    ]
  },
  {
    id: 3,
    catalog: 'SANCTUARY N°07',
    title: 'The Heritage Houseboat Suite',
    category: 'Houseboats',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop',
    location: 'Kumarakom Waters',
    coords: '9.5930° N, 76.4222° E',
    specs: { guests: '2 Guests', space: '950 sq ft', view: 'Private Sailing Deck' },
    desc: 'A private luxury suite aboard a traditional Kettuvallam (Kerala rice barge). Crafted with hand-tied coir ropes and bamboo arches, featuring a glass-enclosed air-conditioned bedroom, ensuite bath, and dedicated butler service.',
    gallery: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=600&auto=format&fit=crop'
    ]
  },
  {
    id: 4,
    catalog: 'SANCTUARY N°09',
    title: 'Garden Lily Pond Room',
    category: 'Rooms',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800&auto=format&fit=crop',
    location: 'Garden Sanctuary',
    coords: '9.5934° N, 76.4228° E',
    specs: { guests: '4 Guests', space: '1,400 sq ft', view: 'Lily Pond veranda' },
    desc: 'Encompassed by ancient mango trees and tropical flora. Features an outdoor jacuzzi, traditional Kerala wooden swing (Aattukattil) on the veranda, and direct views of a lotus-filled private lily pond.',
    gallery: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=600&auto=format&fit=crop'
    ]
  }
];

const fallbackHome = {
  hero: {
    title: 'CURATORS OF BREATHING ROOM',
    subtitle: 'A luxury lakefront sanctuary in Kumarakom, Kerala',
    bg_image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=1600&auto=format&fit=crop'
  },
  philosophy: {
    tag: 'THE AURA COVE PHILOSOPHY // SANCTUARY',
    title: 'Conscious Architecture Meets Ancient Healing',
    p1: "Aura Cove was conceptualized as a living testament to Kerala's rich heritage. Constructed from centuries-old salvaged teakwood and antique brass, our design reflects authentic architectural traditions while providing breathing room from contemporary life.",
    p2: 'We combine restorative ayurvedic science, traditional lake navigation, and clay-pot slow gastronomy with modern luxury standards. Every experience is personalized by dedicated sanctuary hosts, ensuring your physical and mental alignment.',
    img1: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=600&auto=format&fit=crop',
    img2: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=600&auto=format&fit=crop',
    img3: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop',
    img4: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600&auto=format&fit=crop',
    img5: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=600&auto=format&fit=crop',
    img6: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=600&auto=format&fit=crop'
  },
  accommodations: {
    tag: 'ACCOMMODATIONS // RESERVES',
    title: 'Signature Sanctuaries',
    desc: 'Bespoke layouts providing breathing space. Staggered design cards that capture the unique atmosphere of each heritage suite.',
    btn_text: 'View Rooms Archive'
  },
  wellness: {
    tag: 'EXPERIENCE // SIGNATURE WELLNESS',
    title: 'Heritage Wellness Retreats',
    desc: 'Immerse yourself in traditional Panchakarma detoxification, lakeside yoga classes, and custom Organic dietary programs supervised by Ayurvedic doctors.',
    item1_catalog: 'WELLNESS RETREAT // 01',
    item1_title: 'Panchakarma Detox Program',
    item1_desc: 'A complete detoxification process using natural herbal pastes, synchronized hot oil massages, and custom steam baths to restore your body’s vital doshas.',
    item1_image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop',
    item1_location: 'Ayurveda Sanctuary',
    item1_duration: '7 - 14 Days',
    item2_catalog: 'WELLNESS RETREAT // 02',
    item2_title: 'Lakeside Yoga & Rasayana',
    item2_desc: 'Begin your mornings with guided pranayama and hatha yoga on our waterfront deck, complemented by anti-aging Rasayana herbal preparations and organic meals.',
    item2_image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=800&auto=format&fit=crop',
    item2_location: 'Vembanad Deck',
    item2_duration: '3 - 7 Days'
  },
  pillars: {
    tag: 'Resort Experiences',
    title: 'The Sanctuary Pillars',
    item1_num: '01',
    item1_title: 'Lakeside Living',
    item1_desc: 'Impeccable local architecture meeting contemporary luxury. Our pool villas and wood pavilions invite you to drift away to the rhythm of Kumarakom.',
    item2_num: '02',
    item2_title: 'Bespoke Wellness',
    item2_desc: 'Doctor-supervised healing regimes designed around your specific physiological blueprint. Pamper yourself with sanctuary herbs and organic diet structures.',
    item3_num: '03',
    item3_title: 'Lakeside Gastronomy',
    item3_desc: 'Fine lakeside dining featuring organic clay-pot culinary methods, fresh backwater seafood, and custom candlelight tablescapes.'
  },
  affiliations: {
    tag: 'Exclusive Affiliations',
    title: 'Our Luxury Partners',
    p1_name: 'VIRTUOSO',
    p1_desc: 'Preferred Member',
    p2_name: 'RELAIS & CHÂTEAUX',
    p2_desc: 'Luxury Partner',
    p3_name: 'CONDÉ NAST',
    p3_desc: 'Johansens Recommended',
    p4_name: 'LEADING HOTELS',
    p4_desc: 'Of The World',
    p5_name: 'AMEX FHR',
    p5_desc: 'Fine Hotels & Resorts',
    p6_name: 'TABLET HOTELS',
    p6_desc: 'Plus Collection'
  },
  ratings: {
    tag: 'FEEDBACK // PLATFORM RATINGS',
    title: 'Join the Conversation',
    platform1_name: 'MakeMyTrip',
    platform1_score: '4.2/5',
    platform1_text: 'Very Good',
    platform2_name: 'Agoda',
    platform2_score: '8.5/10',
    platform2_text: 'Excellent',
    platform3_name: 'Booking.com',
    platform3_score: '8/10',
    platform3_text: 'Very Good',
    platform4_name: 'Google',
    platform4_score: '4.5/5',
    platform4_text: '1000+ Reviews'
  }
};

export default function Home() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subRef = useRef(null);
  const triggerRef = useRef(null);
  const scrollSectionRef = useRef(null);
  
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [bgScale, setBgScale] = useState(1.08);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [accommodations, setAccommodations] = useState([]);

  const { content: cms } = useCMSContent('home', fallbackHome);
  const { settings } = useSettings({
    home_marquee: 'Aura Cove Resort & Spa, Ayurveda Sanctuary Spa, Lakeside Pool Villas, Michelin Culinary Dining, Private Backwater Cruises, Heritage Tharavadu Suites'
  });

  const homeMarqueeItems = (settings.home_marquee || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch accommodations');
        return res.json();
      })
      .then(data => {
        const featured = data.filter(item => item.is_featured === 1 && item.is_visible === 1);
        setAccommodations(featured.length > 0 ? featured : FEATURED_ACCOMMODATIONS);
      })
      .catch(err => {
        console.warn('Failed to load accommodations from API, using fallback.', err);
        setAccommodations(FEATURED_ACCOMMODATIONS);
      });
  }, []);

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProject]);

  const isPathHighlighted = (node1, node2) => {
    if (!hoveredNode) return false;
    if (!node2) return hoveredNode === node1;
    return hoveredNode === node1 || hoveredNode === node2;
  };

  useEffect(() => {
    const timer = setTimeout(() => setBgScale(1), 150);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile || isTablet) return;
    const handleMouseMove = (e) => {
      const x = (e.clientX - window.innerWidth / 2) * 0.015;
      const y = (e.clientY - window.innerHeight / 2) * 0.015;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile, isTablet]);

  useEffect(() => {
    // Setup title stagger animations only when CMS content is loaded
    if (titleRef.current && titleRef.current.children.length > 0) {
      gsap.fromTo(titleRef.current.children, 
        { y: 100, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out', stagger: 0.1, delay: 0.5 }
      );
    }

    if (subRef.current) {
      gsap.fromTo(subRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 1.2 }
      );
    }

    gsap.to('.hero-bg-parallax', {
      yPercent: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  useEffect(() => {
    if (isMobile || accommodations.length === 0) return;

    const section = scrollSectionRef.current;
    const trigger = triggerRef.current;
    if (!section || !trigger) return;

    const ctx = gsap.context(() => {
      gsap.to(section, {
        x: () => -(section.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: trigger,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${section.scrollWidth - window.innerWidth}`,
          invalidateOnRefresh: true,
        }
      });
    }, trigger);

    return () => {
      ctx.revert();
    };
  }, [isMobile, accommodations]);

  useEffect(() => {
    gsap.fromTo('.philosophy-text p', 
      { opacity: 0, y: 50 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1, 
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.philosophy-container',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }, []);

  return (
    <PageTransition>
      {/* 1. Hero Section */}
      <section 
        ref={heroRef}
        style={{
          height: '100vh',
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '0 5%',
          backgroundColor: '#050505',
        }}
      >
        <div 
          className="hero-bg-parallax"
          style={{
            position: 'absolute',
            top: '-20%',
            left: 0,
            width: '100%',
            height: '140%',
            backgroundImage: `linear-gradient(rgba(5, 5, 5, 0.72), rgba(5, 5, 5, 0.94)), url('${cms.hero.bg_image}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 1,
            transform: `scale(${bgScale})`,
            transition: 'transform 4.5s cubic-bezier(0.25, 1, 0.5, 1)',
          }}
        />

        <CanvasParticles preset="bokeh" count={isMobile ? 6 : 14} zIndex={2} />
        <CanvasParticles preset="embers" count={isMobile ? 35 : 120} zIndex={4} />

        {/* Concept Experience Network Map (Offset positions from boundary, zIndex: 50 tooltips) */}
        {!(isMobile || isTablet) && (
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 6,
              transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
              transition: 'transform 0.25s cubic-bezier(0.25, 1, 0.5, 1)',
            }}
          >
            <svg 
              viewBox="0 0 1000 1000" 
              preserveAspectRatio="none"
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
            >
              {/* Outer Boundary Curves */}
              <path 
                d="M 250 220 Q 500 120 750 220" 
                fill="none" 
                stroke={isPathHighlighted('villas', 'spa') ? 'var(--accent-gold)' : 'rgba(189, 160, 120, 0.06)'} 
                strokeWidth={isPathHighlighted('villas', 'spa') ? '1.5' : '1'} 
                style={{ transition: 'all 0.4s ease' }}
              />
              <path 
                d="M 250 220 Q 500 120 750 220" 
                fill="none" 
                stroke={isPathHighlighted('villas', 'spa') ? '#ffffff' : 'rgba(189, 160, 120, 0.22)'} 
                strokeWidth={isPathHighlighted('villas', 'spa') ? '2' : '1.2'} 
                strokeDasharray={isPathHighlighted('villas', 'spa') ? '12,6' : '6,8'} 
                className="flowing-line" 
                style={{ 
                  animationDuration: isPathHighlighted('villas', 'spa') ? '0.7s' : '1.5s',
                  transition: 'all 0.4s ease'
                }} 
              />

              <path 
                d="M 750 220 Q 820 470 720 720" 
                fill="none" 
                stroke={isPathHighlighted('spa', 'cruises') ? 'var(--accent-gold)' : 'rgba(189, 160, 120, 0.06)'} 
                strokeWidth={isPathHighlighted('spa', 'cruises') ? '1.5' : '1'} 
                style={{ transition: 'all 0.4s ease' }}
              />
              <path 
                d="M 750 220 Q 820 470 720 720" 
                fill="none" 
                stroke={isPathHighlighted('spa', 'cruises') ? '#ffffff' : 'rgba(189, 160, 120, 0.22)'} 
                strokeWidth={isPathHighlighted('spa', 'cruises') ? '2' : '1.2'} 
                strokeDasharray={isPathHighlighted('spa', 'cruises') ? '12,6' : '6,8'} 
                className="flowing-line" 
                style={{ 
                  animationDuration: isPathHighlighted('spa', 'cruises') ? '0.7s' : '1.5s',
                  transition: 'all 0.4s ease'
                }} 
              />

              <path 
                d="M 720 720 Q 500 820 280 740" 
                fill="none" 
                stroke={isPathHighlighted('cruises', 'dining') ? 'var(--accent-gold)' : 'rgba(189, 160, 120, 0.06)'} 
                strokeWidth={isPathHighlighted('cruises', 'dining') ? '1.5' : '1'} 
                style={{ transition: 'all 0.4s ease' }}
              />
              <path 
                d="M 720 720 Q 500 820 280 740" 
                fill="none" 
                stroke={isPathHighlighted('cruises', 'dining') ? '#ffffff' : 'rgba(189, 160, 120, 0.22)'} 
                strokeWidth={isPathHighlighted('cruises', 'dining') ? '2' : '1.2'} 
                strokeDasharray={isPathHighlighted('cruises', 'dining') ? '12,6' : '6,8'} 
                className="flowing-line" 
                style={{ 
                  animationDuration: isPathHighlighted('cruises', 'dining') ? '0.7s' : '1.5s',
                  transition: 'all 0.4s ease'
                }} 
              />

              <path 
                d="M 280 740 Q 180 480 250 220" 
                fill="none" 
                stroke={isPathHighlighted('dining', 'villas') ? 'var(--accent-gold)' : 'rgba(189, 160, 120, 0.06)'} 
                strokeWidth={isPathHighlighted('dining', 'villas') ? '1.5' : '1'} 
                style={{ transition: 'all 0.4s ease' }}
              />
              <path 
                d="M 280 740 Q 180 480 250 220" 
                fill="none" 
                stroke={isPathHighlighted('dining', 'villas') ? '#ffffff' : 'rgba(189, 160, 120, 0.22)'} 
                strokeWidth={isPathHighlighted('dining', 'villas') ? '2' : '1.2'} 
                strokeDasharray={isPathHighlighted('dining', 'villas') ? '12,6' : '6,8'} 
                className="flowing-line" 
                style={{ 
                  animationDuration: isPathHighlighted('dining', 'villas') ? '0.7s' : '1.5s',
                  transition: 'all 0.4s ease'
                }} 
              />

              {/* Inner diagonals removed for visual clarity */}
            </svg>

            {/* Node A (Accommodations) */}
            <div 
              className="hero-node-container" 
              style={{ left: '25%', top: '22%', cursor: 'pointer' }}
              onMouseEnter={() => setHoveredNode('villas')}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => navigate('/portfolio')}
            >
              <div className="hero-node-circle" data-cursor="explore">
                <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=400&auto=format&fit=crop" alt="Villas" />
              </div>
              <div className="hero-node-info">
                <span className="hero-node-coords">[ STAY • 9.5931° N ]</span>
                <span className="hero-node-name">Suites & Villas</span>
              </div>
              <div className="hero-node-tooltip align-top-left" style={{ zIndex: 99, background: '#0a0a0a' }}>
                <span className="tooltip-title">Heritage Sanctuaries</span>
                <span className="tooltip-metrics">Pool Villas & Suites • From ₹16K</span>
                <p className="tooltip-desc">Experience historic Tharavadu teakwood details, private infinity pools, and direct views of Vembanad Lake.</p>
                <span className="tooltip-action">Explore Sanctuaries →</span>
              </div>
            </div>

            {/* Node B (Wellness) */}
            <div 
              className="hero-node-container" 
              style={{ left: '75%', top: '22%', cursor: 'pointer' }}
              onMouseEnter={() => setHoveredNode('spa')}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => navigate('/services')}
            >
              <div className="hero-node-circle" data-cursor="explore">
                <img src="https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=400&auto=format&fit=crop" alt="Ayurveda Spa" />
              </div>
              <div className="hero-node-info">
                <span className="hero-node-coords">[ SPA • AYURVEDA ]</span>
                <span className="hero-node-name">Ayurveda Sanctuary</span>
              </div>
              <div className="hero-node-tooltip align-top-right" style={{ zIndex: 99, background: '#0a0a0a' }}>
                <span className="tooltip-title">Ayurvedic Rejuvenation</span>
                <span className="tooltip-metrics">Holistic Detox • Doctor Led</span>
                <p className="tooltip-desc">Reclaim vitality with personalized oil therapies, herbal steam baths, and sunrise yoga sessions by the lake.</p>
                <span className="tooltip-action">View Wellness Packages →</span>
              </div>
            </div>

            {/* Node C (Gastronomy) */}
            <div 
              className="hero-node-container" 
              style={{ left: '28%', top: '74%', cursor: 'pointer' }}
              onMouseEnter={() => setHoveredNode('dining')}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => navigate('/services')}
            >
              <div className="hero-node-circle" data-cursor="explore">
                <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=400&auto=format&fit=crop" alt="Lakeside Dining" />
              </div>
              <div className="hero-node-info">
                <span className="hero-node-coords">[ DINING • FINE ART ]</span>
                <span className="hero-node-name">Vembanad Dining</span>
              </div>
              <div className="hero-node-tooltip align-bottom-left" style={{ zIndex: 99, background: '#0a0a0a' }}>
                <span className="tooltip-title">Lakeside Gastronomy</span>
                <span className="tooltip-metrics">Authentic Sadhyas • Fresh Catch</span>
                <p className="tooltip-desc">Gourmet organic dining showcasing traditional clay-pot culinary methods and freshly sourced backwater ingredients.</p>
                <span className="tooltip-action">View Culinary Venues →</span>
              </div>
            </div>

            {/* Node D (Adventures) */}
            <div 
              className="hero-node-container" 
              style={{ left: '72%', top: '72%', cursor: 'pointer' }}
              onMouseEnter={() => setHoveredNode('cruises')}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => {
                const el = document.querySelector('.philosophy-container');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <div className="hero-node-circle" data-cursor="explore">
                <img src="https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=400&auto=format&fit=crop" alt="Adventures" />
              </div>
              <div className="hero-node-info">
                <span className="hero-node-coords">[ CRUISE • VEMBANAD ]</span>
                <span className="hero-node-name">Lake Cruises</span>
              </div>
              <div className="hero-node-tooltip align-bottom-right" style={{ zIndex: 99, background: '#0a0a0a' }}>
                <span className="tooltip-title">Bespoke Houseboats</span>
                <span className="tooltip-metrics">Private Yacht • Heritage Skiff</span>
                <p className="tooltip-desc">Glide across Kumarakom’s canals on an authentic thatched-roof houseboat, or enjoy private romantic cruises.</p>
                <span className="tooltip-action">Estimate Custom Stay Below ↓</span>
              </div>
            </div>
          </div>
        )}

        <div style={{ zIndex: 5, pointerEvents: 'none' }}>
          <span 
            ref={subRef}
            style={{
              fontFamily: "var(--sans)",
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '6px',
              color: 'var(--accent-gold)',
              marginBottom: '25px',
              display: 'block',
              fontWeight: 500,
            }}
          >
            Aura Cove Resort & Spa
          </span>
          
          <h1 
            ref={titleRef}
            style={{
              fontFamily: "var(--serif)",
              fontSize: 'clamp(44px, 7.5vw, 92px)',
              fontWeight: 400,
              lineHeight: '1.1',
              color: 'var(--text-primary)',
              textTransform: 'uppercase',
              margin: '0 0 25px 0',
              letterSpacing: '3px',
              overflow: 'hidden',
            }}
          >
            {cms.hero.title.includes('HERITAGE') ? (
              <>
                <span style={{ display: 'block' }}>{cms.hero.title.substring(0, cms.hero.title.indexOf('HERITAGE')).trim()}</span>
                <span style={{ display: 'block', fontStyle: 'italic', color: 'var(--accent-gold)' }}>{cms.hero.title.substring(cms.hero.title.indexOf('HERITAGE'))}</span>
              </>
            ) : cms.hero.title.includes('OF') ? (
              <>
                <span style={{ display: 'block' }}>{cms.hero.title.substring(0, cms.hero.title.indexOf('OF') + 2)}</span>
                <span style={{ display: 'block', fontStyle: 'italic', color: 'var(--accent-gold)' }}>{cms.hero.title.substring(cms.hero.title.indexOf('OF') + 3)}</span>
              </>
            ) : (
              <span style={{ display: 'block' }}>{cms.hero.title}</span>
            )}
          </h1>

          <div style={{ overflow: 'hidden' }}>
            <p 
              style={{
                fontFamily: "var(--sans)",
                fontSize: '13px',
                color: 'var(--text-secondary)',
                letterSpacing: '1.5px',
                maxWidth: '650px',
                margin: '0 auto',
                lineHeight: '1.6',
                textTransform: 'uppercase',
              }}
            >
              {cms.hero.subtitle}
            </p>

            {(isMobile || isTablet) && (
              <div 
                style={{
                  display: 'grid',
                  gridTemplateColumns: isTablet ? 'repeat(4, 1fr)' : 'repeat(2, 1fr)',
                  gap: '12px',
                  marginTop: '30px',
                  width: '100%',
                  maxWidth: isTablet ? '900px' : '480px',
                  pointerEvents: 'auto',
                }}
              >
                {[
                  { name: 'Suites & Villas', path: '/portfolio', img: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=200&auto=format&fit=crop' },
                  { name: 'Ayur Wellness', path: '/services', img: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=200&auto=format&fit=crop' },
                  { name: 'Lake Dining', path: '/services', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=200&auto=format&fit=crop' },
                  { name: 'Water Cruises', path: '/services', img: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=200&auto=format&fit=crop' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => navigate(item.path)}
                    style={{
                      position: 'relative',
                      height: '90px',
                      border: '1px solid var(--border-formal)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      padding: '12px',
                      backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.85)), url('${item.img}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <span style={{ fontSize: '7px', fontFamily: 'var(--sans)', color: 'var(--accent-gold)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                      [ EXPLORE ]
                    </span>
                    <span style={{ fontSize: '11px', fontFamily: 'var(--sans)', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '2px' }}>
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div 
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-secondary)' }}>
            Explore Sanctuary
          </span>
          <div 
            style={{
              width: '1px',
              height: '50px',
              backgroundColor: 'var(--accent-gold)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div 
              className="scroll-line-anim"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'var(--text-primary)',
                transform: 'translateY(-100%)',
              }}
            />
          </div>
        </div>
      </section>

      {/* 2. Brand Philosophy (Layered Collage Layout) */}
      <section 
        className="philosophy-container"
        style={{
          padding: '160px 10%',
          backgroundColor: 'var(--bg-primary)',
          position: 'relative',
          overflow: 'hidden',
          zIndex: 3,
        }}
      >
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '80px',
            alignItems: 'center',
          }}
        >
          <div className="layered-container philosophy-text" style={{ borderLeft: '3px solid var(--accent-gold)' }}>
            <span className="catalog-tag">{cms.philosophy.tag}</span>
            
            <p 
              style={{
                fontFamily: "var(--serif)",
                fontSize: '34px',
                lineHeight: '1.35',
                color: 'var(--text-primary)',
                fontWeight: 400,
                margin: '0 0 25px 0',
              }}
            >
              {cms.philosophy.title}
            </p>
            
            <p 
              style={{
                fontSize: '14px',
                lineHeight: '1.8',
                color: 'var(--text-secondary)',
                margin: '0 0 30px 0',
                fontFamily: 'var(--sans)',
              }}
            >
              {cms.philosophy.p1}
            </p>
            
            <Link 
              to="/about"
              data-cursor="about"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                color: 'var(--accent-gold)',
                textDecoration: 'none',
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                fontFamily: 'var(--sans)',
              }}
            >
              Discover Our Heritage <ArrowRight size={16} />
            </Link>
          </div>

          {/* Decoupled Asymmetrical Floating Collage */}
          {(isMobile || isTablet) ? (
            <div 
              style={{ 
                display: 'grid', 
                gridTemplateColumns: '2fr 1fr', 
                gap: '15px', 
                width: '100%', 
                height: '350px',
                marginTop: '30px'
              }}
            >
              {/* Left main image */}
              <div 
                style={{ 
                  position: 'relative',
                  border: '1px solid var(--border-formal)',
                  padding: '4px',
                  height: '100%',
                }}
              >
                <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                  <img 
                    src={cms.philosophy.img1} 
                    alt="Resort Pool Villa" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </div>
                <div style={{ position: 'absolute', bottom: '15px', left: '15px', backgroundColor: 'var(--glass-bg)', border: '1px solid var(--glass-border)', padding: '5px 10px', fontSize: '8px', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--accent-gold)' }}>
                  Lakeside Pool Villa
                </div>
              </div>

              {/* Right side stacked images */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', height: '100%' }}>
                <div style={{ flex: 1, border: '1px solid var(--border-formal)', padding: '3px', position: 'relative', overflow: 'hidden' }}>
                  <img 
                    src={cms.philosophy.img2} 
                    alt="Ayurveda Room" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </div>
                <div style={{ flex: 1, border: '1px solid var(--border-formal)', padding: '3px', position: 'relative', overflow: 'hidden' }}>
                  <img 
                    src={cms.philosophy.img3} 
                    alt="Sunset Cruise" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </div>
              </div>
            </div>
          ) : (
            <div style={{ position: 'relative', width: '100%', height: '600px' }}>
              <div 
                style={{
                  position: 'absolute',
                  top: '-30px',
                  right: '-30px',
                  fontSize: '180px',
                  fontFamily: "var(--serif)",
                  fontWeight: 900,
                  color: 'rgba(189, 160, 120, 0.015)',
                  pointerEvents: 'none',
                  userSelect: 'none',
                  zIndex: 0,
                }}
              >
                COVE
              </div>

              {/* Image 1: Pool Villa center */}
              <div 
                className="collage-wrapper float-slow-1"
                style={{ top: '12%', left: '12%', width: '45%', height: '50%', zIndex: 5 }}
              >
                <div className="collage-card" data-cursor="discover">
                  <img src={cms.philosophy.img1} alt="Resort Pool Villa" />
                </div>
              </div>

              {/* Image 2: Ayurveda room */}
              <div 
                className="collage-wrapper float-slow-2"
                style={{ top: '3%', left: '58%', width: '32%', height: '36%', zIndex: 4 }}
              >
                <div className="collage-card" data-cursor="discover">
                  <img src={cms.philosophy.img2} alt="Ayurveda Treatment Room" />
                </div>
              </div>

              {/* Image 3: Lakeside table */}
              <div 
                className="collage-wrapper float-med-1"
                style={{ top: '48%', left: '50%', width: '42%', height: '40%', zIndex: 6 }}
              >
                <div className="collage-card" data-cursor="discover">
                  <img src={cms.philosophy.img3} alt="Candlelight Lakeside Table" />
                </div>
              </div>

              {/* Image 4: Traditional Houseboat */}
              <div 
                className="collage-wrapper float-med-2"
                style={{ top: '3%', left: '2%', width: '28%', height: '28%', zIndex: 3 }}
              >
                <div className="collage-card" data-cursor="discover">
                  <img src={cms.philosophy.img4} alt="Kerala Houseboat Suite" />
                </div>
              </div>

              {/* Image 5: Lily Pond gardens */}
              <div 
                className="collage-wrapper float-slow-1"
                style={{ top: '38%', left: '38%', width: '22%', height: '22%', zIndex: 7 }}
              >
                <div className="collage-card" data-cursor="discover">
                  <img src={cms.philosophy.img5} alt="Lily Pond Gardens" />
                </div>
              </div>

              {/* Image 6: Backwater sunset */}
              <div 
                className="collage-wrapper float-slow-2"
                style={{ top: '65%', left: '8%', width: '32%', height: '28%', zIndex: 2 }}
              >
                <div className="collage-card" data-cursor="discover">
                  <img src={cms.philosophy.img6} alt="Vembanad Sunset Cruise" />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Scrolling Text Banner */}
      <TickerBanner items={homeMarqueeItems} />

      {/* 3. Asymmetrical Featured Rooms Showcase */}
      <div 
        ref={triggerRef}
        style={{
          overflow: 'hidden',
          backgroundColor: 'var(--bg-secondary)',
          position: 'relative',
          zIndex: 3,
          borderBottom: '1px solid var(--border-formal)',
        }}
      >
        {isMobile ? (
          <div style={{ padding: '80px 5% 60px' }}>
            <span className="catalog-tag">ACCOMMODATIONS // SELECTED</span>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: '36px', textTransform: 'uppercase', marginBottom: '40px' }}>
              Featured <span style={{ fontStyle: 'italic', color: 'var(--accent-gold)' }}>Sanctuaries</span>
            </h2>
            
            <div className="mobile-swipe-wrap">
              {accommodations.map((project, idx) => (
                <div 
                  key={idx} 
                  className="mobile-swipe-card"
                  style={{
                    width: '85vw',
                    border: '1px solid var(--border-formal)',
                    backgroundColor: 'var(--bg-primary)',
                    cursor: 'pointer',
                  }}
                  onClick={() => setSelectedProject(project)}
                >
                  <div style={{ height: '240px', overflow: 'hidden' }}>
                    <img src={project.image_url || project.image} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                  </div>
                  <div style={{ padding: '25px' }}>
                    <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--accent-gold)', display: 'block', marginBottom: '8px' }}>
                      {project.catalog} • {project.category}
                    </span>
                    <h3 style={{ fontFamily: 'var(--serif)', fontSize: '22px', margin: '0 0 15px 0' }}>{project.title}</h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--border-formal)', paddingTop: '15px' }}>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <MapPin size={12} color="var(--accent-gold)" /> {project.location}
                      </div>
                      <div style={{ fontSize: '11px', color: 'rgba(189, 160, 120, 0.6)', fontFamily: 'var(--sans)' }}>
                        [ COORDS: {project.coords} ]
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '30px', textAlign: 'center' }}>
              <Link 
                to="/portfolio"
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  color: 'var(--accent-gold)',
                  textDecoration: 'none',
                  fontWeight: 600
                }}
              >
                View Rooms Archive <ArrowRight size={14} style={{ display: 'inline', marginLeft: '5px' }} />
              </Link>
            </div>
          </div>
        ) : (
          <div 
            ref={scrollSectionRef}
            style={{
              height: '100vh',
              display: 'flex',
              alignItems: 'center',
              width: 'fit-content',
              paddingLeft: '10%',
              paddingRight: '15vw',
            }}
          >
            <div style={{ width: isTablet ? '350px' : '450px', flexShrink: 0, paddingRight: isTablet ? '30px' : '60px' }}>
              <span className="catalog-tag">{cms.accommodations.tag}</span>
              <h2 
                style={{
                  fontFamily: "var(--serif)",
                  fontSize: '46px',
                  fontWeight: 400,
                  lineHeight: '1.25',
                  color: 'var(--text-primary)',
                  margin: '0 0 20px 0',
                  textTransform: 'uppercase',
                }}
              >
                {cms.accommodations.title.split(' ')[0]}<br />
                <span style={{ fontStyle: 'italic', color: 'var(--accent-gold)' }}>{cms.accommodations.title.split(' ').slice(1).join(' ')}</span>
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.7', marginBottom: '35px', fontFamily: 'var(--sans)' }}>
                {cms.accommodations.desc}
              </p>
              <Link 
                to="/portfolio"
                data-cursor="view all"
                style={{
                  padding: '14px 28px',
                  border: '1px solid var(--accent-gold)',
                  color: 'var(--accent-gold)',
                  textDecoration: 'none',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  fontWeight: 600,
                  display: 'inline-block',
                  transition: 'all 0.3s',
                  fontFamily: 'var(--sans)',
                }}
              >
                {cms.accommodations.btn_text}
              </Link>
            </div>

            {/* Asymmetrical Cards Grid - Staggered Y coordinates, breathing margin gaps */}
            {accommodations.map((project, idx) => (
              <div 
                key={idx}
                style={{
                  width: '28vw', 
                  height: '52vh',
                  maxWidth: '440px',
                  flexShrink: 0,
                  paddingRight: '50px',
                  position: 'relative',
                  cursor: 'pointer',
                  // Alternate card y position for asymmetrical spacing layout
                  transform: idx % 2 === 0 ? 'translateY(-20px)' : 'translateY(20px)',
                  transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                onClick={() => setSelectedProject(project)}
              >
                <div 
                  style={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    border: '1px solid var(--border-formal)',
                  }}
                  data-cursor="discover"
                >
                  <img 
                    src={project.image_url || project.image} 
                    alt={project.title}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)',
                    }}
                    className="portfolio-hover-img"
                  />
                  
                  <div 
                    className="layered-container"
                    style={{
                      position: 'absolute',
                      bottom: '20px',
                      left: '20px',
                      right: '20px',
                      padding: '18px 22px',
                      width: 'auto',
                      zIndex: 2,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--accent-gold)', fontFamily: 'var(--sans)', fontWeight: 600 }}>
                        {project.category}
                      </span>
                      <span className="coordinate-tag" style={{ fontSize: '8px', color: 'var(--text-secondary)', margin: 0 }}>
                        [ {project.coords} ]
                      </span>
                    </div>

                    <h3 style={{ fontFamily: "var(--serif)", fontSize: '17px', fontWeight: 500, margin: '0 0 12px 0', color: 'var(--text-primary)' }}>
                      {project.title}
                    </h3>
                    
                    <div style={{ display: 'flex', gap: '20px', borderTop: '1px solid var(--border-formal)', paddingTop: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'var(--sans)' }}>
                        <MapPin size={11} color="var(--accent-gold)" /> {project.location}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'var(--sans)' }}>
                        <Info size={11} color="var(--accent-gold)" /> {project.catalog}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Signature Wellness & Retreats - Offset Layout Grid */}
      <section 
        style={{
          padding: '140px 10%',
          backgroundColor: '#070707',
          position: 'relative',
          zIndex: 3,
          borderTop: '1px solid var(--border-formal)',
          borderBottom: '1px solid var(--border-formal)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '80px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <span className="catalog-tag">{cms.wellness.tag}</span>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(32px, 4.5vw, 48px)', textTransform: 'uppercase', color: 'var(--text-primary)', margin: '10px 0 0', fontWeight: 400 }}>
              {cms.wellness.title.split(' ').slice(0, -1).join(' ')} <span style={{ fontStyle: 'italic', color: 'var(--accent-gold)' }}>{cms.wellness.title.split(' ').slice(-1)[0]}</span>
            </h2>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'var(--sans)', letterSpacing: '1px', maxWidth: '380px', lineHeight: '1.6' }}>
            {cms.wellness.desc}
          </span>
        </div>

        {/* Asymmetrical Staggered Columns: Stretched heights, non-sticky layout spacing */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
            gap: '40px',
            alignItems: 'start'
          }}
        >
          {[
            {
              catalog: cms.wellness.item1_catalog,
              title: cms.wellness.item1_title,
              desc: cms.wellness.item1_desc,
              image: cms.wellness.item1_image,
              location: cms.wellness.item1_location,
              duration: cms.wellness.item1_duration
            },
            {
              catalog: cms.wellness.item2_catalog,
              title: cms.wellness.item2_title,
              desc: cms.wellness.item2_desc,
              image: cms.wellness.item2_image,
              location: cms.wellness.item2_location,
              duration: cms.wellness.item2_duration
            }
          ].map((item, idx) => (
            <div 
              key={idx} 
              className="layered-container"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-formal)',
                padding: '20px',
                // Asymmetrical offset heights for non-sticky editorial grid
                marginTop: !isMobile && idx === 1 ? '40px' : '0px',
                transform: !isMobile && idx === 0 ? 'translateY(-10px)' : 'none',
                transition: 'transform 0.6s ease, margin 0.6s ease',
              }}
            >
              <div style={{ height: '230px', overflow: 'hidden', border: '1px solid var(--border-formal)', marginBottom: '20px', position: 'relative' }}>
                <img 
                  src={item.image} 
                  alt={item.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)' }} 
                  className="portfolio-hover-img"
                  loading="lazy"
                />
              </div>
              <span style={{ fontSize: '9px', fontFamily: 'var(--sans)', letterSpacing: '2px', color: 'var(--accent-gold)', display: 'block', marginBottom: '10px', fontWeight: 600 }}>
                {item.catalog}
              </span>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: '24px', fontWeight: 400, color: 'var(--text-primary)', margin: '0 0 15px 0' }}>
                {item.title}
              </h3>
              <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', lineHeight: '1.8', color: 'var(--text-secondary)', margin: '0 0 25px 0' }}>
                {item.desc}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-formal)', paddingTop: '18px', fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'var(--sans)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>📍 {item.location}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>📅 {item.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Curation Pillars (Resort features) */}
      <section 
        style={{
          padding: '140px 10%',
          backgroundColor: 'var(--bg-primary)',
          textAlign: 'center',
          position: 'relative',
          zIndex: 3,
        }}
      >
        <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '3px', color: 'var(--accent-gold)', display: 'block', marginBottom: '20px', fontFamily: 'var(--sans)' }}>
          {cms.pillars.tag}
        </span>
        <h2 
          style={{
            fontFamily: "var(--serif)",
            fontSize: '44px',
            fontWeight: 400,
            color: 'var(--text-primary)',
            textTransform: 'uppercase',
            marginBottom: '65px',
            letterSpacing: '1px',
          }}
        >
          {cms.pillars.title.split(' ').slice(0, -1).join(' ')} <span style={{ fontStyle: 'italic', color: 'var(--accent-gold)' }}>{cms.pillars.title.split(' ').slice(-1)[0]}</span>
        </h2>

        {/* Dynamic breathing grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '40px',
          }}
        >
          {[
            {
              num: cms.pillars.item1_num,
              title: cms.pillars.item1_title,
              desc: cms.pillars.item1_desc
            },
            {
              num: cms.pillars.item2_num,
              title: cms.pillars.item2_title,
              desc: cms.pillars.item2_desc
            },
            {
              num: cms.pillars.item3_num,
              title: cms.pillars.item3_title,
              desc: cms.pillars.item3_desc
            }
          ].map((serv, index) => (
            <div 
              key={index}
              className="service-card"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                padding: '50px 35px',
                textAlign: 'left',
                position: 'relative',
              }}
            >
              <div 
                style={{
                  fontFamily: "var(--serif)",
                  fontSize: '40px',
                  fontStyle: 'italic',
                  fontWeight: 300,
                  color: 'rgba(189, 160, 120, 0.15)',
                  marginBottom: '20px',
                }}
              >
                {serv.num}
              </div>
              <h3 
                style={{
                  fontFamily: "var(--serif)",
                  fontSize: '24px',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                  marginBottom: '15px',
                }}
              >
                {serv.title}
              </h3>
              <p 
                style={{
                  fontSize: '14px',
                  lineHeight: '1.7',
                  color: 'var(--text-secondary)',
                  margin: 0,
                  fontFamily: 'var(--sans)',
                }}
              >
                {serv.desc}
              </p>
            </div>
          ))}
        </div>
        
        <div style={{ marginTop: '65px' }}>
          <Link 
            to="/services"
            data-cursor="explore"
            className="btn-formal-double"
            style={{
              padding: '16px 36px',
              backgroundColor: 'var(--accent-gold)',
              color: 'var(--bg-primary)',
              textDecoration: 'none',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '2px',
              display: 'inline-block',
            }}
          >
            Explore Stay Packages
          </Link>
        </div>
      </section>

      {/* Platform Ratings / Trust Section */}
      <section 
        style={{
          padding: '100px 10%',
          backgroundColor: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-formal)',
          borderBottom: '1px solid var(--border-formal)',
          position: 'relative',
          zIndex: 3,
          textAlign: 'center'
        }}
      >
        <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '3px', color: 'var(--accent-gold)', display: 'block', marginBottom: '15px', fontFamily: 'var(--sans)' }}>
          {cms.ratings?.tag || fallbackHome.ratings.tag}
        </span>
        <h2 
          style={{
            fontFamily: "var(--serif)",
            fontSize: '40px',
            fontWeight: 400,
            color: 'var(--text-primary)',
            textTransform: 'uppercase',
            marginBottom: '60px',
            letterSpacing: '1px',
          }}
        >
          {((cms.ratings?.title || fallbackHome.ratings.title).split(' ').slice(0, -1).join(' ') || "Join the")} <span style={{ fontStyle: 'italic', color: 'var(--accent-gold)' }}>{((cms.ratings?.title || fallbackHome.ratings.title).split(' ').slice(-1)[0] || "Conversation")}</span>
        </h2>

        {/* 4-Column Ratings Grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '30px',
            maxWidth: '1200px',
            margin: '0 auto'
          }}
        >
          {/* Card 1: MakeMyTrip */}
          <div 
            className="ratings-card"
            style={{
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-formal)',
              padding: '40px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease',
              position: 'relative',
              cursor: 'pointer'
            }}
          >
            {/* Logo Representation */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginBottom: '25px', height: '36px' }}>
              <span style={{ color: '#0d47a1', fontWeight: 800, fontSize: '18px', fontFamily: 'var(--sans)' }}>make</span>
              <div style={{ backgroundColor: '#e53935', color: '#fff', borderRadius: '6px', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontStyle: 'italic', fontSize: '16px', fontFamily: 'var(--serif)' }}>my</div>
              <span style={{ color: '#0d47a1', fontWeight: 800, fontSize: '18px', fontFamily: 'var(--sans)' }}>trip</span>
            </div>
            
            {/* Score */}
            <div style={{ fontSize: '26px', fontFamily: 'var(--serif)', color: 'var(--accent-gold)', marginBottom: '8px', fontWeight: 500 }}>
              {cms.ratings?.platform1_score || fallbackHome.ratings.platform1_score}
            </div>
            {/* Text */}
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontFamily: 'var(--sans)', letterSpacing: '0.5px' }}>
              "{cms.ratings?.platform1_text || fallbackHome.ratings.platform1_text}"
            </div>
          </div>

          {/* Card 2: Agoda */}
          <div 
            className="ratings-card"
            style={{
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-formal)',
              padding: '40px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease',
              position: 'relative',
              cursor: 'pointer'
            }}
          >
            {/* Logo Representation */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', marginBottom: '25px', height: '36px' }}>
              <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '22px', fontFamily: 'var(--sans)', letterSpacing: '-0.5px', lineHeight: 1 }}>agoda</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ff3b30' }} />
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ffcc00' }} />
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#34c759' }} />
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#af52de' }} />
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#007aff' }} />
              </div>
            </div>
            
            {/* Score */}
            <div style={{ fontSize: '26px', fontFamily: 'var(--serif)', color: 'var(--accent-gold)', marginBottom: '8px', fontWeight: 500 }}>
              {cms.ratings?.platform2_score || fallbackHome.ratings.platform2_score}
            </div>
            {/* Text */}
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontFamily: 'var(--sans)', letterSpacing: '0.5px' }}>
              "{cms.ratings?.platform2_text || fallbackHome.ratings.platform2_text}"
            </div>
          </div>

          {/* Card 3: Booking.com */}
          <div 
            className="ratings-card"
            style={{
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-formal)',
              padding: '40px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease',
              position: 'relative',
              cursor: 'pointer'
            }}
          >
            {/* Logo Representation */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '25px', height: '36px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '22px', height: '22px', backgroundColor: '#003580', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', fontWeight: 'bold', fontSize: '13px', fontFamily: 'var(--sans)' }}>B.</div>
                <span style={{ color: '#fff', fontWeight: 800, fontSize: '15px', fontFamily: 'var(--sans)', letterSpacing: '-0.2px' }}>Booking.com</span>
              </div>
            </div>
            
            {/* Score */}
            <div style={{ fontSize: '26px', fontFamily: 'var(--serif)', color: 'var(--accent-gold)', marginBottom: '8px', fontWeight: 500 }}>
              {cms.ratings?.platform3_score || fallbackHome.ratings.platform3_score}
            </div>
            {/* Text */}
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontFamily: 'var(--sans)', letterSpacing: '0.5px' }}>
              "{cms.ratings?.platform3_text || fallbackHome.ratings.platform3_text}"
            </div>
          </div>

          {/* Card 4: Google */}
          <div 
            className="ratings-card"
            style={{
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-formal)',
              padding: '40px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease',
              position: 'relative',
              cursor: 'pointer'
            }}
          >
            {/* Logo Representation */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '25px', height: '36px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: '18px', fontFamily: 'var(--sans)' }}>Google</span>
            </div>
            
            {/* Score */}
            <div style={{ fontSize: '26px', fontFamily: 'var(--serif)', color: 'var(--accent-gold)', marginBottom: '8px', fontWeight: 500 }}>
              {cms.ratings?.platform4_score || fallbackHome.ratings.platform4_score}
            </div>
            {/* Text */}
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontFamily: 'var(--sans)', letterSpacing: '0.5px' }}>
              {cms.ratings?.platform4_text || fallbackHome.ratings.platform4_text}
            </div>
          </div>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          .ratings-card:hover {
            transform: translateY(-5px);
            border-color: var(--accent-gold) !important;
            box-shadow: 0 10px 30px rgba(189, 160, 120, 0.08);
          }
        `}} />
      </section>

      {/* Lightbox details overlay (Popup case study) */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(5, 5, 5, 0.96)',
              zIndex: 2000,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: (isMobile || isTablet) ? '12px' : '40px',
              backdropFilter: 'blur(15px)',
            }}
          >
            {/* Fixed Close Button outside scrolling box */}
            <button
              onClick={() => setSelectedProject(null)}
              data-cursor="close"
              style={{
                position: 'absolute',
                top: (isMobile || isTablet) ? '12px' : '30px',
                right: (isMobile || isTablet) ? '12px' : '30px',
                backgroundColor: 'var(--glass-bg)',
                border: '1px solid var(--border-formal)',
                color: 'var(--text-primary)',
                width: '45px',
                height: '45px',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                zIndex: 2010,
              }}
            >
              <X size={18} />
            </button>

            <motion.div
              initial={{ y: 50, scale: 0.97 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 50, scale: 0.97 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-formal)',
                width: '100%',
                maxWidth: '1100px',
                height: (isMobile || isTablet) ? '90vh' : '85vh',
                overflowY: 'auto',
                position: 'relative',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
              }}
              className="lightbox-content-grid"
              data-lenis-prevent
            >
              {/* Left Side Details */}
              <div style={{ padding: (isMobile || isTablet) ? '35px 20px' : '60px 50px', display: 'flex', flexDirection: 'column', justifyContent: (isMobile || isTablet) ? 'flex-start' : 'center', position: 'relative', overflow: (isMobile || isTablet) ? 'visible' : 'hidden' }}>
                <CanvasParticles preset="stars" count={35} zIndex={1} />
                
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2.5px', color: 'var(--accent-gold)', marginBottom: '15px', display: 'block', fontFamily: 'var(--sans)' }}>
                    {selectedProject.category} sanctuary
                  </span>
                  <h2 
                    style={{
                      fontFamily: "var(--serif)",
                      fontSize: '36px',
                      fontWeight: 400,
                      textTransform: 'uppercase',
                      color: 'var(--text-primary)',
                      margin: '0 0 25px 0',
                    }}
                  >
                    {selectedProject.title}
                  </h2>

                  <p style={{ fontSize: '14px', lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '40px', fontFamily: 'var(--sans)' }}>
                    {selectedProject.description || selectedProject.desc}
                  </p>

                  {/* Spec grid */}
                  <div 
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                      gap: '20px',
                      borderTop: '1px solid var(--border-formal)',
                      paddingTop: '30px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <MapPin size={18} color="var(--accent-gold)" />
                      <div>
                        <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontFamily: 'var(--sans)' }}>Location</div>
                        <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500, fontFamily: 'var(--sans)' }}>{selectedProject.location}</div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Compass size={18} color="var(--accent-gold)" />
                      <div>
                        <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontFamily: 'var(--sans)' }}>Capacity</div>
                        <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500, fontFamily: 'var(--sans)' }}>{selectedProject.specs.guests}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Calendar size={18} color="var(--accent-gold)" />
                      <div>
                        <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontFamily: 'var(--sans)' }}>Space Dimensions</div>
                        <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500, fontFamily: 'var(--sans)' }}>{selectedProject.specs.space}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Star size={18} color="var(--accent-gold)" />
                      <div>
                        <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontFamily: 'var(--sans)' }}>Premium View</div>
                        <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500, fontFamily: 'var(--sans)' }}>{selectedProject.specs.view}</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '40px' }}>
                    <button
                      onClick={() => {
                        setSelectedProject(null);
                        navigate('/contact');
                      }}
                      className="btn-formal-double"
                      style={{ padding: '14px 28px', fontSize: '10px' }}
                    >
                      Reserve This Room
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Side Image Scroll */}
              <div 
                style={{
                  padding: '30px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  overflowY: 'auto',
                  height: '100%',
                }}
                className="lightbox-image-scroll"
                data-lenis-prevent
              >
                {selectedProject.gallery.map((imgUrl, i) => (
                  <img
                    key={i}
                    src={imgUrl}
                    alt={`${selectedProject.title} detail ${i}`}
                    style={{
                      width: '100%',
                      height: 'auto',
                      objectFit: 'cover',
                      border: '1px solid var(--border-formal)',
                    }}
                    loading="lazy"
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import PageTransition from '../components/PageTransition';
import TickerBanner from '../components/TickerBanner';
import CanvasParticles from '../components/CanvasParticles';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, Compass, Star, CheckCircle } from 'lucide-react';
import { useCMSContent, useSettings } from '../hooks/useCMS';

gsap.registerPlugin(ScrollTrigger);

const fallbackAbout = {
  heritage: {
    tag: 'OUR HERITAGE // L\'HISTOIRE',
    title: 'Curators of Heritage Luxury',
    p1: 'Aura Cove Resort & Spa was conceptualized with a single mission: to conserve Kerala’s heritage architecture and traditional Ayurvedic healing arts while delivering high-fidelity modern luxury.',
    p2: 'Rebuilt over five years using centuries-old teakwood and clay tiles salvaged from historic Tharavadus (traditional homesteads), our property stands as an architectural museum. Combined with doctor-led holistic therapies and lake cruises, Aura Cove offers a sensory retreat like no other.',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop'
  },
  timeline_header: {
    tag: 'THE JOURNEY // TIMELINE',
    title: 'The Sanctuary Journey',
    desc: 'Scroll vertically to see the sequential process we execute to provide a relaxing and memorable stay experience.'
  },
  step1: {
    num: '01',
    stage: 'Prior to Arrival',
    title: 'stay customization',
    desc: 'Stays at Aura Cove are entirely bespoke. We connect with you prior to arrival to design your room setup, Ayurvedic treatment plan, special meals, and pier transfers.'
  },
  step2: {
    num: '02',
    stage: 'Sanctuary Arrival',
    title: 'pier greeting',
    desc: 'Gliding along Vembanad Lake, check-in begins at our private pier. Sip fresh organic coconut water as your personal sanctuary host guides you to your villa.'
  },
  step3: {
    num: '03',
    stage: 'Lakeside Residence',
    title: 'sensory rejuvenation',
    desc: 'Immerse yourself daily in personalized spa schedules, lakeside yoga sessions, local fish specialties, and sunset houseboat sailing.'
  },
  step4: {
    num: '04',
    stage: 'Departing Sanctuary',
    title: 'mindful check-out',
    desc: 'Depart fully restored. Receive a traditional farewell pier blessing, custom ayurvedic home-care remedies, and a luxury road transfer back to Kochi.'
  }
};

export default function About() {
  const containerRef = useRef(null);
  const scrollSectionRef = useRef(null);
  const narrativeRef = useRef(null);
  const textRevealRef = useRef(null);
  const imageWrapperRef = useRef(null);
  
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  const { content: cms } = useCMSContent('about', fallbackAbout);
  const { settings } = useSettings({
    about_marquee: 'Condé Nast Traveler Gold List, Architectural Digest Highlights, Heritage Design Conservation Award, Top Luxury Resorts Asia'
  });

  const aboutMarqueeItems = (settings.about_marquee || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  // Monitor screen width for mobile/tablet optimization
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Horizontal Scroll for guest journey section (desktop only)
  useEffect(() => {
    if (isMobile || isTablet) return;

    const section = scrollSectionRef.current;
    const container = containerRef.current;
    if (!section || !container) return;

    const pin = gsap.to(section, {
      x: () => -(section.scrollWidth - window.innerWidth),
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        pin: true,
        scrub: 1,
        start: 'top top',
        end: () => `+=${section.scrollWidth - window.innerWidth}`,
        invalidateOnRefresh: true,
      }
    });

    return () => {
      pin.scrollTrigger?.kill();
    };
  }, [isMobile]);

  // Aligned Unique Scrolling Animations for Heritage Page
  useEffect(() => {
    // 1. Text sequential fade reveal on scroll
    if (textRevealRef.current) {
      const paragraphs = textRevealRef.current.querySelectorAll('p');
      gsap.fromTo(paragraphs,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.25,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: narrativeRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    // 2. 3D Perspective tilt image scroll animation
    if (imageWrapperRef.current && !isMobile) {
      const card = imageWrapperRef.current.querySelector('.about-image-card');
      const frame = imageWrapperRef.current.querySelector('.about-image-bg-frame');
      
      gsap.fromTo(card,
        { rotationY: -15, rotationX: 10, transformPerspective: 1000 },
        {
          rotationY: 15,
          rotationX: -10,
          ease: 'none',
          scrollTrigger: {
            trigger: narrativeRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        }
      );

      gsap.fromTo(frame,
        { rotationY: -5, rotationX: 5, x: 25, y: 25, transformPerspective: 1000 },
        {
          rotationY: 5,
          rotationX: -5,
          x: -25,
          y: -25,
          ease: 'none',
          scrollTrigger: {
            trigger: narrativeRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [isMobile]);

  const blueprintSteps = [
    {
      num: cms.step1.num,
      icon: <Compass size={28} color="var(--accent-gold)" />,
      stage: cms.step1.stage,
      title: cms.step1.title,
      desc: cms.step1.desc
    },
    {
      num: cms.step2.num,
      icon: <Star size={28} color="var(--accent-gold)" />,
      stage: cms.step2.stage,
      title: cms.step2.title,
      desc: cms.step2.desc
    },
    {
      num: cms.step3.num,
      icon: <Calendar size={28} color="var(--accent-gold)" />,
      stage: cms.step3.stage,
      title: cms.step3.title,
      desc: cms.step3.desc
    },
    {
      num: cms.step4.num,
      icon: <CheckCircle size={28} color="var(--accent-gold)" />,
      stage: cms.step4.stage,
      title: cms.step4.title,
      desc: cms.step4.desc
    }
  ];

  return (
    <PageTransition>
      {/* Narrative Section */}
      <section 
        ref={narrativeRef}
        style={{
          padding: '160px 10% 100px',
          backgroundColor: 'var(--bg-primary)',
          color: 'var(--text-primary)',
          position: 'relative',
          zIndex: 3,
          overflow: 'hidden'
        }}
      >
        <CanvasParticles preset="stars" count={45} zIndex={1} />

        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '80px',
            alignItems: 'center',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <div ref={textRevealRef}>
            <span className="catalog-tag">{cms.heritage.tag}</span>
            
            <h1 
              style={{
                fontFamily: "var(--serif)",
                fontSize: '44px',
                fontWeight: 400,
                lineHeight: '1.2',
                color: 'var(--text-primary)',
                textTransform: 'uppercase',
                margin: '0 0 25px 0',
              }}
            >
              {cms.heritage.title.includes('Heritage') ? (
                <>
                  {cms.heritage.title.substring(0, cms.heritage.title.indexOf('Heritage'))}
                  <span style={{ fontStyle: 'italic', color: 'var(--accent-gold)' }}>Heritage Luxury</span>
                </>
              ) : (
                cms.heritage.title
              )}
            </h1>
            
            <p style={{ fontSize: '14px', lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '20px', fontFamily: 'var(--sans)' }}>
              {cms.heritage.p1}
            </p>
            
            <p style={{ fontSize: '14px', lineHeight: '1.8', color: 'var(--text-secondary)', fontFamily: 'var(--sans)' }}>
              {cms.heritage.p2}
            </p>
          </div>

          <div ref={imageWrapperRef} className="about-image-wrapper">
            <div className="about-image-bg-frame" />
            <div className="about-image-card">
              <img 
                src={cms.heritage.image}
                alt="Heritage resort backwater view"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Guest stay chronology timeline */}
      <div 
        ref={containerRef}
        style={{
          overflow: 'hidden',
          backgroundColor: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-formal)',
          borderBottom: '1px solid var(--border-formal)',
          position: 'relative',
          zIndex: 3,
        }}
      >
        {(isMobile || isTablet) ? (
          <div style={{ padding: (isMobile || isTablet) ? '60px 5% 50px' : '80px 5% 60px' }}>
            <span className="catalog-tag">{cms.timeline_header.tag}</span>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: (isMobile || isTablet) ? '28px' : '36px', textTransform: 'uppercase', marginBottom: '40px' }}>
              {cms.timeline_header.title.split(' ').slice(0, -1).join(' ')} <span style={{ fontStyle: 'italic', color: 'var(--accent-gold)' }}>{cms.timeline_header.title.split(' ').slice(-1)[0]}</span>
            </h2>
            
            <div className="mobile-swipe-wrap">
              {blueprintSteps.map((step, idx) => (
                <div 
                  key={idx} 
                  className="mobile-swipe-card layered-container"
                  style={{
                    width: isTablet ? '45vw' : '80vw',
                    height: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ position: 'absolute', top: '25px', right: '35px', fontFamily: 'var(--serif)', fontSize: '50px', fontStyle: 'italic', color: 'rgba(189, 160, 120, 0.08)' }}>
                    {step.num}
                  </div>
                  <div>
                    <div style={{ marginBottom: '15px' }}>{step.icon}</div>
                    <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--accent-gold)', display: 'block', marginBottom: '8px' }}>
                      {step.stage}
                    </span>
                    <h3 style={{ fontFamily: 'var(--serif)', fontSize: '24px', margin: '0 0 15px 0', textTransform: 'uppercase' }}>{step.title}</h3>
                  </div>
                  <p style={{ fontSize: '13px', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
                    {step.desc}
                  </p>
                </div>
              ))}
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
            <div style={{ width: '580px', flexShrink: 0, paddingRight: '120px' }}>
              <span className="catalog-tag">{cms.timeline_header.tag}</span>
              <h2 
                style={{
                  fontFamily: "var(--serif)",
                  fontSize: '48px',
                  fontWeight: 400,
                  lineHeight: '1.25',
                  color: 'var(--text-primary)',
                  margin: '0 0 20px 0',
                  textTransform: 'uppercase',
                }}
              >
                {cms.timeline_header.title.split(' ').slice(0, -1).join(' ')}<br />
                <span style={{ fontStyle: 'italic', color: 'var(--accent-gold)' }}>{cms.timeline_header.title.split(' ').slice(-1)[0]}</span>
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.7', fontFamily: 'var(--sans)' }}>
                {cms.timeline_header.desc}
              </p>
            </div>

            {/* Steps */}
            {blueprintSteps.map((step, idx) => (
              <div 
                key={idx}
                style={{
                  width: '75vw',
                  maxWidth: '650px',
                  flexShrink: 0,
                  paddingRight: '100px',
                }}
              >
                <div 
                  className="layered-container"
                  style={{
                    padding: '50px 40px',
                    height: '420px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div 
                    style={{
                      position: 'absolute',
                      top: '25px',
                      right: '35px',
                      fontFamily: "var(--serif)",
                      fontSize: '60px',
                      fontStyle: 'italic',
                      fontWeight: 300,
                      color: 'rgba(189, 160, 120, 0.08)',
                    }}
                  >
                    {step.num}
                  </div>

                  <div>
                    <div style={{ marginBottom: '20px' }}>{step.icon}</div>
                    <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--accent-gold)', fontFamily: 'var(--sans)' }}>
                      {step.stage}
                    </span>
                    <h3 
                      style={{
                        fontFamily: "var(--serif)",
                        fontSize: '28px',
                        fontWeight: 500,
                        margin: '10px 0 20px 0',
                        color: 'var(--text-primary)',
                        textTransform: 'uppercase',
                      }}
                    >
                      {step.title}
                    </h3>
                  </div>

                  <p style={{ fontSize: '14px', lineHeight: '1.8', color: 'var(--text-secondary)', margin: '0', fontFamily: 'var(--sans)' }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <TickerBanner items={aboutMarqueeItems} />
    </PageTransition>
  );
}

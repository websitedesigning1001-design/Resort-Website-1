import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PageTransition from '../components/PageTransition';
import CanvasParticles from '../components/CanvasParticles';
import { Compass, Gift, Activity, Sunset, MapPin, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

import { useCMSContent } from '../hooks/useCMS';

const RESORT_EXPERIENCES = [
  {
    id: 1,
    num: '01',
    title: 'Ayurveda Sanctuary Retreat',
    coords: 'THERAPY • 9.5931° N',
    image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=1200&auto=format&fit=crop',
    subtitle: 'Restoring physiological alignment through ancient wisdom.',
    desc1: 'The Ayurveda Sanctuary at Aura Cove is a quiet zone dedicated to natural restoration. Supervised by resident Ayurvedic physicians, we curate personalized Panchakarma and rejuvenation programs designed around your specific dosha blueprint.',
    desc2: 'Every therapy utilizes organic medicated oils and herbal extracts prepared in-house using traditional processes. Experience synchronized four-hand massages, herb-infused steam wraps, and peaceful relaxation in wooden pavilions facing quiet gardens.',
    bullets: [
      'Diagnostic consultations with Ayurvedic physicians',
      'Customized herbal oil treatments and massage schedules',
      'Silent therapy wings situated amidst medicinal gardens',
      'Daily wellness health tracking and post-stay remedies'
    ]
  },
  {
    id: 2,
    num: '02',
    title: 'Vembanad Sunset Cruises',
    coords: 'NAVIGATION • VEMBANAD',
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=1200&auto=format&fit=crop',
    subtitle: 'Glide across silent waterways on a historic rice barge.',
    desc1: 'Discover the heart of Kerala’s backwaters. Our private luxury houseboats (Kettuvallams) are crafted using ancient methods—hand-tied coir ropes and bamboo arches—offering contemporary suites with private sailing decks.',
    desc2: 'Sail past quiet canal villages, vast paddy fields, and coconut groves as the sun dips below the lake. A private chef prepares traditional delicacies on board, providing a floating dining experience with butler service.',
    bullets: [
      'Bespoke sunset cruises and overnight lake journeys',
      'Dedicated private butler and on-board culinary chef',
      'Luxury air-conditioned bedroom suites with glass views',
      'Traditional hand-crafted wooden skiff tours of narrow canals'
    ]
  },
  {
    id: 3,
    num: '03',
    title: 'Heritage Lakefront Gastronomy',
    coords: 'CULINARY • LOCAL ART',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop',
    subtitle: 'Clay-pot cooking methods meeting contemporary culinary standards.',
    desc1: 'Dining at Aura Cove is an exploration of local culture. Our open-air lakeside restaurant showcases traditional clay-pot slow cooking and wood-fire grilling, utilizing fresh ingredients sourced daily from the backwaters and our organic resort garden.',
    desc2: 'Savor authentic banana-leaf Sadhyas, slow-cooked pearl spot (Karimeen Pollichathu), and locally infused spices. Every tablescape is designed with brass oil lamps and hand-woven details, providing a rich sensory experience.',
    bullets: [
      'Authentic slow-cooked heritage recipes and seafood grills',
      'Organic ingredients harvested from our resort garden',
      'Lakeside tablescapes overlooking the water docks',
      'Private traditional culinary classes with our master chef'
    ]
  },
  {
    id: 4,
    num: '04',
    title: 'Sunrise Yoga & Meditation',
    coords: 'MINDFULNESS • WATERDECK',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop',
    subtitle: 'Awaken the senses on quiet waterfront decks.',
    desc1: 'Start your mornings in absolute silence. Guided by certified instructors, our sunrise yoga and pranayama breathing sessions are hosted on wooden decks floating at the water’s edge, where the lake mist meets the early sun.',
    desc2: 'We tailor practices to all experience levels, focusing on gentle alignment, breath awareness, and sound-based meditation. Restore mental clarity and align your bio-rhythms with the calming sounds of lapping backwater waves.',
    bullets: [
      'Sunrise pranayama and guided alignment sessions',
      'Floating wooden yoga deck with 360-degree lake views',
      'Intimate group sizes to ensure personalized instruction',
      'Sound baths and mindfulness meditation at dusk'
    ]
  },
  {
    id: 5,
    num: '05',
    title: 'Private Pier Candlelight Dining',
    coords: 'BESPOKE • WATERFRONT',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200&auto=format&fit=crop',
    subtitle: 'Bespoke tablescapes crafted on a private lake pier.',
    desc1: 'For celebrations that demand absolute intimacy, we coordinate private candlelight dining on our wooden pier. Extending over Vembanad Lake, the setting is decorated with white jasmines, antique oil lamps, and soft hanging glass lanterns.',
    desc2: 'Savor a custom 5-course menu designed specifically for you by our master chef, paired with signature beverages. A classical sitar or flute player performs softly in the background, creating an unforgettable sensory memory.',
    bullets: [
      'Private 5-course tailored menu with personal chef',
      'Exclusive layout on our water pier under the stars',
      'Bespoke floral design, candle setups, and lantern styling',
      'Live classical sitar or flute accompaniment'
    ]
  },
  {
    id: 6,
    num: '06',
    title: 'Naturalist Bird Sanctuary Tours',
    coords: 'EXPLORE • CANALS',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200&auto=format&fit=crop',
    subtitle: 'Explore tropical wetlands and local bird sanctuaries.',
    desc1: 'Bordering the Kumarakom Bird Sanctuary, Aura Cove is a habitat for rare migratory birds. Our resident naturalist guides you through canal walkways and marshy mangrove pathways to observe local fauna.',
    desc2: 'Navigate the quiet bird sanctuary borders at sunrise in a wooden canoe, listening to bird calls and observing nesting spots. Learn about the delicate backwater ecosystem and conservation efforts protecting Kumarakom’s wetlands.',
    bullets: [
      'Guided sunrise tours led by our resident naturalist',
      'Traditional wooden canoe tours of marshy bird habitats',
      'Observe Siberian cranes, herons, and rare waterbirds',
      'Botanical hikes highlighting native spice trees and plants'
    ]
  }
];

const fallbackServices = {
  header: {
    tag: 'SANCTUARY EXPERIENCES // ACTIVITIES',
    title: 'The Rituals of Aura Cove',
    subtitle: 'Explore our curated series of slow-living experiences designed around local backwater traditions.'
  }
};

export default function Services() {
  const scrollContainerRef = useRef(null);
  const experienceRefs = useRef([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [experiences, setExperiences] = useState([]);

  const { content: cms } = useCMSContent('services', fallbackServices);

  useEffect(() => {
    fetch('/api/services')
      .then(res => {
        if (!res.ok) throw new Error('API error');
        return res.json();
      })
      .then(data => {
        const visible = data.filter(item => item.is_visible === 1);
        setExperiences(visible.length > 0 ? visible : RESORT_EXPERIENCES);
      })
      .catch(err => {
        console.warn('Failed to load services, using fallback.', err);
        setExperiences(RESORT_EXPERIENCES);
      });
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

  // Aligned GSAP Parallax & Fade Scroll animations for each section
  useEffect(() => {
    const sections = experienceRefs.current;
    
    sections.forEach((section, index) => {
      if (!section) return;

      const imgWrapper = section.querySelector('.parallax-img-wrapper');
      const img = section.querySelector('.parallax-img');
      const textBlock = section.querySelector('.text-reveal-block');
      
      const isOdd = index % 2 === 0;

      // 1. Image parallax scrolling animation (scrolling at different speeds)
      if (imgWrapper && img) {
        gsap.fromTo(img, 
          { yPercent: isOdd ? -15 : 15 },
          {
            yPercent: isOdd ? 15 : -15,
            ease: 'none',
            scrollTrigger: {
              trigger: imgWrapper,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true
            }
          }
        );
      }

      // 2. Text fade-and-shift animation on scroll
      if (textBlock) {
        const isTouch = isMobile || isTablet;
        gsap.fromTo(textBlock,
          { 
            opacity: 0, 
            x: isTouch ? 0 : (isOdd ? -50 : 50),
            y: 20
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 75%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }
    });

    // Clean up scroll triggers
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [experiences, isMobile, isTablet]);

  return (
    <PageTransition>
      <section 
        ref={scrollContainerRef}
        style={{
          padding: '160px 0 100px',
          backgroundColor: 'var(--bg-primary)',
          color: 'var(--text-primary)',
          position: 'relative',
          overflow: 'hidden',
          zIndex: 3,
        }}
      >
        <CanvasParticles preset="stars" count={40} opacityMax={0.35} zIndex={1} />
        
        {/* Title Block with subtle letter-reveal on scroll */}
        <div style={{ padding: isMobile ? '0 5%' : '0 10%', textAlign: 'center', marginBottom: isMobile ? '60px' : '140px', position: 'relative', zIndex: 2 }}>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '3px', color: 'var(--accent-gold)', display: 'block', marginBottom: '15px', fontFamily: 'var(--sans)' }}>
            {cms.header.tag}
          </span>
          <h1 
            style={{
              fontFamily: "var(--serif)",
              fontSize: 'clamp(36px, 5.5vw, 64px)',
              fontWeight: 400,
              textTransform: 'uppercase',
              margin: '0',
              lineHeight: '1.2',
            }}
          >
            {cms.header.title.includes('Aura Cove') ? (
              <>
                {cms.header.title.substring(0, cms.header.title.indexOf('Aura Cove'))}
                <span style={{ fontStyle: 'italic', color: 'var(--accent-gold)' }}>Aura Cove</span>
                {cms.header.title.substring(cms.header.title.indexOf('Aura Cove') + 9)}
              </>
            ) : cms.header.title.includes('Unforgettable') ? (
              <>
                {cms.header.title.substring(0, cms.header.title.indexOf('Unforgettable'))}
                <span style={{ fontStyle: 'italic', color: 'var(--accent-gold)' }}>Unforgettable</span>
                {cms.header.title.substring(cms.header.title.indexOf('Unforgettable') + 13)}
              </>
            ) : (
              cms.header.title
            )}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '650px', margin: '20px auto 0', lineHeight: '1.8', fontFamily: 'var(--sans)' }}>
            {cms.header.subtitle}
          </p>
        </div>

        {/* Detailed Staggered Asymmetrical Showcase with Parallax */}
        <div style={{ width: '100%' }}>
          {experiences.map((exp, idx) => {
            const isOdd = idx % 2 === 0;
            return (
              <div
                key={exp.id}
                ref={el => experienceRefs.current[idx] = el}
                style={{
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : (isOdd ? 'row' : 'row-reverse'),
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: isMobile ? '0 5%' : '0 10%',
                  // Non-sticktogether spacing layout (huge breathing gap between experiences)
                  marginBottom: isMobile ? '80px' : '180px',
                  position: 'relative',
                  zIndex: 2,
                  flexWrap: 'wrap',
                  gap: isMobile ? '30px' : '60px'
                }}
              >
                {/* Image Panel with Parallax Container */}
                <div 
                  className="parallax-img-wrapper"
                  style={{
                    flex: isMobile ? 'none' : '1 1 320px',
                    width: isMobile ? '100%' : 'auto',
                    height: isMobile ? '250px' : '520px',
                    position: 'relative',
                    overflow: 'hidden',
                    border: '1px solid var(--border-formal)',
                    padding: '5px'
                  }}
                >
                  <img 
                    className="parallax-img"
                    src={exp.image_url || exp.image} 
                    alt={exp.name || exp.title} 
                    style={{
                      width: '100%',
                      height: '130%', // extra height to absorb parallax shifts without gaps
                      objectFit: 'cover',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      left: 0
                    }}
                    loading="lazy"
                  />
                  {/* Overlay Coordinates */}
                  <div 
                    style={{
                      position: 'absolute',
                      bottom: '20px',
                      left: isOdd ? 'auto' : '20px',
                      right: isOdd ? '20px' : 'auto',
                      backgroundColor: 'var(--glass-bg)',
                      border: '1px solid var(--glass-border)',
                      padding: '8px 16px',
                      fontFamily: 'var(--sans)',
                      fontSize: '9px',
                      letterSpacing: '1.5px',
                      color: 'var(--accent-gold)',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      zIndex: 3
                    }}
                  >
                    {exp.coords || ''}
                  </div>
                </div>

                {/* Detailed Text Panel */}
                <div 
                  className="text-reveal-block"
                  style={{
                    flex: isMobile ? 'none' : '1 1 320px',
                    width: isMobile ? '100%' : 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: isMobile ? '0' : (isOdd ? '0 0 0 40px' : '0 40px 0 0')
                  }}
                >
                  <span 
                    style={{
                      fontFamily: 'var(--serif)',
                      fontSize: '48px',
                      fontStyle: 'italic',
                      fontWeight: 300,
                      color: 'rgba(189, 160, 120, 0.15)',
                      display: 'block',
                      marginBottom: '10px'
                    }}
                  >
                    {exp.num}
                  </span>
                  
                  <h2 
                    style={{
                      fontFamily: 'var(--serif)',
                      fontSize: '34px',
                      fontWeight: 400,
                      textTransform: 'uppercase',
                      color: 'var(--text-primary)',
                      marginBottom: '15px',
                      letterSpacing: '1px'
                    }}
                  >
                    {exp.name || exp.title}
                  </h2>

                  <p 
                    style={{
                      fontFamily: 'var(--serif)',
                      fontSize: '18px',
                      lineHeight: '1.4',
                      color: 'var(--accent-gold)',
                      fontStyle: 'italic',
                      marginBottom: '20px'
                    }}
                  >
                    {exp.subtitle || ''}
                  </p>

                  <p 
                    style={{
                      fontFamily: 'var(--sans)',
                      fontSize: '14px',
                      lineHeight: '1.8',
                      color: 'var(--text-secondary)',
                      marginBottom: '15px'
                    }}
                  >
                    {exp.description || exp.desc1}
                  </p>

                  <p 
                    style={{
                      fontFamily: 'var(--sans)',
                      fontSize: '14px',
                      lineHeight: '1.8',
                      color: 'var(--text-secondary)',
                      marginBottom: '25px'
                    }}
                  >
                    {exp.scope || exp.desc2}
                  </p>

                  {/* Bulleted Experience Details */}
                  <div 
                    style={{
                      borderTop: '1px solid var(--border-formal)',
                      paddingTop: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}
                  >
                    {(exp.features || exp.bullets || []).map((b, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <span style={{ color: 'var(--accent-gold)', fontSize: '14px', marginTop: '-2px' }}>•</span>
                        <span style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.4' }}>
                          {b}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Replaced Estimate tool with beautiful Consultation Booking Section */}
        <div style={{ padding: isMobile ? '0 5%' : '0 10%', marginTop: isMobile ? '40px' : '60px' }}>
          <div 
            className="layered-container"
            style={{
              padding: isMobile ? '30px 20px' : '60px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-formal)',
              textAlign: 'center',
              maxWidth: '900px',
              margin: '0 auto',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <CanvasParticles preset="embers" count={30} opacityMax={0.4} zIndex={1} />
            
            <div style={{ position: 'relative', zIndex: 2 }}>
              <span 
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '3px',
                  color: 'var(--accent-gold)',
                  display: 'inline-block',
                  marginBottom: '15px'
                }}
              >
                Plan Your Sanctuary Stay
              </span>
              <h2 
                style={{
                  fontFamily: 'var(--serif)',
                  fontSize: '36px',
                  fontWeight: 400,
                  textTransform: 'uppercase',
                  color: 'var(--text-primary)',
                  marginBottom: '20px',
                  letterSpacing: '1px'
                }}
              >
                Schedule a Private <span style={{ fontStyle: 'italic', color: 'var(--accent-gold)' }}>Consultation</span>
              </h2>
              <p 
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: '14px',
                  lineHeight: '1.8',
                  color: 'var(--text-secondary)',
                  maxWidth: '550px',
                  margin: '0 auto 35px',
                }}
              >
                All stays at Aura Cove Resort & Spa are personalized to protect sanctuary tranquility. Rates and availability are arranged privately through consultation with our reservation coordinators.
              </p>
              
              <Link 
                to="/contact"
                data-cursor="reserve"
                className="btn-formal-double"
              >
                Begin Booking Consultation
              </Link>
            </div>
          </div>
        </div>

      </section>
    </PageTransition>
  );
}

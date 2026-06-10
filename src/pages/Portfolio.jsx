import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PageTransition from '../components/PageTransition';
import CanvasParticles from '../components/CanvasParticles';
import { X, MapPin, Compass, Calendar, Star } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

import { useCMSContent } from '../hooks/useCMS';

const PORTFOLIO_ITEMS = [
  {
    id: 1,
    title: 'The Vembanad Pool Villa',
    category: 'villas',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1200&auto=format&fit=crop',
    location: 'Lakefront, Kumarakom',
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
    title: 'Lakeside Heritage Suite',
    category: 'suites',
    image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=1200&auto=format&fit=crop',
    location: 'Lakeside, Kumarakom',
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
    title: 'The Heritage Houseboat Suite',
    category: 'houseboats',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop',
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
    title: 'Garden Lily Pond Room',
    category: 'rooms',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1200&auto=format&fit=crop',
    location: 'Garden Sanctuary',
    coords: '9.5934° N, 76.4228° E',
    specs: { guests: '4 Guests', space: '1,400 sq ft', view: 'Lily Pond veranda' },
    desc: 'Encompassed by ancient mango trees and tropical flora. Features an outdoor jacuzzi, traditional Kerala wooden swing (Aattukattil) on the veranda, and direct views of a lotus-filled private lily pond.',
    gallery: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=600&auto=format&fit=crop'
    ]
  },
  {
    id: 5,
    title: 'Vembanad Presidential Villa',
    category: 'villas',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1200&auto=format&fit=crop',
    location: 'Lakefront, Kumarakom',
    coords: '9.5935° N, 76.4230° E',
    specs: { guests: '4 Guests', space: '2,400 sq ft', view: 'Private 15m Infinity Pool' },
    desc: 'Our largest sanctuary villa. Combines two traditional pavilions with a grand lakeside terrace, private pool, dining pavilion, and dedicated round-the-clock butler service.',
    gallery: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=600&auto=format&fit=crop'
    ]
  },
  {
    id: 6,
    title: 'Anjili Heritage Suite',
    category: 'suites',
    image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=1200&auto=format&fit=crop',
    location: 'Lakeside, Kumarakom',
    coords: '9.5933° N, 76.4227° E',
    specs: { guests: '2 Guests', space: '1,100 sq ft', view: 'Private Lake Deck' },
    desc: 'Constructed from Anjili (wild jackwood) logs, this suite features a high-pitched roof, brass details, an open-to-sky shower, and an expansive wooden deck that extends over the lake.',
    gallery: [
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=600&auto=format&fit=crop'
    ]
  }
];

const fallbackPortfolio = {
  header: {
    tag: 'ROOMS & SUITES // ACCOMMODATIONS',
    title: 'The Sanctuaries of Aura',
    subtitle: 'Explore our curated selection of heritage pool villas, lakeside suites, and private luxury houseboats providing absolute breathing room.'
  }
};

export default function Portfolio() {
  const [filter, setFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [portfolioItems, setPortfolioItems] = useState([]);
  const gridContainerRef = useRef(null);

  const { content: cms } = useCMSContent('portfolio', fallbackPortfolio);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => {
        if (!res.ok) throw new Error('API error');
        return res.json();
      })
      .then(data => {
        const visible = data.filter(item => item.is_visible === 1);
        setPortfolioItems(visible.length > 0 ? visible : PORTFOLIO_ITEMS);
      })
      .catch(err => {
        console.warn('Failed to load portfolio items from API, using fallback.', err);
        setPortfolioItems(PORTFOLIO_ITEMS);
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

  // Monitor screen width for mobile optimization
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Unique Staggered Scroll Parallax for Room Cards
  useEffect(() => {
    if (isMobile || isTablet) return;

    const cards = gsap.utils.toArray('.portfolio-card-item');
    cards.forEach((card, idx) => {
      // Columns speed layout factor
      const speed = idx % 3 === 0 ? 30 : idx % 3 === 1 ? -45 : -15;
      
      gsap.fromTo(card,
        { y: 0 },
        {
          y: speed,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [filter, isMobile]); // Re-run when filter changes because cards re-render

  const filteredItems = filter === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === filter);

  return (
    <PageTransition>
      <section 
        style={{
          padding: '160px 10% 100px',
          backgroundColor: 'var(--bg-primary)',
          minHeight: '100vh',
          color: 'var(--text-primary)',
          position: 'relative',
          zIndex: 3,
        }}
      >
        <CanvasParticles preset="stars" count={45} zIndex={1} opacityMax={0.4} />

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '60px', position: 'relative', zIndex: 2 }}>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '3px', color: 'var(--accent-gold)', display: 'block', marginBottom: '15px', fontFamily: 'var(--sans)' }}>
            {cms.header.tag}
          </span>
          <h1 
            style={{
              fontFamily: "var(--serif)",
              fontSize: '52px',
              fontWeight: 400,
              textTransform: 'uppercase',
              margin: '0',
            }}
          >
            {cms.header.title.includes('Aura') ? (
              <>
                {cms.header.title.substring(0, cms.header.title.indexOf('Aura'))}
                <span style={{ fontStyle: 'italic', color: 'var(--accent-gold)' }}>Aura</span>
                {cms.header.title.substring(cms.header.title.indexOf('Aura') + 4)}
              </>
            ) : (
              cms.header.title
            )}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '600px', margin: '15px auto 0', lineHeight: '1.7', fontFamily: 'var(--sans)' }}>
            {cms.header.subtitle}
          </p>
        </div>

        {/* Filters (Smooth luxury layout tabs) */}
        <div 
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            flexWrap: 'wrap',
            marginBottom: '80px',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {['all', 'villas', 'suites', 'houseboats', 'rooms'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              data-cursor="filter"
              style={{
                padding: '10px 24px',
                borderRadius: '0px',
                border: '1px solid',
                borderColor: filter === cat ? 'var(--accent-gold)' : 'var(--border-formal)',
                backgroundColor: filter === cat ? 'var(--accent-gold)' : 'transparent',
                color: filter === cat ? 'var(--bg-primary)' : 'var(--text-secondary)',
                fontFamily: "var(--sans)",
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dynamic Asymmetrical Editorial Grid with Scroll Animations */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={filter}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            ref={gridContainerRef}
            className="portfolio-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', 
              gap: '40px',
              alignItems: 'start',
              position: 'relative',
              zIndex: 2,
            }}
          >
            {filteredItems.map((project, idx) => (
              <div 
                key={project.id}
                onClick={() => setSelectedProject(project)}
                data-cursor="view details"
                className="portfolio-card-item"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  position: 'relative',
                  // Staggered offsets for asymmetrical layout
                  marginTop: !(isMobile || isTablet) && idx % 3 === 1 ? '50px' : !(isMobile || isTablet) && idx % 3 === 2 ? '25px' : '0px',
                  marginBottom: '20px',
                }}
              >
                <div 
                  className="portfolio-card-inner-parallax"
                  style={{ width: '100%', height: '100%' }}
                >
                  <div style={{ height: '280px', overflow: 'hidden', position: 'relative' }}>
                    <img 
                      src={project.image_url || project.image} 
                      alt={project.title}
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                      className="portfolio-img-zoom"
                    />

                    <div 
                      style={{
                        position: 'absolute',
                        top: '20px',
                        left: '20px',
                        backgroundColor: 'var(--glass-bg)',
                        border: '1px solid var(--glass-border)',
                        padding: '6px 14px',
                        fontSize: '9px',
                        textTransform: 'uppercase',
                        letterSpacing: '1.5px',
                        color: 'var(--accent-gold)',
                        fontFamily: 'var(--sans)',
                        fontWeight: 600,
                      }}
                    >
                      {project.category}
                    </div>
                  </div>

                  <div style={{ padding: '30px' }}>
                    <h3 style={{ fontFamily: "var(--serif)", fontSize: '22px', fontWeight: 500, margin: '0 0 12px 0', color: 'var(--text-primary)' }}>
                      {project.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'var(--sans)' }}>
                      <MapPin size={11} color="var(--accent-gold)" /> {project.location}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Room Detail Lightbox overlay */}
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

              {/* Box Content */}
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
                      {selectedProject.category} Sanctuary
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
                          <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontFamily: 'var(--sans)' }}>Scenic View</div>
                          <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500, fontFamily: 'var(--sans)' }}>{selectedProject.specs.view}</div>
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: '40px' }}>
                      <button
                        onClick={() => {
                          setSelectedProject(null);
                          window.scrollTo(0,0);
                        }}
                        className="btn-formal-double"
                        style={{ padding: '14px 28px', fontSize: '10px' }}
                      >
                        Reserve Sanctuary Stay
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
      </section>
    </PageTransition>
  );
}

import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    // Initialize Lenis smooth scroll with luxurious exponential easing
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // fluid water-like flow
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.2,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Synchronize ScrollTrigger with Lenis scroll positions
    lenis.on('scroll', ScrollTrigger.update);

    // Run Lenis tick within GSAP requestAnimationFrame ticker
    const updateRaf = (time) => {
      lenis.raf(time * 1000);
    };
    
    gsap.ticker.add(updateRaf);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(updateRaf);
      lenisRef.current = null;
    };
  }, []);

  // Listen to path changes and reset scroll state
  useEffect(() => {
    if (lenisRef.current) {
      // Instantly scroll Lenis to top
      lenisRef.current.scrollTo(0, { immediate: true });
    }
    // Instantly scroll window to top-left to clear any residual horizontal offset
    window.scrollTo(0, 0);
    
    // Allow React components to mount, then refresh ScrollTrigger calculations
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  return <>{children}</>;
}


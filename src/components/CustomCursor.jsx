import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const cursorRingRef = useRef(null);
  const [isTouch, setIsTouch] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    setIsAdmin(window.location.pathname.startsWith('/admin'));
  }, []);

  useEffect(() => {
    if (isTouch || isAdmin) return;
    const cursor = cursorRef.current;
    const cursorRing = cursorRingRef.current;

    if (!cursor || !cursorRing) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    let ringX = 0;
    let ringY = 0;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('mousemove', onMouseMove);

    let rafId;
    const updatePosition = () => {
      // Lerp calculations for ultra smooth cursor follow without GSAP overhead
      currentX += (mouseX - currentX) * 0.35;
      currentY += (mouseY - currentY) * 0.35;
      
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;

      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;

      rafId = requestAnimationFrame(updatePosition);
    };

    updatePosition();

    let currentHoverTarget = null;

    // Hover effect handlers (scales ring and morphs dot) - Optimized to prevent duplicate tweens
    const handleMouseOver = (e) => {
      const hoverTarget = e.target.closest('[data-cursor]');
      if (hoverTarget) {
        if (hoverTarget === currentHoverTarget) return;
        currentHoverTarget = hoverTarget;

        gsap.to(cursorRing, {
          scale: 1.8,
          backgroundColor: 'rgba(197, 168, 128, 0.12)',
          borderColor: 'var(--accent-gold)',
          borderWidth: '1.5px',
          duration: 0.3,
          overwrite: 'auto'
        });
        
        gsap.to(cursor, {
          scale: 0.5,
          backgroundColor: 'var(--text-primary)',
          duration: 0.2,
          overwrite: 'auto'
        });
      }
    };

    const handleMouseOut = (e) => {
      const hoverTarget = e.target.closest('[data-cursor]');
      if (hoverTarget && currentHoverTarget === hoverTarget) {
        // Prevent triggering mouseout when moving between inner children of the same hover target
        if (e.relatedTarget && hoverTarget.contains(e.relatedTarget)) {
          return;
        }

        currentHoverTarget = null;

        gsap.to(cursorRing, {
          scale: 1,
          backgroundColor: 'transparent',
          borderColor: 'rgba(197, 168, 128, 0.3)',
          borderWidth: '1px',
          duration: 0.3,
          overwrite: 'auto'
        });
        
        gsap.to(cursor, {
          scale: 1,
          backgroundColor: 'var(--accent-gold)',
          duration: 0.2,
          overwrite: 'auto'
        });
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(rafId);
    };
  }, [isTouch, isAdmin]);

  if (isTouch || isAdmin) return null;

  return (
    <>
      <div
        ref={cursorRef}
        className="custom-cursor-dot"
        style={{
          position: 'fixed',
          top: -4,
          left: -4,
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: 'var(--accent-gold)',
          pointerEvents: 'none',
          zIndex: 9999,
          transform: 'translate3d(0, 0, 0)',
        }}
      />
      <div
        ref={cursorRingRef}
        className="custom-cursor-ring"
        style={{
          position: 'fixed',
          top: -20,
          left: -20,
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: '1px solid rgba(197, 168, 128, 0.3)',
          pointerEvents: 'none',
          zIndex: 9998,
          transform: 'translate3d(0, 0, 0)',
          transition: 'border-color 0.3s, background-color 0.3s',
        }}
      />
    </>
  );
}

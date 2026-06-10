import React, { useEffect, useRef, useState } from 'react';

export default function CanvasParticles({ 
  preset = 'embers', // 'embers' | 'stars' | 'bokeh' | 'petals'
  count,             // Optional manual override
  color,             // Optional manual override (format: 'R, G, B')
  minSize,           // Optional manual override
  maxSize,           // Optional manual override
  opacityMax,        // Optional manual override
  zIndex = 2
}) {
  const canvasRef = useRef(null);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    // Soft fade in on render
    const fadeTimer = setTimeout(() => setOpacity(1), 300);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Scale canvas to parent or viewport
    let width = (canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight);

    // Resolve configuration based on preset
    let pCount = count;
    let pColor = color;
    let pMinSize = minSize;
    let pMaxSize = maxSize;
    let pOpacityMax = opacityMax;

    // Detect mobile/low-end device to scale down particle counts for performance
    const isMobileDevice = window.innerWidth < 768 || (navigator.userAgent && /Mobi|Android/i.test(navigator.userAgent));

    if (preset === 'embers') {
      pCount = pCount ?? (isMobileDevice ? 35 : 140); // 4x reduction on mobile
      pColor = pColor ?? '189, 160, 120'; // Champagne Gold
      pMinSize = pMinSize ?? 0.6;
      pMaxSize = pMaxSize ?? 2.2;
      pOpacityMax = pOpacityMax ?? 0.65;
    } else if (preset === 'stars') {
      pCount = pCount ?? (isMobileDevice ? 25 : 80); // 3x reduction on mobile
      pColor = pColor ?? '245, 242, 235'; // Off-white luxury silver
      pMinSize = pMinSize ?? 0.8;
      pMaxSize = pMaxSize ?? 2.0;
      pOpacityMax = pOpacityMax ?? 0.8;
    } else if (preset === 'bokeh') {
      pCount = pCount ?? (isMobileDevice ? 5 : 14); // Half bokeh gradients on mobile
      pColor = pColor ?? '189, 160, 120'; // Warm Gold
      pMinSize = pMinSize ?? 20;
      pMaxSize = pMaxSize ?? 60;
      pOpacityMax = pOpacityMax ?? 0.12; // Ultra soft
    } else if (preset === 'petals') {
      pCount = pCount ?? (isMobileDevice ? 12 : 40); // 3x reduction on mobile
      pColor = pColor ?? '230, 180, 175'; // Soft Rose Gold
      pMinSize = pMinSize ?? 2.0;
      pMaxSize = pMaxSize ?? 5.5;
      pOpacityMax = pOpacityMax ?? 0.45;
    }


    const particles = [];
    for (let i = 0; i < pCount; i++) {
      const size = Math.random() * (pMaxSize - pMinSize) + pMinSize;
      
      // Initialize preset-specific properties
      let speedX = 0;
      let speedY = 0;
      let swayAngle = Math.random() * Math.PI * 2;
      let swaySpeed = Math.random() * 0.02 + 0.005;
      let twinkleAngle = Math.random() * Math.PI * 2;
      let twinkleSpeed = Math.random() * 0.03 + 0.01;
      let rotation = Math.random() * Math.PI * 2;
      let rotationSpeed = (Math.random() - 0.5) * 0.02;

      if (preset === 'embers') {
        speedX = (Math.random() - 0.5) * 0.2;
        speedY = -(Math.random() * 0.4 + 0.1); // slow upward
      } else if (preset === 'stars') {
        speedX = (Math.random() - 0.5) * 0.04; // nearly static
        speedY = -(Math.random() * 0.04);
      } else if (preset === 'bokeh') {
        speedX = (Math.random() - 0.5) * 0.08;
        speedY = -(Math.random() * 0.1 + 0.03); // ultra slow upward
      } else if (preset === 'petals') {
        speedX = (Math.random() - 0.3) * 0.15;
        speedY = Math.random() * 0.35 + 0.25; // downward falling
      }

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size,
        speedX,
        speedY,
        baseAlpha: Math.random() * (pOpacityMax - 0.08) + 0.08,
        alpha: 0,
        swayAngle,
        swaySpeed,
        twinkleAngle,
        twinkleSpeed,
        rotation,
        rotationSpeed
      });
    }

    const handleResize = () => {
      if (canvas && canvas.parentElement) {
        width = canvas.width = canvas.parentElement.offsetWidth || window.innerWidth;
        height = canvas.height = canvas.parentElement.offsetHeight || window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);

    // Optimize performance: pause drawing loop when canvas is off-screen
    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0 });
    observer.observe(canvas);

    const animate = () => {
      if (isVisible) {
        ctx.clearRect(0, 0, width, height);

        particles.forEach((p) => {
          // Calculate dynamic alpha (twinkling / shimmering)
          if (preset === 'stars' || preset === 'embers') {
            p.twinkleAngle += p.twinkleSpeed;
            p.alpha = p.baseAlpha * (0.35 + 0.65 * Math.abs(Math.sin(p.twinkleAngle)));
          } else {
            p.alpha = p.baseAlpha;
          }

          // Draw particle based on preset shape
          if (preset === 'bokeh') {
            // Beautiful soft camera lens bokeh using radial gradient
            const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
            grad.addColorStop(0, `rgba(${pColor}, ${p.alpha})`);
            grad.addColorStop(0.4, `rgba(${pColor}, ${p.alpha * 0.5})`);
            grad.addColorStop(1, `rgba(${pColor}, 0)`);
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
          } else if (preset === 'petals') {
            // Soft rose gold leaf/petal structure using rotated ellipse
            p.rotation += p.rotationSpeed;
            ctx.fillStyle = `rgba(${pColor}, ${p.alpha})`;
            ctx.beginPath();
            ctx.ellipse(p.x, p.y, p.size, p.size * 0.55, p.rotation, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Embers / Stars - crisp bright circles
            ctx.fillStyle = `rgba(${pColor}, ${p.alpha})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
          }

          // Physics Updates
          if (preset === 'petals') {
            // Falling leaf style sway
            p.swayAngle += p.swaySpeed;
            p.x += Math.sin(p.swayAngle) * 0.35 + p.speedX;
            p.y += p.speedY;
          } else {
            p.x += p.speedX;
            p.y += p.speedY;
          }

          // Wrap particles vertically
          if (p.y < -50) {
            p.y = height + 50;
            p.x = Math.random() * width;
          } else if (p.y > height + 50) {
            p.y = -50;
            p.x = Math.random() * width;
          }

          // Wrap particles horizontally
          if (p.x < -50) {
            p.x = width + 50;
          } else if (p.x > width + 50) {
            p.x = -50;
          }
        });
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      clearTimeout(fadeTimer);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, [preset, count, color, minSize, maxSize, opacityMax]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: zIndex,
        mixBlendMode: 'screen',
        opacity: opacity,
        transition: 'opacity 1.8s ease',
        willChange: 'transform',
        transform: 'translate3d(0,0,0)',
      }}
    />
  );

}


import React from 'react';
import { motion } from 'framer-motion';

const curtainVariants = {
  initial: {
    y: '0%',
  },
  animate: {
    y: '-100%',
    transition: {
      duration: 0.8,
      ease: [0.76, 0, 0.24, 1], // Custom cubic-bezier for smooth fluid ease
    },
  },
  exit: {
    y: '0%',
    transition: {
      duration: 0.6,
      ease: [0.76, 0, 0.24, 1],
    },
  },
};

const secondaryCurtainVariants = {
  initial: {
    y: '0%',
  },
  animate: {
    y: '-100%',
    transition: {
      duration: 0.8,
      delay: 0.1,
      ease: [0.76, 0, 0.24, 1],
    },
  },
  exit: {
    y: '0%',
    transition: {
      duration: 0.6,
      delay: 0.05,
      ease: [0.76, 0, 0.24, 1],
    },
  },
};

const contentVariants = {
  initial: {
    opacity: 0,
    y: 30,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.4,
      ease: [0.25, 1, 0.5, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -30,
    transition: {
      duration: 0.4,
      ease: 'easeIn',
    },
  },
};

export default function PageTransition({ children }) {
  return (
    <>
      {/* Primary gold wipe */}
      <motion.div
        className="page-transition-wipe-primary"
        variants={curtainVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          backgroundColor: 'var(--accent-gold)',
          zIndex: 99999,
          pointerEvents: 'none',
        }}
      />
      {/* Secondary dark grey wipe */}
      <motion.div
        className="page-transition-wipe-secondary"
        variants={secondaryCurtainVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          backgroundColor: 'var(--bg-secondary)',
          zIndex: 99998,
          pointerEvents: 'none',
        }}
      />
      {/* Actual page layout */}
      <motion.div
        variants={contentVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </motion.div>
    </>
  );
}

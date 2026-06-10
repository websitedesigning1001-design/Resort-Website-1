import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import CanvasParticles from '../components/CanvasParticles';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Mail, Phone, MapPin, Send, Compass } from 'lucide-react';
import { useCMSContent, useSettings } from '../hooks/useCMS';

const fallbackContact = {
  header: {
    tag: 'RESERVE STAY // CONNECTION',
    title: 'Let us prepare your Sanctuary stay',
    subtitle: 'Aura Cove accommodates a limited volume of stays annually to protect the tranquility of the sanctuary. Complete the stay inquiry form to coordinate dates, accommodations, and spa curations.'
  }
};

const fallbackSettings = {
  contact_email: "reservations@auracove.com",
  contact_phone: "+91 481 252 4310",
  contact_address: "Vembanad Lakefront, Kumarakom, Kerala 686563"
};

export default function Contact() {
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: 'villa',
    guestCount: 2,
    date: '',
    details: '',
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const { content: cms } = useCMSContent('contact', fallbackContact);
  const { settings } = useSettings(fallbackSettings);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Pre-fill form if client came from stay curation planner
  useEffect(() => {
    if (location.state) {
      const { inquiryMessage, type } = location.state;
      setFormData((prev) => ({
        ...prev,
        eventType: type || 'villa',
        details: inquiryMessage || '',
      }));
      setStep(3);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step < 3) setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit stay inquiry.');
      }

      setFormSubmitted(true);
    } catch (err) {
      console.error(err);
      setSubmitError('Unable to connect with the sanctuary server. Please try calling reservations directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3, ease: 'easeIn' } },
  };

  return (
    <PageTransition>
      <section 
        style={{
          padding: '160px 5% 100px',
          backgroundColor: 'var(--bg-primary)',
          minHeight: '100vh',
          color: 'var(--text-primary)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '80px',
          alignItems: 'center',
          position: 'relative',
          zIndex: 3,
        }}
        className="contact-layout-grid"
      >
        {/* Left Side: Contact Information */}
        <div style={{ paddingRight: isMobile ? '0' : '40px' }}>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '3px', color: 'var(--accent-gold)', display: 'block', marginBottom: '20px', fontFamily: 'var(--sans)' }}>
            {cms.header.tag}
          </span>
          <h1 
            style={{
              fontFamily: "var(--serif)",
              fontSize: '48px',
              fontWeight: 400,
              textTransform: 'uppercase',
              margin: '0 0 25px 0',
              lineHeight: '1.2',
            }}
          >
            {cms.header.title.includes('Sanctuary stay') ? (
              <>
                {cms.header.title.substring(0, cms.header.title.indexOf('Sanctuary stay'))}
                <span style={{ fontStyle: 'italic', color: 'var(--accent-gold)' }}>Sanctuary stay</span>
                {cms.header.title.substring(cms.header.title.indexOf('Sanctuary stay') + 14)}
              </>
            ) : (
              cms.header.title
            )}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.8', marginBottom: '50px', fontFamily: 'var(--sans)' }}>
            {cms.header.subtitle}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ width: '50px', height: '50px', border: '1px solid var(--border-formal)', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--bg-secondary)' }}>
                <Mail size={18} color="var(--accent-gold)" />
              </div>
              <div>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontFamily: 'var(--sans)' }}>Reservations Email</div>
                <div style={{ fontSize: '14px', color: 'var(--text-primary)', fontFamily: 'var(--sans)' }}>{settings.contact_email}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ width: '50px', height: '50px', border: '1px solid var(--border-formal)', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--bg-secondary)' }}>
                <Phone size={18} color="var(--accent-gold)" />
              </div>
              <div>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontFamily: 'var(--sans)' }}>Sanctuary Front Desk</div>
                <div style={{ fontSize: '14px', color: 'var(--text-primary)', fontFamily: 'var(--sans)' }}>{settings.contact_phone}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ width: '50px', height: '50px', border: '1px solid var(--border-formal)', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--bg-secondary)' }}>
                <MapPin size={18} color="var(--accent-gold)" />
              </div>
              <div>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontFamily: 'var(--sans)' }}>Sanctuary Location</div>
                <div style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: '1.4', fontFamily: 'var(--sans)' }}>
                  {settings.contact_address}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Conversational Form Container */}
        <div>
          <AnimatePresence mode="wait">
            {formSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="layered-container"
                style={{
                  padding: '60px 45px',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <CanvasParticles preset="embers" count={45} opacityMax={0.5} zIndex={1} />

                <div style={{ position: 'relative', zIndex: 2 }}>
                  <div 
                    style={{ 
                      width: '65px', 
                      height: '65px', 
                      borderRadius: '50%', 
                      backgroundColor: 'var(--accent-gold)', 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center',
                      margin: '0 auto 30px',
                    }}
                  >
                    <Check size={28} color="#0a0a0a" />
                  </div>
                  <h3 style={{ fontFamily: "var(--serif)", fontSize: '30px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '15px' }}>
                    Reservation Received
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.8', margin: '0 0 30px 0', fontFamily: 'var(--sans)' }}>
                    Thank you, <strong>{formData.name}</strong>. A reservations sanctuary coordinator has been assigned to your stay inquiry and will reach out to you within 24 hours to confirm date availability.
                  </p>
                  <span 
                    style={{
                      fontFamily: "var(--sans)",
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '2px',
                      color: 'var(--accent-gold)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    <Compass size={12} /> Preparing the Sanctuary
                  </span>
                </div>
              </motion.div>
            ) : (
              <form 
                onSubmit={handleSubmit}
                className="layered-container"
                style={{
                  padding: isMobile ? '24px 20px' : '50px 40px',
                }}
              >
                {/* Step indicators */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '40px' }}>
                  {[1, 2, 3].map((s) => (
                    <div
                      key={s}
                      style={{
                        height: '2px',
                        flex: 1,
                        backgroundColor: step >= s ? 'var(--accent-gold)' : 'var(--border-formal)',
                        transition: 'background-color 0.3s',
                      }}
                    />
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      variants={formVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      <h3 style={{ fontFamily: "var(--serif)", fontSize: '26px', fontWeight: 500, marginBottom: '25px' }}>
                        1. Guest Details
                      </h3>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                          <label style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontFamily: 'var(--sans)' }}>Primary Guest Name</label>
                          <input
                            required
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            style={{
                              width: '100%',
                              padding: '14px',
                              backgroundColor: 'rgba(255,255,255,0.02)',
                              color: 'var(--text-primary)',
                              outline: 'none',
                              fontSize: '14px',
                              fontFamily: 'var(--sans)',
                            }}
                            placeholder="e.g. Eleanor Vance"
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontFamily: 'var(--sans)' }}>Email Address</label>
                          <input
                            required
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            style={{
                              width: '100%',
                              padding: '14px',
                              backgroundColor: 'rgba(255,255,255,0.02)',
                              color: 'var(--text-primary)',
                              outline: 'none',
                              fontSize: '14px',
                              fontFamily: 'var(--sans)',
                            }}
                            placeholder="e.g. eleanor@vance.com"
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontFamily: 'var(--sans)' }}>Phone Number</label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            style={{
                              width: '100%',
                              padding: '14px',
                              backgroundColor: 'rgba(255,255,255,0.02)',
                              color: 'var(--text-primary)',
                              outline: 'none',
                              fontSize: '14px',
                              fontFamily: 'var(--sans)',
                            }}
                            placeholder="e.g. +91 999 123 4567"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      variants={formVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      <h3 style={{ fontFamily: "var(--serif)", fontSize: '26px', fontWeight: 500, marginBottom: '25px' }}>
                        2. Sanctuary Selection
                      </h3>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                          <label style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontFamily: 'var(--sans)' }}>Sanctuary Class</label>
                          <select
                            name="eventType"
                            value={formData.eventType}
                            onChange={handleChange}
                            style={{
                              width: '100%',
                              padding: '14px',
                              backgroundColor: 'rgba(255,255,255,0.02)',
                              color: 'var(--text-primary)',
                              outline: 'none',
                              fontSize: '14px',
                              fontFamily: 'var(--sans)',
                            }}
                          >
                            <option value="villa" style={{ backgroundColor: 'var(--bg-secondary)' }}>Private Pool Villa</option>
                            <option value="suite" style={{ backgroundColor: 'var(--bg-secondary)' }}>Lakeside Heritage Suite</option>
                            <option value="room" style={{ backgroundColor: 'var(--bg-secondary)' }}>Garden Lily Pond Room</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontFamily: 'var(--sans)' }}>Anticipated Arrival Date</label>
                          <input
                            required
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            style={{
                              width: '100%',
                              padding: '14px',
                              backgroundColor: 'rgba(255,255,255,0.02)',
                              color: 'var(--text-primary)',
                              outline: 'none',
                              fontSize: '14px',
                              fontFamily: 'var(--sans)',
                            }}
                          />
                        </div>

                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <label style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontFamily: 'var(--sans)' }}>Guests Occupying Room</label>
                            <span style={{ fontSize: '13px', color: 'var(--accent-gold)', fontWeight: 600, fontFamily: 'var(--sans)' }}>{formData.guestCount} Guests</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="6"
                            name="guestCount"
                            value={formData.guestCount}
                            onChange={handleChange}
                            style={{
                              width: '100%',
                              accentColor: 'var(--accent-gold)',
                              cursor: 'pointer',
                            }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key="step3"
                      variants={formVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      <h3 style={{ fontFamily: "var(--serif)", fontSize: '26px', fontWeight: 500, marginBottom: '25px' }}>
                        3. Curation Preferences
                      </h3>
                      
                      <div>
                        <label style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontFamily: 'var(--sans)' }}>
                          Special Curation Details (diet, Ayurveda needs, spa requests, or prefilled estimate details)
                        </label>
                        <textarea
                          name="details"
                          value={formData.details}
                          onChange={handleChange}
                          rows={6}
                          style={{
                            width: '100%',
                            padding: '14px',
                            backgroundColor: 'rgba(255,255,255,0.02)',
                            color: 'var(--text-primary)',
                            outline: 'none',
                            fontSize: '14px',
                            resize: 'none',
                            lineHeight: '1.6',
                            fontFamily: 'var(--sans)',
                          }}
                          placeholder="Describe your spa requests, airport sedan pickup requirements, custom culinary requests, or copy details from your stay curation tool forecast..."
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={handleBack}
                      style={{
                        padding: '14px 28px',
                        backgroundColor: 'transparent',
                        border: '1px solid var(--border-formal)',
                        color: 'var(--text-secondary)',
                        fontFamily: "var(--sans)",
                        fontSize: '11px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        cursor: 'pointer',
                      }}
                    >
                      Back
                    </button>
                  ) : (
                    <div />
                  )}

                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      style={{
                        padding: '14px 32px',
                        backgroundColor: 'var(--accent-gold)',
                        color: 'var(--bg-primary)',
                        border: 'none',
                        fontFamily: "var(--sans)",
                        fontSize: '11px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '1.5px',
                        cursor: 'pointer',
                      }}
                    >
                      Next Step
                    </button>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '15px' }}>
                      {submitError && (
                        <div style={{ color: '#ff4d4d', fontSize: '12px', fontFamily: 'var(--sans)', textAlign: 'right' }}>
                          {submitError}
                        </div>
                      )}
                      <button
                        type="submit"
                        className="btn-formal-double"
                        disabled={isSubmitting}
                        style={{
                          padding: '14px 32px',
                          backgroundColor: isSubmitting ? 'var(--text-secondary)' : 'var(--accent-gold)',
                          color: 'var(--bg-primary)',
                          border: 'none',
                          fontFamily: "var(--sans)",
                          fontSize: '11px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '1.5px',
                          cursor: isSubmitting ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          opacity: isSubmitting ? 0.7 : 1,
                        }}
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit Booking Inquiry'} <Send size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </form>
            )}
          </AnimatePresence>
        </div>
      </section>
    </PageTransition>
  );
}

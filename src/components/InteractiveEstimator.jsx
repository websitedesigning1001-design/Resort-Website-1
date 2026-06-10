import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Check, Compass, Copy, FileText, Calendar, Landmark, HelpCircle, CheckCircle } from 'lucide-react';

// Nightly rates in Indian Rupees (INR) for Aura Cove Resort
const ROOM_RATES = {
  villa: 38000,  // Private Pool Villa (₹38,000/night)
  suite: 24000,  // Lakeside Heritage Suite (₹24,000/night)
  room: 16000,   // Garden View Room (₹16,000/night)
};

const ADDON_PRICES = {
  spa: 12000,      // Ayurveda Sanctuary Spa package for 2 (₹12,000)
  dining: 7500,    // Bespoke Lakeside Candlelight Dinner (₹7,500)
  cruise: 9500,    // Private Sunset Backwater Boat Cruise (₹9,500)
  wellness: 4000,  // Traditional Wellness Consultation & Diet Plan (₹4,000)
  transfer: 5000,  // Luxury Airport Sedan Round-trip transfers (₹5,000)
};

const SEASON_MULTIPLIERS = {
  peak: 1.4,     // Peak Winter Season (Nov - Feb)
  mid: 1.0,      // Mid Summer Season (Mar - May)
  monsoon: 0.8,  // Monsoon Ayurveda Retreat (Jun - Oct)
};

export default function InteractiveEstimator() {
  const navigate = useNavigate();
  
  // Custom interactive states
  const [roomType, setRoomType] = useState('villa');
  const [nights, setNights] = useState(3);
  const [guests, setGuests] = useState(2);
  const [season, setSeason] = useState('peak');
  const [addons, setAddons] = useState({
    spa: true,
    dining: false,
    cruise: true,
    wellness: false,
    transfer: false,
  });

  const [copied, setCopied] = useState(false);
  const [displayPrice, setDisplayPrice] = useState(0);
  const priceRef = useRef({ value: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate detailed stay breakdown
  const getBreakdown = () => {
    const baseRatePerNight = ROOM_RATES[roomType];
    const seasonMult = SEASON_MULTIPLIERS[season];
    
    // Scale rate slightly for extra occupancy above 2 guests
    const guestMultiplier = guests > 2 ? 1 + (guests - 2) * 0.25 : 1.0;
    
    // Calculate core room cost
    const accommodationCost = Math.round(baseRatePerNight * nights * guestMultiplier * seasonMult);
    
    // Calculate addons
    const spaFee = addons.spa ? ADDON_PRICES.spa : 0;
    const diningFee = addons.dining ? ADDON_PRICES.dining : 0;
    const cruiseFee = addons.cruise ? ADDON_PRICES.cruise : 0;
    const wellnessFee = addons.wellness ? ADDON_PRICES.wellness : 0;
    const transferFee = addons.transfer ? ADDON_PRICES.transfer : 0;

    const addonsCost = spaFee + diningFee + cruiseFee + wellnessFee + transferFee;
    const subtotal = accommodationCost + addonsCost;
    
    // Luxury stay tax (18% GST)
    const luxuryTax = Math.round(subtotal * 0.18);
    const total = subtotal + luxuryTax;

    return {
      baseRatePerNight,
      accommodationCost,
      spaFee,
      diningFee,
      cruiseFee,
      wellnessFee,
      transferFee,
      addonsCost,
      subtotal,
      luxuryTax,
      total
    };
  };

  const breakdown = getBreakdown();
  const targetPrice = breakdown.total;

  // Smooth numeric counter animation for Grand Total
  useEffect(() => {
    const obj = priceRef.current;
    gsap.to(obj, {
      value: targetPrice,
      duration: 0.8,
      ease: 'power2.out',
      onUpdate: () => {
        setDisplayPrice(Math.round(obj.value));
      },
    });
  }, [targetPrice]);

  const handleAddonToggle = (key) => {
    setAddons((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Copy estimate stay summary to clipboard
  const handleCopyEstimate = () => {
    const addonList = Object.keys(addons)
      .filter((k) => addons[k])
      .map((k) => k.toUpperCase())
      .join(', ');

    const minTotal = Math.round(breakdown.total * 0.95);
    const maxTotal = Math.round(breakdown.total * 1.08);

    const summaryText = `--- AURA COVE RESORT & SPA - STAY CURATION ---
Room Type: ${roomType === 'villa' ? 'Private Pool Villa' : roomType === 'suite' ? 'Lakeside Heritage Suite' : 'Garden View Room'}
Duration: ${nights} Nights
Guests: ${guests} Guests
Season: ${season === 'peak' ? 'Peak Winter (Nov-Feb)' : season === 'mid' ? 'Mid Summer (Mar-May)' : 'Monsoon Ayurveda (Jun-Oct)'}
Add-ons Selected: ${addonList || 'NONE'}

Breakdown:
- Luxury Accommodation: ₹${breakdown.accommodationCost.toLocaleString('en-IN')}
${breakdown.spaFee ? `- Ayurveda Sanctuary Spa: ₹${breakdown.spaFee.toLocaleString('en-IN')}\n` : ''}${breakdown.diningFee ? `- Bespoke Private Dining: ₹${breakdown.diningFee.toLocaleString('en-IN')}\n` : ''}${breakdown.cruiseFee ? `- Private Backwater Cruise: ₹${breakdown.cruiseFee.toLocaleString('en-IN')}\n` : ''}${breakdown.wellnessFee ? `- Wellness Consultation: ₹${breakdown.wellnessFee.toLocaleString('en-IN')}\n` : ''}${breakdown.transferFee ? `- Luxury Transfers: ₹${breakdown.transferFee.toLocaleString('en-IN')}\n` : ''}- Subtotal: ₹${breakdown.subtotal.toLocaleString('en-IN')}
- Resort Luxury Tax (18%): ₹${breakdown.luxuryTax.toLocaleString('en-IN')}
ESTIMATED SANCTUARY STAY RANGE: ₹${minTotal.toLocaleString('en-IN')} - ₹${maxTotal.toLocaleString('en-IN')}

Generated on: ${new Date().toLocaleDateString('en-IN')}
*Note: Subject to availability, peak dates surcharge, and resort booking policies.`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBookEstimate = async () => {
    const addonNames = Object.keys(addons)
      .filter((k) => addons[k])
      .map((k) => k.charAt(0).toUpperCase() + k.slice(1));
    
    const seasonText = season === 'peak' ? 'Peak Winter (Nov-Feb)' : season === 'mid' ? 'Mid Summer (Mar-May)' : 'Monsoon Ayurveda (Jun-Oct)';
    const roomText = roomType === 'villa' ? 'Private Pool Villa' : roomType === 'suite' ? 'Lakeside Heritage Suite' : 'Garden View Room';

    const minTotal = Math.round(breakdown.total * 0.95);
    const maxTotal = Math.round(breakdown.total * 1.08);

    // Fire API call to save calculations in DB
    try {
      await fetch('/api/estimates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomType: roomText,
          nights,
          guests,
          season: seasonText,
          addons: addonNames,
          minBudget: minTotal,
          maxBudget: maxTotal
        })
      });
    } catch (err) {
      console.error('Failed to save estimate stats:', err);
    }

    const message = `I would like to inquire about reserving a stay at Aura Cove Resort & Spa. Accommodation choice is ${roomText} for ${nights} nights (${guests} guests) during the ${seasonText}. Selected Experiences: ${addonNames.join(', ') || 'None'}. Estimated stay budget: ₹${minTotal.toLocaleString('en-IN')} to ₹${maxTotal.toLocaleString('en-IN')} (Incl. Tax)`;
    
    navigate('/contact', { state: { inquiryMessage: message, type: roomType } });
  };

  return (
    <div 
      className="estimator-container"
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px 0',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <span 
          style={{
            fontFamily: "var(--sans)",
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '3px',
            color: 'var(--accent-gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '12px',
          }}
        >
          <Compass size={12} /> Curation Planner
        </span>
        <h2 
          style={{
            fontFamily: "var(--serif)",
            fontSize: '44px',
            fontWeight: 400,
            margin: '0',
            color: 'var(--text-primary)',
            textTransform: 'uppercase',
          }}
        >
          Curate Your <span style={{ fontStyle: 'italic', color: 'var(--accent-gold)' }}>Sanctuary Stay</span>
        </h2>
        <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: 'var(--text-secondary)', letterSpacing: '1px', marginTop: '10px' }}>
          Interactive stay forecasting for our heritage villas and lakeside suites in Kumarakom.
        </p>
      </div>

      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '40px',
          alignItems: 'start'
        }}
      >
        
        {/* Left Column: Interactive Inputs */}
        <div 
          className="layered-container"
          style={{
            padding: isMobile ? '24px 15px' : '40px',
            backgroundColor: 'rgba(16, 16, 16, 0.4)',
          }}
        >
          {/* Step 1: Room Type */}
          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--accent-gold)', marginBottom: '15px', fontFamily: 'var(--sans)', fontWeight: 600 }}>
              01. Sanctuary Class
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {[
                { id: 'villa', label: 'Pool Villa' },
                { id: 'suite', label: 'Heritage Suite' },
                { id: 'room', label: 'Garden Room' },
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setRoomType(type.id)}
                  style={{
                    padding: '12px 5px',
                    backgroundColor: roomType === type.id ? 'var(--accent-gold)' : 'transparent',
                    border: '1px solid',
                    borderColor: roomType === type.id ? 'var(--accent-gold)' : 'var(--border-formal)',
                    color: roomType === type.id ? 'var(--bg-primary)' : 'var(--text-primary)',
                    fontFamily: "var(--sans)",
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Night Duration */}
          <div style={{ marginBottom: '30px' }}>
            <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', marginBottom: '12px' }}>
              <label style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--accent-gold)', fontFamily: 'var(--sans)', fontWeight: 600 }}>
                02. Duration of Stay
              </label>
              <span style={{ fontSize: '14px', fontFamily: "var(--serif)", fontWeight: 600, color: 'var(--text-primary)' }}>
                {nights} Nights
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="14"
              step="1"
              value={nights}
              onChange={(e) => setNights(Number(e.target.value))}
              style={{
                width: '100%',
                height: '2px',
                backgroundColor: 'var(--border-formal)',
                outline: 'none',
                cursor: 'pointer',
                accentColor: 'var(--accent-gold)',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '9px', color: 'var(--text-secondary)', fontFamily: 'var(--sans)' }}>
              <span>1 Night</span>
              <span>7 Nights (Weekly)</span>
              <span>14 Nights (Retreat)</span>
            </div>
          </div>

          {/* Step 2b: Guest Count */}
          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--accent-gold)', marginBottom: '15px', fontFamily: 'var(--sans)', fontWeight: 600 }}>
              03. Occupancy
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: '10px' }}>
              {[1, 2, 3, 4].map((g) => (
                <button
                  key={g}
                  onClick={() => setGuests(g)}
                  style={{
                    padding: '10px',
                    backgroundColor: guests === g ? 'var(--accent-gold)' : 'transparent',
                    border: '1px solid',
                    borderColor: guests === g ? 'var(--accent-gold)' : 'var(--border-formal)',
                    color: guests === g ? 'var(--bg-primary)' : 'var(--text-primary)',
                    fontFamily: "var(--sans)",
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {g} {g === 1 ? 'Guest' : 'Guests'}
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Seasonality */}
          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--accent-gold)', marginBottom: '15px', fontFamily: 'var(--sans)', fontWeight: 600 }}>
              04. Seasonal Window
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
              {[
                { id: 'peak', label: 'Peak Winter (Nov - Feb)', desc: 'Perfect dry cool climate, high demand (+40%)' },
                { id: 'mid', label: 'Mid Summer (Mar - May)', desc: 'Warm lakeside breezes, tropical standard rates' },
                { id: 'monsoon', label: 'Monsoon Ayurveda Retreat (Jun - Oct)', desc: 'Lush rains, ideal for traditional treatments (-20%)' },
              ].map((s) => (
                <div
                  key={s.id}
                  onClick={() => setSeason(s.id)}
                  style={{
                    padding: '12px 18px',
                    border: '1px solid',
                    borderColor: season === s.id ? 'var(--accent-gold)' : 'var(--border-formal)',
                    backgroundColor: season === s.id ? 'rgba(189, 160, 120, 0.05)' : 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--sans)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {s.label}
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '4px', fontFamily: 'var(--sans)' }}>
                    {s.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Step 4: Add-ons */}
          <div>
            <label style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--accent-gold)', marginBottom: '15px', fontFamily: 'var(--sans)', fontWeight: 600 }}>
              05. Curated Resort Experiences
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { id: 'spa', label: 'Ayurveda Sanctuary Massage Package (for 2)', price: ADDON_PRICES.spa },
                { id: 'dining', label: 'Bespoke Lakefront 5-Course Dinner', price: ADDON_PRICES.dining },
                { id: 'cruise', label: 'Private Sunset Vembanad Lake Cruise', price: ADDON_PRICES.cruise },
                { id: 'wellness', label: 'Ayurvedic Physician Consultation & Diet Plan', price: ADDON_PRICES.wellness },
                { id: 'transfer', label: 'Luxury Round-trip Airport Sedan Transfers', price: ADDON_PRICES.transfer },
              ].map((addon) => (
                <div
                  key={addon.id}
                  onClick={() => handleAddonToggle(addon.id)}
                  style={{
                    padding: '14px 16px',
                    border: '1px solid',
                    borderColor: addons[addon.id] ? 'var(--accent-gold)' : 'var(--border-formal)',
                    backgroundColor: 'rgba(255,255,255,0.01)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div 
                      style={{ 
                        width: '16px', 
                        height: '16px', 
                        border: '1px solid var(--accent-gold)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        backgroundColor: addons[addon.id] ? 'var(--accent-gold)' : 'transparent',
                        borderRadius: '2px',
                      }}
                    >
                      {addons[addon.id] && <Check size={11} color="#080808" strokeWidth={3} />}
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--text-primary)', fontFamily: 'var(--sans)' }}>
                      {addon.label}
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--accent-gold)', fontFamily: 'var(--sans)', fontWeight: 600 }}>
                    +₹{addon.price.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Invoice/Statement Output */}
        <div 
          style={{
            position: isMobile ? 'static' : 'sticky',
            top: isMobile ? '0' : '120px',
            display: 'flex',
            flexDirection: 'column',
            gap: '25px',
          }}
        >
          {/* Invoice card */}
          <div 
            className="layered-container"
            style={{
              padding: isMobile ? '24px 15px' : '45px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-formal)',
              backgroundImage: 'radial-gradient(circle at 100% 0%, rgba(189,160,120,0.03) 0%, transparent 70%)',
              position: 'relative',
            }}
          >
            {/* Stamp overlay */}
            <div 
              style={{
                position: 'absolute',
                top: '40px',
                right: '40px',
                border: '2px double rgba(189, 160, 120, 0.4)',
                padding: '6px 12px',
                color: 'rgba(189, 160, 120, 0.4)',
                fontFamily: 'var(--serif)',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '2px',
                transform: 'rotate(12deg)',
                userSelect: 'none',
              }}
            >
              Curation Approved
            </div>

            <div style={{ borderBottom: '1px solid var(--border-formal)', paddingBottom: '25px', marginBottom: '25px' }}>
              <span style={{ fontFamily: 'var(--sans)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '3px', color: 'var(--accent-gold)' }}>
                FORECAST STATEMENT NO. #AC-7702
              </span>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: '28px', color: 'var(--text-primary)', margin: '8px 0 0 0', fontWeight: 500 }}>
                Aura Cove Curation
              </h3>
            </div>

            {/* Line Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '30px' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'var(--sans)' }}>
                  Luxury Accommodation ({nights} Nights, {guests} Guests)
                </span>
                <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontFamily: 'var(--sans)', fontWeight: 500 }}>
                  ₹{breakdown.accommodationCost.toLocaleString('en-IN')}
                </span>
              </div>

              {breakdown.spaFee > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'var(--sans)' }}>
                    Ayurveda Sanctuary Spa Package
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontFamily: 'var(--sans)', fontWeight: 500 }}>
                    ₹{breakdown.spaFee.toLocaleString('en-IN')}
                  </span>
                </div>
              )}

              {breakdown.diningFee > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'var(--sans)' }}>
                    Bespoke Lakefront Dining
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontFamily: 'var(--sans)', fontWeight: 500 }}>
                    ₹{breakdown.diningFee.toLocaleString('en-IN')}
                  </span>
                </div>
              )}

              {breakdown.cruiseFee > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'var(--sans)' }}>
                    Private Sunset Backwater Cruise
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontFamily: 'var(--sans)', fontWeight: 500 }}>
                    ₹{breakdown.cruiseFee.toLocaleString('en-IN')}
                  </span>
                </div>
              )}

              {breakdown.wellnessFee > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'var(--sans)' }}>
                    Traditional Wellness Consultation
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontFamily: 'var(--sans)', fontWeight: 500 }}>
                    ₹{breakdown.wellnessFee.toLocaleString('en-IN')}
                  </span>
                </div>
              )}

              {breakdown.transferFee > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'var(--sans)' }}>
                    Luxury Airport Transfers (Round-trip)
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontFamily: 'var(--sans)', fontWeight: 500 }}>
                    ₹{breakdown.transferFee.toLocaleString('en-IN')}
                  </span>
                </div>
              )}

              <div style={{ borderTop: '1px solid var(--border-formal)', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'var(--sans)' }}>
                  Subtotal
                </span>
                <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontFamily: 'var(--sans)' }}>
                  ₹{breakdown.subtotal.toLocaleString('en-IN')}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'var(--sans)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  Statutory Resort Taxes & GST (18%) <HelpCircle size={10} style={{ opacity: 0.6 }} />
                </span>
                <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontFamily: 'var(--sans)' }}>
                  ₹{breakdown.luxuryTax.toLocaleString('en-IN')}
                </span>
              </div>

            </div>

            {/* Total Display with Range pricing to protect resort margins */}
            <div 
              style={{ 
                borderTop: '1px solid var(--accent-gold)', 
                paddingTop: '25px',
                textAlign: 'center',
              }}
            >
              <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '2.5px', color: 'var(--text-secondary)', fontFamily: 'var(--sans)' }}>
                Estimated Stay Curation Range
              </span>
              <div 
                style={{ 
                  fontFamily: "var(--serif)", 
                  fontSize: '34px', 
                  fontWeight: 400, 
                  color: 'var(--accent-gold)',
                  margin: '8px 0',
                  letterSpacing: '0.5px'
                }}
              >
                ₹{Math.round(displayPrice * 0.95).toLocaleString('en-IN')} - ₹{Math.round(displayPrice * 1.08).toLocaleString('en-IN')}*
              </div>
              <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontStyle: 'italic', fontFamily: 'var(--sans)', display: 'block' }}>
                *Forecast including luxury occupancy adjustments & seasonal rate indices.
              </span>

              {/* Warning Callout Box for pricing protection */}
              <div 
                style={{
                  marginTop: '25px',
                  padding: '16px',
                  border: '1px solid rgba(189, 160, 120, 0.25)',
                  backgroundColor: 'rgba(189, 160, 120, 0.03)',
                  textAlign: 'left',
                  fontSize: '11px',
                  lineHeight: '1.6',
                  fontFamily: 'var(--sans)',
                  color: 'var(--text-secondary)',
                }}
              >
                <strong style={{ color: 'var(--accent-gold)', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  ⚠️ Rate & Booking Clause
                </strong>
                Due to seasonal demand spikes, holiday packages, and custom Ayurvedic diet customization, rates fluctuate. This forecast acts as a baseline stay range. The exact quote will be confirmed upon date reservation request.
              </div>
            </div>

          </div>

          {/* Action buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '15px' }}>
            <button
              onClick={handleCopyEstimate}
              style={{
                padding: '14px',
                backgroundColor: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-formal)',
                color: 'var(--text-primary)',
                fontFamily: "var(--sans)",
                fontSize: '10px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
              }}
              data-cursor="copy"
            >
              {copied ? <CheckCircle size={12} color="var(--accent-gold)" /> : <Copy size={12} />}
              {copied ? 'Curation Copied' : 'Copy Stay Curation'}
            </button>

            <button
              onClick={handleBookEstimate}
              className="btn-formal-double"
              style={{
                padding: '14px',
                backgroundColor: 'var(--accent-gold)',
                color: 'var(--bg-primary)',
                border: 'none',
                fontFamily: "var(--sans)",
                fontSize: '10px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                cursor: 'pointer',
              }}
              data-cursor="inquire"
            >
              Reserve Sanctuary
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

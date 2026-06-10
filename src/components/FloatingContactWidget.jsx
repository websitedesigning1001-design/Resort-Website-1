import React from 'react';
import { useSettings } from '../hooks/useCMS';

export default function FloatingContactWidget() {
  const { settings } = useSettings();
  
  if (!settings) return null;
  
  const rawPhone = settings.contact_phone || '+91 481 252 4000';
  const rawWhatsApp = settings.whatsapp_number || '914812524000';
  
  // Clean strings for links
  const phoneHref = `tel:${rawPhone.replace(/[^\d+]/g, '')}`;
  const whatsappClean = rawWhatsApp.replace(/[^\d]/g, '');
  const whatsappHref = `https://wa.me/${whatsappClean}?text=Hello%20Aura%20Cove%2C%20I%20would%20like%20to%20inquire%20about%20a%20sanctuary%20stay.`;
  
  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        zIndex: 999,
      }}
    >
      {/* Phone Call Button */}
      <a 
        href={phoneHref}
        data-cursor="call"
        className="floating-contact-btn phone-btn"
        style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: 'rgba(10, 10, 10, 0.85)',
          border: '1px solid var(--accent-gold)',
          color: 'var(--accent-gold)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          textDecoration: 'none',
          position: 'relative'
        }}
        title={`Call Us: ${rawPhone}`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
        </svg>
      </a>
      
      {/* WhatsApp Chat Button */}
      <a 
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor="chat"
        className="floating-contact-btn whatsapp-btn"
        style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: 'rgba(10, 10, 10, 0.85)',
          border: '1px solid var(--accent-gold)',
          color: 'var(--accent-gold)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          textDecoration: 'none',
          position: 'relative'
        }}
        title="WhatsApp Chat"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97C16.528 2.017 14.077 1 11.432 1.002 5.998 1.002 1.573 5.372 1.57 10.8c-.001 1.737.479 3.43 1.39 4.954l-.916 3.348 3.503-.918c1.506.82 3.03 1.258 4.5 1.258zm9.744-4.825c-.269-.135-1.593-.786-1.839-.876-.246-.09-.425-.135-.604.135-.179.27-.693.876-.85 1.057-.157.18-.313.202-.582.067-.269-.135-1.137-.419-2.166-1.338-.801-.714-1.342-1.597-1.499-1.867-.157-.27-.017-.416.118-.551.121-.122.269-.315.403-.473.135-.157.179-.27.269-.45.09-.18.045-.338-.023-.473-.067-.135-.604-1.457-.827-1.996-.217-.523-.44-.452-.604-.461-.157-.008-.336-.008-.515-.008-.179 0-.47.067-.716.338-.246.27-.94.92-.94 2.247s.963 2.61 1.097 2.79c.135.18 1.897 2.896 4.596 4.06.642.277 1.144.443 1.536.568.644.204 1.23.175 1.693.106.516-.078 1.593-.652 1.817-1.282.224-.63.224-1.17.157-1.282-.067-.113-.246-.179-.516-.314z"/>
      </svg>
      </a>
      
      <style>{`
        .floating-contact-btn:hover {
          transform: translateY(-3px) scale(1.05);
          background-color: var(--accent-gold) !important;
          color: #0a0a0a !important;
          box-shadow: 0 12px 40px rgba(189, 160, 120, 0.4) !important;
        }
        @media (max-width: 768px) {
          .floating-contact-btn {
            width: 44px !important;
            height: 44px !important;
          }
        }
      `}</style>
    </div>
  );
}

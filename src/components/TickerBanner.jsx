import React from 'react';

export default function TickerBanner({ items = ['Aura & Co.', 'Design Scenography', 'Bespoke Production', 'Lighting Systems'] }) {
  // Duplicate list to ensure continuous infinite loop
  const displayItems = [...items, ...items, ...items];
  
  return (
    <div className="ticker-wrap">
      <div className="ticker-content">
        {displayItems.map((item, idx) => (
          <div key={idx} className="ticker-item">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

import React from 'react';
import { portfolioData } from '../data/portfolioData';

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-container">
      <div>
        © 2026 · {portfolioData.personal.name.toUpperCase()}
      </div>

      <div style={{ color: 'var(--text-muted)' }}>
        ● CRAFTED WITH WARM/COOL DUALITY ●
      </div>

      <button onClick={scrollToTop} className="back-to-top-btn">
        BACK TO TOP ↑
      </button>
    </footer>
  );
};

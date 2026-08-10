import React from 'react';
import { ArrowDownRight, Sparkles, FileText, MapPin } from 'lucide-react';
import { SectionLabel } from './SectionLabel';
import { RevealOnScroll } from './RevealOnScroll';
import { portfolioData } from '../data/portfolioData';

export const Hero = ({ onOpenContact, onOpenResume }) => {
  return (
    <section className="hero-container section-wrapper" id="hero">
      <RevealOnScroll animation="fade-up">
        <div className="hero-badge-row">
          <div className="status-pill">
            <span className="pulse-dot"></span>
            <span>{portfolioData.personal.badgeStatus}</span>
          </div>
          <div className="status-pill">
            <MapPin size={13} style={{ color: 'var(--accent-teal)' }} />
            <span>{portfolioData.personal.location}</span>
          </div>
        </div>
      </RevealOnScroll>

      <div className="hero-grid">
        <div className="hero-main">
          <RevealOnScroll animation="fade-up" delay={100}>
            <h1 className="hero-title">
              <span className="first-name">Mahesh</span>
              <span className="last-name gradient-text-animated">Dindur<span className="dot-teal">.</span></span>
            </h1>
          </RevealOnScroll>

          <RevealOnScroll animation="fade-up" delay={200}>
            <p className="hero-subtitle">
              {portfolioData.personal.shortBio}
            </p>
          </RevealOnScroll>

          <RevealOnScroll animation="fade-up" delay={300}>
            <div className="hero-cta-group">
              <a href="#projects" className="btn-primary">
                <span>See projects</span>
                <ArrowDownRight size={18} />
              </a>
              <button onClick={onOpenContact} className="btn-secondary">
                <Sparkles size={16} style={{ color: 'var(--accent-warm)' }} />
                <span>Let's talk</span>
              </button>
              <button onClick={onOpenResume} className="btn-secondary">
                <FileText size={16} style={{ color: 'var(--accent-teal)' }} />
                <span>Resume</span>
              </button>
            </div>
          </RevealOnScroll>
        </div>

        <div className="hero-stats-grid">
          {portfolioData.stats.map((stat, idx) => (
            <RevealOnScroll key={idx} animation="scale" delay={200 + idx * 100}>
              <div className="stat-card">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
                {stat.sublabel && <div className="stat-sublabel">{stat.sublabel}</div>}
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>

      {/* Ticker Marquee */}
      <div className="marquee-container">
        <div className="marquee-content">
          {[...portfolioData.marqueeTech, ...portfolioData.marqueeTech].map((tech, idx) => (
            <div key={idx} className="marquee-item">
              <span>{tech}</span>
              <span className="marquee-diamond">✦</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

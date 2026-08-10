import React, { useState } from 'react';
import { SectionLabel } from './SectionLabel';
import { RevealOnScroll } from './RevealOnScroll';
import { portfolioData } from '../data/portfolioData';
import { Sparkles } from 'lucide-react';

export const About = () => {
  const [auraActive, setAuraActive] = useState(false);

  return (
    <section className="section-wrapper" id="about">
      <RevealOnScroll animation="fade-up">
        <SectionLabel
          number="01"
          title="ABOUT"
          mainHeading="A builder who ships what he learns."
        />
      </RevealOnScroll>

      <div className="about-grid">
        <RevealOnScroll animation="fade-right" delay={150}>
          <div
            className={`profile-card-wrapper ${auraActive ? 'aura-active' : ''}`}
            onMouseEnter={() => setAuraActive(true)}
            onMouseLeave={() => setAuraActive(false)}
            style={{ cursor: 'pointer' }}
          >
            <img
              src={portfolioData.personal.photoUrl}
              alt={portfolioData.personal.name}
              className="profile-img"
              style={{
                filter: auraActive ? 'none' : 'grayscale(30%) contrast(105%)',
                transition: 'all 0.5s ease'
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: '12px',
              left: '12px',
              right: '12px',
              display: 'flex',
              justify耳: 'space-between',
              pointerEvents: 'none'
            }}>
              <span className="bento-pill" style={{ background: 'rgba(0,0,0,0.7)', color: '#fff', backdropFilter: 'blur(8px)' }}>
                {portfolioData.personal.githubHandle}
              </span>
              <span className="bento-pill" style={{ background: 'var(--accent-coral)', color: '#000', fontWeight: '700' }}>
                {portfolioData.personal.versionTag}
              </span>
            </div>
          </div>
        </RevealOnScroll>

        <div className="about-content">
          <RevealOnScroll animation="fade-left" delay={200}>
            {/* Phonics & Stack badges inspired by Rishabh's portfolio */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ color: 'var(--accent-teal)' }}>/マヘシュ・ディンドゥル/</span>
              <span>•</span>
              <span style={{ color: 'var(--text-muted)' }}>.py / .cpp / .sql / .java</span>
              <span>•</span>
              <span style={{ color: 'var(--accent-warm)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={12} /> Full-Stack AI Engineer
              </span>
            </div>

            <div className="about-quote gradient-text-animated">”</div>
            <p className="about-bio-text">
              {portfolioData.personal.fullBio}
            </p>
          </RevealOnScroll>

          <div className="about-highlights-grid">
            {portfolioData.aboutHighlights.map((item, idx) => (
              <RevealOnScroll key={idx} animation="scale" delay={300 + idx * 80}>
                <div className="highlight-box">
                  <div className="highlight-label">{item.label}</div>
                  <div className="highlight-value">{item.value}</div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

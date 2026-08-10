import React from 'react';
import { GraduationCap, Award } from 'lucide-react';
import { SectionLabel } from './SectionLabel';
import { RevealOnScroll } from './RevealOnScroll';
import { portfolioData } from '../data/portfolioData';

export const Education = () => {
  return (
    <section className="section-wrapper" id="education">
      <RevealOnScroll animation="fade-up">
        <SectionLabel
          number="05"
          title="EDUCATION"
          mainHeading="Where I studied and what I earned."
        />
      </RevealOnScroll>

      <div className="education-grid">
        {portfolioData.education.map((edu, idx) => (
          <RevealOnScroll key={edu.id} animation="fade-up" delay={150 * (idx + 1)}>
            <div className="edu-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className="edu-icon-badge">
                  <GraduationCap size={22} />
                </div>
                {edu.score && (
                  <span className="bento-pill" style={{ background: 'rgba(249, 115, 22, 0.15)', color: 'var(--accent-warm)', borderColor: 'rgba(249, 115, 22, 0.3)', fontWeight: '700', fontSize: '0.8rem' }}>
                    <Award size={13} style={{ display: 'inline', marginRight: '4px' }} />
                    {edu.score}
                  </span>
                )}
              </div>
              <div className="edu-years">{edu.period}</div>
              <h3 className="edu-institution">{edu.institution}</h3>
              <div className="edu-location">{edu.location}</div>
              <div className="edu-degree">{edu.degree}</div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem', lineHeight: '1.5' }}>
                {edu.details}
              </p>
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
};

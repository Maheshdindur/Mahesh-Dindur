import React from 'react';
import { Briefcase, ExternalLink, Calendar, MapPin, CheckCircle2, ShieldCheck } from 'lucide-react';
import { SectionLabel } from './SectionLabel';
import { RevealOnScroll } from './RevealOnScroll';
import { portfolioData } from '../data/portfolioData';

export const Experience = () => {
  return (
    <section className="section-wrapper" id="experience">
      <RevealOnScroll animation="fade-up">
        <SectionLabel
          number="03"
          title="EXPERIENCE"
          mainHeading="Things I've worked on."
        />
      </RevealOnScroll>

      <div className="experience-timeline">
        {portfolioData.experience.map((exp, idx) => (
          <RevealOnScroll key={exp.id} animation="fade-up" delay={150 * (idx + 1)}>
            <div className="timeline-item">
              <div className="timeline-marker">
                <Briefcase size={16} />
              </div>

              <div className="timeline-card">
                <div className="timeline-header">
                  <div>
                    <h3 className="timeline-role">{exp.role}</h3>
                    <div className="timeline-company">{exp.company}</div>
                  </div>

                  <div className="timeline-meta">
                    <span className="meta-item">
                      <Calendar size={13} />
                      {exp.period}
                    </span>
                    <span className="meta-item">
                      <MapPin size={13} />
                      {exp.location}
                    </span>
                  </div>
                </div>

                <ul className="timeline-bullets">
                  {exp.points.map((pt, pIdx) => (
                    <li key={pIdx}>
                      <CheckCircle2 size={15} className="bullet-icon" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>

                {exp.linkText && (
                  exp.linkUrl ? (
                    <a
                      href={exp.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="timeline-link"
                    >
                      <span>{exp.linkText}</span>
                      <ExternalLink size={14} />
                    </a>
                  ) : (
                    <div className="timeline-link" style={{ cursor: 'default', color: '#f87171' }}>
                      <ShieldCheck size={14} />
                      <span>{exp.linkText}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
};

import React from 'react';
import { SectionLabel } from './SectionLabel';
import { RevealOnScroll } from './RevealOnScroll';
import { portfolioData } from '../data/portfolioData';

export const Skills = () => {
  return (
    <section className="section-wrapper skills-container-relative" id="skills">
      <div className="skills-bg-watermark">
        TensorFlow · LangGraph · PyTorch · OpenCV · Generative AI
      </div>

      <RevealOnScroll animation="fade-up">
        <SectionLabel
          number="02"
          title="SKILLS"
          mainHeading="Tools I reach for on Monday morning."
        />
      </RevealOnScroll>

      <div className="skills-grid">
        {portfolioData.skills.map((group, idx) => (
          <RevealOnScroll key={group.id} animation="fade-up" delay={150 * (idx + 1)}>
            <div className="skill-card">
              <div className="skill-card-num">
                <span>{group.id} / {group.total}</span>
                {group.id === "01" && <span className="skill-dot-warm"></span>}
                {group.id === "02" && <span className="skill-dot-cool"></span>}
                {group.id === "03" && <span className="skill-dot-warm"></span>}
              </div>
              <h3 className="skill-category-title">{group.category}</h3>
              <div className="skill-tags-wrapper">
                {group.skills.map((skill, sIdx) => (
                  <span key={sIdx} className="skill-pill">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
};

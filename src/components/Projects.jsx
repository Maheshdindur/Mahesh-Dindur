import React, { useState } from 'react';
import { ArrowUpRight, Star, Lock } from 'lucide-react';
import { SectionLabel } from './SectionLabel';
import { RevealOnScroll } from './RevealOnScroll';
import { portfolioData } from '../data/portfolioData';

export const Projects = ({ onSelectProject }) => {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Agentic AI & ML', 'Computer Vision', 'Full Stack & Web'];

  const filteredProjects = activeCategory === 'All'
    ? portfolioData.projects
    : portfolioData.projects.filter((p) => p.category === activeCategory);

  return (
    <section className="section-wrapper" id="projects">
      <RevealOnScroll animation="fade-up">
        <SectionLabel
          number="04"
          title="PROJECTS"
          mainHeading="Selected work — from agentic AI to computer vision."
        />
      </RevealOnScroll>

      <RevealOnScroll animation="fade-up" delay={100}>
        <div className="projects-filter-bar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </RevealOnScroll>

      <div className="bento-grid">
        {filteredProjects.map((project, idx) => {
          let bentoClass = 'bento-card';
          if (project.featured && idx === 0) bentoClass += ' featured-large';
          else if (project.featured && idx === 1) bentoClass += ' featured-medium';

          const isDairyMitra = project.id === 'dairy-mitra';

          return (
            <RevealOnScroll key={project.id} animation="scale" delay={(idx % 3) * 120}>
              <div
                className={bentoClass}
                onClick={() => onSelectProject(project)}
              >
                {project.featured && <div className="bento-card-bg-graphic" />}

                <div className="bento-header">
                  <div className="bento-tag">
                    {project.featured ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Star size={12} fill="var(--accent-warm)" color="var(--accent-warm)" />
                        FEATURED {project.year}
                      </span>
                    ) : (
                      <span>{project.year}</span>
                    )}
                  </div>
                  <div className="bento-arrow-icon" style={{ borderColor: isDairyMitra ? 'rgba(239, 68, 68, 0.4)' : undefined }}>
                    {isDairyMitra ? <Lock size={15} style={{ color: '#ef4444' }} /> : <ArrowUpRight size={18} />}
                  </div>
                </div>

                <div>
                  <h3 className="bento-title">{project.title}</h3>
                  <p className="bento-desc">{project.shortDesc}</p>
                </div>

                <div className="bento-footer-pills">
                  {project.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="bento-pill">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </RevealOnScroll>
          );
        })}
      </div>
    </section>
  );
};

import React from 'react';
import { X, ExternalLink, Github, Sparkles, CheckCircle2, Lock, GitPullRequest } from 'lucide-react';

export const ProjectModal = ({ project, onClose }) => {
  if (!project) return null;

  const isDairyMitra = project.id === 'dairy-mitra' || project.isPrivateNDA;
  const isCareerWise = project.id === 'careerwise';
  const hasLinks = Boolean(project.githubUrl || project.liveUrl);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <span className="bento-pill" style={{ background: 'rgba(249, 115, 22, 0.15)', color: 'var(--accent-warm)', borderColor: 'rgba(249, 115, 22, 0.3)' }}>
            {project.category}
          </span>
          <span className="bento-pill">{project.year}</span>
          {isDairyMitra && (
            <span className="bento-pill" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
              🔒 Client NDA
            </span>
          )}
        </div>

        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--text-main)' }}>
          {project.title}
        </h2>

        <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1.5rem' }}>
          {project.fullDesc || project.shortDesc}
        </p>

        {project.highlights && project.highlights.length > 0 && (
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '1.25rem', marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--accent-warm)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={16} />
              <span>Key Technical Highlights</span>
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {project.highlights.map((item, idx) => (
                <li key={idx} style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={14} style={{ color: 'var(--accent-teal)' }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>TECH STACK</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {project.tags.map((t, idx) => (
              <span key={idx} className="bento-pill" style={{ background: 'rgba(255, 255, 255, 0.07)', fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons Footer */}
        {(isDairyMitra || hasLinks) && (
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
            {isDairyMitra ? (
              <div style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)', color: '#f87171', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                <Lock size={14} />
                <span>Private Client Application — Source Code & Demo Protected Under Client NDA</span>
              </div>
            ) : isCareerWise ? (
              <a href={project.githubUrl || "https://github.com/ed-donner/agents/pull/485"} target="_blank" rel="noopener noreferrer" className="btn-primary">
                <GitPullRequest size={16} />
                <span>View PR #485</span>
              </a>
            ) : (
              <>
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                    <Github size={16} />
                    <span>GitHub Repository</span>
                  </a>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                    <span>View Demo</span>
                    <ExternalLink size={16} />
                  </a>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

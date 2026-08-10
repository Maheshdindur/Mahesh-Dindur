import React, { useState } from 'react';
import { Award, Eye, X } from 'lucide-react';
import { SectionLabel } from './SectionLabel';
import { RevealOnScroll } from './RevealOnScroll';
import { portfolioData } from '../data/portfolioData';

export const Certifications = () => {
  const [selectedCert, setSelectedCert] = useState(null);

  return (
    <section className="section-wrapper" id="certifications">
      <RevealOnScroll animation="fade-up">
        <SectionLabel
          number="06"
          title="CERTIFICATIONS"
          mainHeading="Continuous learning & credentials."
        />
      </RevealOnScroll>

      <div className="certs-grid">
        {portfolioData.certifications.map((cert, idx) => (
          <RevealOnScroll key={cert.id || idx} animation="scale" delay={120 * (idx + 1)}>
            <div
              className="cert-card"
              style={{ cursor: cert.imageUrl ? 'pointer' : 'default' }}
              onClick={() => cert.imageUrl && setSelectedCert(cert)}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-warm)' }}>
                  <Award size={20} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-dim)' }}>{cert.year}</span>
                </div>
                {cert.imageUrl && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--accent-teal)', fontFamily: 'var(--font-mono)' }}>
                    <Eye size={14} /> View
                  </span>
                )}
              </div>

              <h3 className="cert-title">{cert.title}</h3>
              <div className="cert-issuer">{cert.issuer}</div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {cert.skills.map((s, sIdx) => (
                  <span key={sIdx} className="bento-pill">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </RevealOnScroll>
        ))}
      </div>

      {/* Certificate Lightbox Modal */}
      {selectedCert && (
        <div className="modal-overlay" onClick={() => setSelectedCert(null)}>
          <div className="modal-content" style={{ maxWidth: '800px' }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedCert(null)}>
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Award size={22} style={{ color: 'var(--accent-warm)' }} />
              <h3 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--text-main)' }}>{selectedCert.title}</h3>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem', fontFamily: 'var(--font-mono)' }}>
              Issued by {selectedCert.issuer} · {selectedCert.year}
            </p>

            <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-subtle)', background: '#000' }}>
              <img
                src={selectedCert.imageUrl}
                alt={selectedCert.title}
                style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '70vh', objectFit: 'contain' }}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

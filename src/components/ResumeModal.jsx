import React from 'react';
import { X, Download, FileText, ExternalLink } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export const ResumeModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const pdfUrl = '/Mahesh_Dindur_Resume.pdf';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '900px', width: '92vw' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <FileText size={28} style={{ color: 'var(--accent-warm)' }} />
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--text-main)' }}>Mahesh Dindur — Resume</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>B.E. Computer Science Engineering · KLE Tech University</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
            >
              <ExternalLink size={14} />
              <span>Open PDF</span>
            </a>
            <a
              href={pdfUrl}
              download="Mahesh_Dindur_Resume.pdf"
              className="btn-primary"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
            >
              <Download size={14} />
              <span>Download CV</span>
            </a>
          </div>
        </div>

        {/* Embedded PDF Viewer */}
        <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-subtle)', background: '#1e2029', height: '70vh', minHeight: '480px' }}>
          <iframe
            src={`${pdfUrl}#toolbar=0`}
            title="Mahesh Dindur Resume PDF"
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        </div>
      </div>
    </div>
  );
};

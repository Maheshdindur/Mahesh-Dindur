import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, Music, Volume2, VolumeX } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export const Header = ({ onOpenContact, onOpenResume }) => {
  const [time, setTime] = useState('');
  const [isPlayingLofi, setIsPlayingLofi] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      const now = new Date().toLocaleTimeString('en-US', options);
      setTime(now);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleLofi = () => {
    setIsPlayingLofi(!isPlayingLofi);
  };

  return (
    <header className="navbar-header">
      <div className="nav-container">
        <a href="#" className="brand-logo">
          <div className="brand-avatar">MD</div>
          <div className="brand-info">
            <span className="brand-name">{portfolioData.personal.name}</span>
            <span className="brand-subtitle">{portfolioData.personal.title}</span>
          </div>
        </a>

        {/* Live IST Clock & Lofi Widget */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.03)', padding: '0.35rem 0.85rem', borderRadius: '9999px', border: '1px solid var(--border-subtle)' }}>
          <span style={{ color: 'var(--accent-teal)' }}>{time || '12:00:00'} IST</span>
          <span>•</span>
          <button
            onClick={toggleLofi}
            style={{ background: 'none', border: 'none', color: isPlayingLofi ? 'var(--accent-warm)' : 'var(--text-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', transition: 'color 0.2s ease' }}
            title="Toggle Lofi Vibe"
          >
            <Music size={13} className={isPlayingLofi ? 'animate-pulse' : ''} />
            <span>{isPlayingLofi ? 'Lofi ON' : 'Lofi'}</span>
          </button>
        </div>

        <ul className="nav-menu">
          <li><a href="#about" className="nav-link">About</a></li>
          <li><a href="#skills" className="nav-link">Skills</a></li>
          <li><a href="#experience" className="nav-link">Experience</a></li>
          <li><a href="#projects" className="nav-link">Projects</a></li>
          <li><a href="#education" className="nav-link">Education</a></li>
          <li><a href="#contact" className="nav-link">Contact</a></li>
        </ul>

        <div className="nav-actions">
          <a
            href={portfolioData.personal.github}
            target="_blank"
            rel="noopener noreferrer"
            className="icon-btn"
            title="GitHub Profile"
          >
            <Github size={18} />
          </a>
          <a
            href={portfolioData.personal.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="icon-btn"
            title="LinkedIn Profile"
          >
            <Linkedin size={18} />
          </a>
          <button
            onClick={onOpenContact}
            className="btn-say-hi"
          >
            <span>Say hi</span>
            <Mail size={15} />
          </button>
        </div>
      </div>
    </header>
  );
};

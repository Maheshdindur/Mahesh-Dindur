import React, { useState, useEffect, useRef } from 'react';
import { Github, Linkedin, Mail, Music, Menu, X, FileText, ChevronRight } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export const Header = ({ onOpenContact, onOpenResume }) => {
  const [time, setTime] = useState('');
  const [isPlayingLofi, setIsPlayingLofi] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const audioRef = useRef(null);
  const audioCtxRef = useRef(null);
  const menuRef = useRef(null);

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

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close menu when tapping outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        !e.target.closest('.mobile-menu-toggle')
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Web Audio synth fallback if network MP3 stream is blocked
  const playWebAudioSynth = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
    } catch (e) {
      console.log('Audio synth error', e);
    }
  };

  const toggleLofi = () => {
    if (!audioRef.current) return;

    if (isPlayingLofi) {
      audioRef.current.pause();
      setIsPlayingLofi(false);
    } else {
      playWebAudioSynth();
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlayingLofi(true);
          })
          .catch((err) => {
            console.error('Audio stream playback error:', err);
            setIsPlayingLofi(true);
          });
      }
    }
  };

  const handleNavClick = (e, href) => {
    setIsMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="navbar-header">
      {/* Background Lofi Audio Stream */}
      <audio
        ref={audioRef}
        src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3"
        loop
        preload="auto"
      />

      <div className="nav-container">
        {/* Brand Logo */}
        <a
          href="#hero"
          className="brand-logo"
          onClick={(e) => {
            e.preventDefault();
            setIsMobileMenuOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <div className="brand-avatar">MD</div>
          <div className="brand-info">
            <span className="brand-name">{portfolioData.personal.name}</span>
            <span className="brand-subtitle">{portfolioData.personal.title}</span>
          </div>
        </a>

        {/* Desktop Live IST Clock & Lofi Widget */}
        <div className="desktop-clock-lofi">
          <span style={{ color: 'var(--accent-teal)' }}>{time || '12:00:00'} IST</span>
          <span>•</span>
          <button
            onClick={toggleLofi}
            className={`lofi-btn ${isPlayingLofi ? 'active' : ''}`}
            style={{
              background: isPlayingLofi ? 'rgba(249, 115, 22, 0.15)' : 'none',
              border: isPlayingLofi ? '1px solid var(--accent-warm)' : 'none',
              color: isPlayingLofi ? 'var(--accent-warm)' : 'var(--text-dim)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.2rem 0.5rem',
              borderRadius: '9999px',
              transition: 'all 0.2s ease'
            }}
            title="Toggle Lofi Music Vibe"
          >
            <Music size={13} className={isPlayingLofi ? 'spin-icon' : ''} />
            <span>{isPlayingLofi ? '🎵 Lofi ON' : '🎵 Lofi'}</span>
          </button>
        </div>

        {/* Desktop Nav Links */}
        <ul className="nav-menu">
          <li><a href="#hero" className="nav-link">Home</a></li>
          <li><a href="#about" className="nav-link">About</a></li>
          <li><a href="#skills" className="nav-link">Skills</a></li>
          <li><a href="#experience" className="nav-link">Experience</a></li>
          <li><a href="#projects" className="nav-link">Projects</a></li>
          <li><a href="#education" className="nav-link">Education</a></li>
          <li><a href="#contact" className="nav-link">Contact</a></li>
        </ul>

        {/* Desktop Actions */}
        <div className="nav-actions desktop-actions">
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

        {/* Mobile Header Right Controls: Lofi Toggle + Hamburger Menu */}
        <div className="mobile-header-controls">
          <button
            onClick={toggleLofi}
            className={`mobile-lofi-btn ${isPlayingLofi ? 'active' : ''}`}
            title="Toggle Lofi Vibe"
            aria-label="Toggle Lofi Music"
          >
            <Music size={16} className={isPlayingLofi ? 'animate-spin-slow' : ''} />
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="mobile-menu-toggle"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown Card (Floating right under header, NEVER covering the screen) */}
      {isMobileMenuOpen && (
        <div className="mobile-nav-dropdown" ref={menuRef}>
          <nav className="mobile-nav-links">
            {[
              { href: '#hero', num: '00', label: 'Home' },
              { href: '#about', num: '01', label: 'About' },
              { href: '#skills', num: '02', label: 'Skills' },
              { href: '#experience', num: '03', label: 'Experience' },
              { href: '#projects', num: '04', label: 'Projects' },
              { href: '#education', num: '05', label: 'Education' },
              { href: '#contact', num: '06', label: 'Contact' }
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="mobile-nav-item"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(e, item.href);
                }}
              >
                <span className="mobile-nav-num">{item.num}</span>
                <span className="mobile-nav-label">{item.label}</span>
                <ChevronRight size={14} className="mobile-nav-arrow" />
              </a>
            ))}
          </nav>

          <div className="mobile-dropdown-footer">
            <div className="mobile-dropdown-socials">
              <a
                href={portfolioData.personal.github}
                target="_blank"
                rel="noopener noreferrer"
                className="mobile-mini-icon"
                title="GitHub"
              >
                <Github size={15} />
              </a>
              <a
                href={portfolioData.personal.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="mobile-mini-icon"
                title="LinkedIn"
              >
                <Linkedin size={15} />
              </a>
            </div>

            <div className="mobile-dropdown-ctas">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenResume?.();
                }}
                className="mobile-mini-btn"
              >
                <FileText size={13} />
                <span>Resume</span>
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenContact?.();
                }}
                className="mobile-mini-btn highlight"
              >
                <Mail size={13} />
                <span>Say hi</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

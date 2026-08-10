import React, { useState } from 'react';
import { Mail, Github, Linkedin, ArrowUpRight, Send, CheckCircle2, Bell } from 'lucide-react';
import { SectionLabel } from './SectionLabel';
import { RevealOnScroll } from './RevealOnScroll';
import { portfolioData } from '../data/portfolioData';

export const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSending(true);

      const ntfyTopic = 'mahesh_dindur_portfolio_messages';

      try {
        // Send real-time push notification silently to Mahesh via ntfy.sh
        await fetch(`https://ntfy.sh/${ntfyTopic}`, {
          method: 'POST',
          headers: {
            'Title': `New Portfolio Message from ${formData.name}`,
            'Priority': 'high',
            'Tags': 'envelope,briefcase'
          },
          body: `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
        });

      } catch (err) {
        console.error('ntfy send error:', err);
      } finally {
        setSending(false);
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setFormData({ name: '', email: '', message: '' });
        }, 6000);
      }
    }
  };

  return (
    <section className="section-wrapper" id="contact">
      <RevealOnScroll animation="fade-up">
        <SectionLabel number="07" title="CONTACT" />
      </RevealOnScroll>

      <div className="contact-grid">
        <div className="contact-info-col">
          <RevealOnScroll animation="fade-right" delay={150}>
            <h2 className="contact-headline">
              Let's build <br />
              <span className="gradient-text-animated">something warm.</span>
            </h2>

            <p className="contact-subtext">
              I'm actively looking for software / AI engineering roles and open to collaborations. Fastest way to reach me is email — I reply within a day.
            </p>
          </RevealOnScroll>

          <div className="contact-channels-grid">
            <RevealOnScroll animation="fade-up" delay={200}>
              <a href={`mailto:${portfolioData.personal.email}`} className="channel-card">
                <div className="channel-header">
                  <Mail size={18} className="channel-icon" />
                  <ArrowUpRight size={14} style={{ color: 'var(--text-dim)' }} />
                </div>
                <div className="channel-label">EMAIL</div>
                <div className="channel-value">{portfolioData.personal.email}</div>
              </a>
            </RevealOnScroll>

            <RevealOnScroll animation="fade-up" delay={300}>
              <a href={portfolioData.personal.github} target="_blank" rel="noopener noreferrer" className="channel-card">
                <div className="channel-header">
                  <Github size={18} className="channel-icon" />
                  <ArrowUpRight size={14} style={{ color: 'var(--text-dim)' }} />
                </div>
                <div className="channel-label">GITHUB</div>
                <div className="channel-value">{portfolioData.personal.githubHandle}</div>
              </a>
            </RevealOnScroll>

            <RevealOnScroll animation="fade-up" delay={400}>
              <a href={portfolioData.personal.linkedin} target="_blank" rel="noopener noreferrer" className="channel-card">
                <div className="channel-header">
                  <Linkedin size={18} className="channel-icon" />
                  <ArrowUpRight size={14} style={{ color: 'var(--text-dim)' }} />
                </div>
                <div className="channel-label">LINKEDIN</div>
                <div className="channel-value">{portfolioData.personal.linkedinHandle}</div>
              </a>
            </RevealOnScroll>
          </div>

          <RevealOnScroll animation="fade-up" delay={450}>
            <div className="off-hours-card">
              <div>
                <div className="off-hours-label">OFF-HOURS</div>
                <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-main)' }}>
                  A few things I keep coming back to
                </div>
              </div>

              <div className="off-hours-badges">
                {portfolioData.offHours.map((item, idx) => (
                  <span key={idx} className="off-badge">
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </span>
                ))}
              </div>
            </div>
          </RevealOnScroll>
        </div>

        <RevealOnScroll animation="fade-left" delay={250}>
          <div className="contact-form-container">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 className="contact-form-title" style={{ marginBottom: 0 }}>Send a message directly</h3>
              <span className="bento-pill" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Bell size={12} /> ntfy Instant Alerts
              </span>
            </div>
            
            {submitted ? (
              <div style={{ padding: '2rem', textAlign: 'center', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '16px', color: '#10b981' }}>
                <CheckCircle2 size={40} style={{ margin: '0 auto 1rem auto', display: 'block' }} />
                <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#ffffff' }}>Message Sent!</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  The King in the North sends his regards! An instant notification has been pushed directly to Mahesh's phone.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">YOUR NAME</label>
                  <input
                    type="text"
                    required
                    placeholder="Jon Snow"
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">YOUR EMAIL</label>
                  <input
                    type="email"
                    required
                    placeholder="kingin.thenorth@castleblack.got"
                    className="form-input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">YOUR MESSAGE</label>
                  <textarea
                    required
                    placeholder="I know nothing... except that winter is coming for great software. Let's build something epic..."
                    className="form-textarea"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button type="submit" disabled={sending} className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem', opacity: sending ? 0.7 : 1 }}>
                  <span>{sending ? 'Sending via ntfy...' : 'Send Message'}</span>
                  <Send size={16} />
                </button>
              </form>
            )}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};

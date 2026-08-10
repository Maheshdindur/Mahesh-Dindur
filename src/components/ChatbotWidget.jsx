import React, { useState, useRef, useEffect } from 'react';
import { Bot, MessageSquare, X, Send, Sparkles, User, Briefcase, RefreshCw, CheckCircle2 } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Hi there! 👋 I'm Mahesh Dindur's AI Assistant. Ask me anything about Mahesh's AI engineering background, Scaler AI Labs internship, Flutter apps, or job opportunities!"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecruiterMode, setIsRecruiterMode] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const quickPrompts = [
    "Tell me about Mahesh",
    "What AI projects has he built?",
    "Tell me about Scaler AI Labs QA internship",
    "Are you open to full-time roles?"
  ];

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMessage = { sender: 'user', text: query };
    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setLoading(true);

    // Check recruiter intent on client as well for badge
    const queryLower = query.lower ? query.lower() : query.toLowerCase();
    if (["hiring", "interview", "recruiter", "job role", "full time", "open position"].some(k => queryLower.includes(k))) {
      setIsRecruiterMode(true);
    }

    try {
      // Call Vercel Serverless Function / API
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages
        })
      });

      if (res.ok) {
        const data = await res.json();
        simulateTokenStream(data.reply || "I'm Mahesh's AI assistant! How can I help you today?");
      } else {
        // Fallback local response generator if running dev server without serverless API
        simulateLocalFallbackResponse(query);
      }
    } catch (err) {
      console.warn("API stream error, using local fallback engine:", err);
      simulateLocalFallbackResponse(query);
    } finally {
      setLoading(false);
    }
  };

  const simulateTokenStream = (fullReply) => {
    let currentText = '';
    const words = fullReply.split(' ');
    let wordIndex = 0;

    // Add empty AI message
    setMessages((prev) => [...prev, { sender: 'ai', text: '' }]);

    const interval = setInterval(() => {
      if (wordIndex < words.length) {
        currentText += (wordIndex === 0 ? '' : ' ') + words[wordIndex];
        const updatedText = currentText;
        setMessages((prev) => {
          const newArray = [...prev];
          newArray[newArray.length - 1] = { sender: 'ai', text: updatedText };
          return newArray;
        });
        wordIndex++;
      } else {
        clearInterval(interval);
      }
    }, 40); // 40ms per word streaming effect
  };

  const simulateLocalFallbackResponse = (userMsg) => {
    const lower = userMsg.toLowerCase();
    let reply = "Mahesh Dindur is a Computer Science graduate from KLE Technological University (7.95 CGPA). He builds intelligent AI microservices, Flutter mobile apps, and worked as a QA Intern at Scaler AI Labs auditing LLM training data for OpenAI & xAI.";

    if (lower.includes("scaler") || lower.includes("qa")) {
      reply = "At Scaler AI Labs (March–June 2024, Bengaluru Onsite), Mahesh audited vendor training datasets for tier-1 AI models (OpenAI, xAI). He performed output quality analysis, evaluated edge cases, and collaborated with Strategy & Ops teams.";
    } else if (lower.includes("project") || lower.includes("argus") || lower.includes("careerwise") || lower.includes("story")) {
      reply = "Mahesh has shipped 9+ projects! Key highlights include CareerWise (merged into Ed Donner's 250k+ student repo PR #485), Argus (GitHub Actions AI security bot), fine-tuned Gemma 3B Story Generator, and Face Auth with 128-D FaceNet embeddings.";
    } else if (lower.includes("hire") || lower.includes("role") || lower.includes("job") || lower.includes("interview") || lower.includes("recruiter")) {
      reply = "Mahesh is actively seeking full-time Software Engineering, AI/ML, and QA roles! He is based in Karnataka / Bengaluru and ready to start immediately. Feel free to leave your contact details or email him at maheshdindur9740@gmail.com!";
      setIsRecruiterMode(true);
    } else if (lower.includes("skill") || lower.includes("stack") || lower.includes("python") || lower.includes("flutter")) {
      reply = "Mahesh's core tech stack includes Python, Flutter/Dart, FastAPI, LangGraph, RAG, LLM Evals, TensorFlow, PyTorch, OpenCV, Docker, C++, and SQL.";
    } else if (lower.includes("dairy mitra")) {
      reply = "Dairy Mitra is a cross-platform Flutter mobile app Mahesh built for a private client. It digitizes cattle health logs, milk yield analytics, and breeding schedules using an offline-first SQLite database architecture under Client NDA.";
    }

    simulateTokenStream(reply);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        className="chatbot-fab"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Mahesh AI Chatbot"
      >
        <div className="fab-avatar-badge">
          <Bot size={22} style={{ color: '#ffffff' }} />
          <span className="fab-online-dot" />
        </div>
        <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Ask Mahesh AI</span>
        <Sparkles size={16} style={{ color: 'var(--accent-warm)' }} />
      </button>

      {/* Chat Window Popup */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ position: 'relative' }}>
                <img
                  src={portfolioData.personal.photoUrl}
                  alt="Mahesh Dindur"
                  style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-warm)' }}
                />
                <span className="fab-online-dot" style={{ right: 0, bottom: 0 }} />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>Mahesh AI Twin</span>
                  <span className="bento-pill" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>V1.0</span>
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                  {isRecruiterMode ? '💼 Recruiter Lead Mode Active' : 'Online · Grounded Portfolio AI'}
                </p>
              </div>
            </div>

            <button className="modal-close-btn" onClick={() => setIsOpen(false)} style={{ position: 'static' }}>
              <X size={18} />
            </button>
          </div>

          {/* Recruiter Banner if active */}
          {isRecruiterMode && (
            <div style={{ background: 'rgba(249, 115, 22, 0.12)', borderBottom: '1px solid rgba(249, 115, 22, 0.25)', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--accent-warm)' }}>
              <Briefcase size={14} />
              <span>Recruiter Lead Mode — Share your Name & Contact for priority response!</span>
            </div>
          )}

          {/* Message List */}
          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`chat-bubble-wrapper ${msg.sender === 'user' ? 'user-msg' : 'ai-msg'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="chat-avatar-mini">
                    <Bot size={14} />
                  </div>
                )}

                <div className={`chat-bubble ${msg.sender === 'user' ? 'bubble-user' : 'bubble-ai'}`}>
                  {msg.text || (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                      <RefreshCw size={12} className="spin-icon" /> Thinking...
                    </span>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="chatbot-quick-prompts">
            {quickPrompts.map((prompt, pIdx) => (
              <button
                key={pIdx}
                className="quick-prompt-btn"
                onClick={() => handleSend(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="chatbot-input-form"
          >
            <input
              type="text"
              placeholder="Ask about Mahesh's skills, projects, or roles..."
              className="chatbot-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" disabled={!input.trim() || loading} className="chatbot-send-btn">
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

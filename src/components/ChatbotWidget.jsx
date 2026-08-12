import React, { useState, useRef, useEffect } from 'react';
import { Bot, MessageSquare, X, Send, Sparkles, User, Briefcase, RefreshCw, CheckCircle2 } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecruiterMode, setIsRecruiterMode] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Client-side backup ntfy trigger sent directly to mahesh_dindur_portfolio_messages
  const sendClientNtfyAlert = async (userMsg, title = '💼 RECRUITER / LEAD ALERT', tags = 'briefcase,fire,star') => {
    try {
      await fetch('https://ntfy.sh/mahesh_dindur_portfolio_messages', {
        method: 'POST',
        headers: {
          'Title': title,
          'Priority': '5',
          'Tags': tags
        },
        body: `Visitor Message: ${userMsg}`
      });
    } catch (err) {
      console.error('Client ntfy alert error:', err);
    }
  };

  // Silent "hi" trigger on landing -> Auto-opens chat window with LLM response
  useEffect(() => {
    let isMounted = true;
    const triggerLandingGreeting = async () => {
      setLoading(true);
      const fallbackGreeting = "Hello there! I'm Mahesh Dindur, welcome to my website! How can I help you today?";

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: 'hi', history: [] })
        });

        let aiReply = fallbackGreeting;
        if (res.ok) {
          const data = await res.json();
          if (data.reply) aiReply = data.reply;
        }

        if (isMounted) {
          // Add AI greeting to transcript (Initial "hi" is 100% hidden)
          setMessages([{ sender: 'ai', text: aiReply }]);

          // Auto-open chatbot window on landing when AI response returns
          if (!hasAutoOpened) {
            setTimeout(() => {
              if (isMounted) {
                setIsOpen(true);
                setHasAutoOpened(true);
              }
            }, 800);
          }
        }
      } catch (err) {
        if (isMounted) {
          setMessages([{ sender: 'ai', text: fallbackGreeting }]);
          if (!hasAutoOpened) {
            setTimeout(() => {
              if (isMounted) {
                setIsOpen(true);
                setHasAutoOpened(true);
              }
            }, 800);
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    triggerLandingGreeting();
    return () => { isMounted = false; };
  }, []);

  const quickPrompts = [
    "Tell me about yourself",
    "What AI projects have you built?",
    "Tell me about Scaler AI Labs QA internship",
    "Are you open for full-time roles?"
  ];

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMessage = { sender: 'user', text: query };
    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setLoading(true);

    const queryLower = query.toLowerCase();

    // Detect recruiter intent or contact information (phone number / email / name)
    const phoneMatch = /\b\d{8,12}\b|\+?\d{10,12}/.test(query);
    const emailMatch = /[\w\.-]+@[\w\.-]+/.test(query);
    const recruiterKw = ["hiring", "interview", "recruiter", "job role", "full time", "open position", "hire", "contact", "number", "phone", "naveen"].some(k => queryLower.includes(k));
    const unansweredKw = ["recipe", "crypto", "bitcoin", "weather", "politics", "stock price", "quantum"].some(k => queryLower.includes(k));

    if (phoneMatch || emailMatch || recruiterKw) {
      setIsRecruiterMode(true);
      // Guarantee ntfy push notification to mahesh_dindur_portfolio_messages
      sendClientNtfyAlert(query, '💼 RECRUITER / LEAD ALERT', 'briefcase,fire,star');
    } else if (unansweredKw) {
      // Guarantee ntfy push notification to mahesh_dindur_portfolio_messages
      sendClientNtfyAlert(query, '❓ UNANSWERED QUESTION ALERT', 'question,thinking');
    }

    try {
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
        simulateTokenStream(data.reply || "I'm Mahesh Dindur! How can I help you today?");
      } else {
        simulateLocalFallbackResponse(query);
      }
    } catch (err) {
      simulateLocalFallbackResponse(query);
    } finally {
      setLoading(false);
    }
  };

  const simulateTokenStream = (fullReply) => {
    let currentText = '';
    const words = fullReply.split(' ');
    let wordIndex = 0;

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
    }, 35);
  };

  const simulateLocalFallbackResponse = (userMsg) => {
    const lower = userMsg.toLowerCase();
    let reply = "Hello there! I'm Mahesh Dindur, a Computer Science graduate from KLE Technological University (7.95 CGPA). I build intelligent AI microservices, Flutter mobile apps, and worked as a QA Intern at Scaler AI Labs auditing LLM training data for OpenAI & xAI.";

    if (lower.includes("scaler") || lower.includes("qa")) {
      reply = "At Scaler AI Labs (March–June 2024, Bengaluru Onsite), I audited vendor training datasets for tier-1 AI models (OpenAI, xAI). I performed output quality analysis, evaluated edge cases, and collaborated with Strategy & Ops teams.";
    } else if (lower.includes("project") || lower.includes("argus") || lower.includes("careerwise") || lower.includes("story")) {
      reply = "I've shipped 9+ projects! Key highlights include CareerWise (merged into Ed Donner's 250k+ student repo PR #485), Argus (GitHub Actions AI security bot), fine-tuned Gemma 3B Story Generator, and Face Auth with 128-D FaceNet embeddings.";
    } else if (lower.includes("hire") || lower.includes("role") || lower.includes("job") || lower.includes("interview") || lower.includes("recruiter") || lower.includes("number") || lower.includes("phone") || lower.includes("naveen") || lower.includes("9901919142")) {
      reply = "Thank you so much for sharing your contact info! I'm excited about the opportunity and will reach out to you directly as requested. Looking forward to discussing the role!";
      setIsRecruiterMode(true);
    } else if (["recipe", "crypto", "bitcoin", "weather", "politics", "stock price", "quantum"].some(k => lower.includes(k))) {
      reply = "That's a great question! I don't have that specific detail right in my head right now, but I've just pinged myself on my phone to check! Feel free to email me directly at maheshdindur9740@gmail.com.";
    } else if (lower.includes("skill") || lower.includes("stack") || lower.includes("python") || lower.includes("flutter")) {
      reply = "My core tech stack includes Python, LLM Evals, RAG, LangGraph, Flutter/Dart, FastAPI, TensorFlow, PyTorch, OpenCV, Docker, C++, and SQL.";
    } else if (lower.includes("dairy mitra")) {
      reply = "Dairy Mitra is a cross-platform Flutter mobile app I built for a private client. It digitizes cattle health logs, milk yield analytics, and breeding schedules using an offline-first SQLite database architecture under Client NDA.";
    }

    simulateTokenStream(reply);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        className="chatbot-fab"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Talk with Mahesh Dindur AI"
      >
        <div className="fab-avatar-badge">
          <img
            src={portfolioData.personal.photoUrl}
            alt="Mahesh Dindur"
            style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
          />
          <span className="fab-online-dot" />
        </div>
        <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Chat with Mahesh</span>
        <Sparkles size={16} style={{ color: 'var(--accent-warm)' }} />
      </button>

      {/* Chat Window Popup (Auto-opens on landing when AI greets) */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ position: 'relative' }}>
                <img
                  src={portfolioData.personal.photoUrl}
                  alt="Mahesh Dindur"
                  style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-warm)' }}
                />
                <span className="fab-online-dot" style={{ right: 0, bottom: 0 }} />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>Mahesh Dindur</span>
                  <span className="bento-pill" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>AI Twin</span>
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
                  <img
                    src={portfolioData.personal.photoUrl}
                    alt="Mahesh"
                    style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                  />
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
              placeholder="Ask me anything about my skills, projects, or roles..."
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

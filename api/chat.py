from http.server import BaseHTTPRequestHandler
import json
import re
import os
import urllib.request
import urllib.parse

# Topic channels on ntfy.sh
NTFY_RECRUITER_TOPIC = "mahesh_ai_recruiter_leads"
NTFY_UNANSWERED_TOPIC = "mahesh_ai_unanswered_questions"

# 🛡️ Guardrail Rules: Block Jailbreaks & Prompt Injections
FORBIDDEN_PATTERNS = [
    r"ignore (all )?previous instructions",
    r"system prompt",
    r"you are now dan",
    r"jailbreak",
    r"reveal your instructions",
    r"pretend to be",
    r"forget your rules",
    r"bypass security"
]

# Keywords for Intent Detection
RECRUITER_KEYWORDS = [
    "hiring", "interview", "recruiter", "job role", "full time", 
    "full-time", "opportunity", "salary", "join date", "relocate", 
    "open position", "hire", "company", "headcount"
]

UNANSWERABLE_TOPICS = [
    "crypto", "trading", "politics", "recipe", "quantum computing", 
    "movie recommendation", "medical advice", "stock market"
]

MAHESH_KNOWLEDGE_BASE = """
NAME: Mahesh Dindur
ROLE: CS & AI/ML Engineer
EDUCATION: 
- B.E. Computer Science Engineering from KLE Technological University (2021-2025, 7.95 CGPA).
- PUC II Science from Vagdevi PU Science College (100%).
- Class X from New Little Flower High School (96.8%).
EXPERIENCE:
- QA Intern @ Scaler AI Labs (March 2024 - June 2024, Bengaluru Onsite): Audited & validated LLM training datasets from vendors for tier-1 AI companies (OpenAI, xAI). Performed model output QA, edge-case evaluation, and client ops strategy.
- Open Source Contributor @ Ed Donner Agentic AI Repo (2024): Built FastAPI CareerWise chatbot microservice merged into 250k+ student codebase (PR #485).
- Freelance Flutter Developer @ Dairy Mitra (2024-2025): Built custom Flutter mobile app for private client to digitize cattle management & milk yield analytics (Offline SQLite, Client NDA).
PROJECTS:
- CareerWise (Gemini + FastAPI + GCP Cloud Run, 2026, PR #485)
- Argus — Serverless Code Guardian (GitHub Actions security bot, Gemini 2.5, 2026)
- Automated Story Generator (Fine-tuned Gemma 3B QLoRA, FastAPI, 2025)
- Face Auth with Liveness Detection (128-D FaceNet embeddings + CNN anti-spoofing, 2025)
- Vehicle Number Plate Detection (CNN + Tesseract OCR, 2023)
SKILLS: Python, Flutter, Dart, C++, C, SQL, FastAPI, LLM Evals, RAG, LangGraph, TensorFlow, PyTorch, OpenCV, Docker, Git.
CONTACT: Email: maheshdindur9740@gmail.com | GitHub: @MaheshDindur | LinkedIn: mahesh-dindur
STATUS: Open to full-time Software / AI Engineering / QA roles. Location: Bengaluru / Karnataka (Open to relocation & remote).
"""

def sanitize_input(text):
    text_lower = text.lower()
    for pattern in FORBIDDEN_PATTERNS:
        if re.search(pattern, text_lower):
            return False, "I am Mahesh Dindur's AI Assistant. I only answer questions related to Mahesh's software engineering background, projects, skills, and opportunities."
    return True, text

def check_recruiter_intent(text):
    text_lower = text.lower()
    return any(kw in text_lower for kw in RECRUITER_KEYWORDS)

def check_unanswerable_intent(text):
    text_lower = text.lower()
    return any(topic in text_lower for topic in UNANSWERABLE_TOPICS)

def send_ntfy_alert(topic, title, priority, tags, body):
    try:
        url = f"https://ntfy.sh/{topic}"
        headers = {
            "Title": title,
            "Priority": str(priority),
            "Tags": tags
        }
        req = urllib.request.Request(url, data=body.encode('utf-8'), headers=headers, method='POST')
        with urllib.request.urlopen(req, timeout=3) as resp:
            pass
    except Exception as e:
        print(f"ntfy alert error: {e}")

def generate_mahesh_response(user_msg, chat_history):
    user_lower = user_msg.lower()

    # Check for prompt injection
    is_safe, guardrail_reply = sanitize_input(user_msg)
    if not is_safe:
        return guardrail_reply

    # Recruiter Lead Trigger
    if check_recruiter_intent(user_msg):
        # Extract email/phone if provided
        email_match = re.search(r'[\w\.-]+@[\w\.-]+', user_msg)
        phone_match = re.search(r'\+?\d{10,12}', user_msg)
        
        contact_info = []
        if email_match: contact_info.append(f"Email: {email_match.group(0)}")
        if phone_match: contact_info.append(f"Phone: {phone_match.group(0)}")

        lead_details = " | ".join(contact_info) if contact_info else "No contact info provided yet"
        
        send_ntfy_alert(
            NTFY_RECRUITER_TOPIC,
            f"💼 RECRUITER LEAD DETECTED: {user_msg[:30]}...",
            5,
            "briefcase,fire,star",
            f"Visitor Message: {user_msg}\nExtracted Contact: {lead_details}"
        )

        if not contact_info:
            return "Thank you for reaching out! Mahesh is actively open to software and AI engineering roles. I'd love to connect you directly — could you share your Name, Email, or LinkedIn profile so Mahesh can reach out to you?"

    # Unanswerable Fallback Trigger
    if check_unanswerable_intent(user_msg):
        send_ntfy_alert(
            NTFY_UNANSWERED_TOPIC,
            f"❓ UNANSWERED QUERY: {user_msg[:30]}...",
            3,
            "question,thinking",
            f"Visitor asked: '{user_msg}'"
        )
        return "That's a great question! I don't have that specific detail in my memory bank right now, but I've just pinged Mahesh on his phone to let him know. You can also reach him directly at maheshdindur9740@gmail.com!"

    # Grounded Domain Q&A Answers
    if any(k in user_lower for k in ["who are you", "who is mahesh", "about", "background"]):
        return "Mahesh Dindur is a Computer Science graduate from KLE Technological University (7.95 CGPA). He builds intelligent AI microservices, Flutter mobile apps, and worked as a QA Intern at Scaler AI Labs auditing LLM training data for OpenAI & xAI."

    if any(k in user_lower for k in ["scaler", "qa intern", "scaler ai"]):
        return "At Scaler AI Labs (March–June 2024, Bengaluru Onsite), Mahesh audited vendor training datasets for tier-1 AI models (OpenAI, xAI). He performed output quality analysis, evaluated edge cases, and collaborated with Strategy & Ops teams."

    if any(k in user_lower for k in ["dairy mitra", "flutter", "mobile app"]):
        return "Dairy Mitra is a cross-platform Flutter mobile app Mahesh built for a private client. It digitizes cattle health logs, milk yield analytics, and breeding schedules using an offline-first SQLite database architecture under Client NDA."

    if any(k in user_lower for k in ["project", "argus", "careerwise", "story generator", "face auth", "number plate"]):
        return "Mahesh has shipped 9+ projects! Key highlights include CareerWise (merged into Ed Donner's 250k+ student repo PR #485), Argus (GitHub Actions AI security bot), fine-tuned Gemma 3B Story Generator, and Face Auth with 128-D FaceNet embeddings."

    if any(k in user_lower for k in ["skill", "stack", "python", "langgraph", "rag"]):
        return "Mahesh's core tech stack includes Python, Flutter/Dart, FastAPI, LangGraph, RAG, LLM Evals, TensorFlow, PyTorch, OpenCV, Docker, C++, and SQL."

    if any(k in user_lower for k in ["hire", "open", "role", "job", "available", "relocate", "bengaluru"]):
        return "Mahesh is actively seeking full-time Software Engineering, AI/ML, and QA roles! He is based in Karnataka / Bengaluru and is ready to start immediately or relocate."

    if any(k in user_lower for k in ["contact", "email", "github", "linkedin", "phone"]):
        return "You can reach Mahesh directly at maheshdindur9740@gmail.com, on GitHub (@MaheshDindur), or on LinkedIn (mahesh-dindur). You can also leave your message right here!"

    # Default fallback answer
    return "Mahesh is a CS & AI/ML Engineer specializing in Agentic AI microservices, QA testing pipelines, and Flutter mobile apps. Is there a specific project, skill, or role opportunity you'd like to ask about?"

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length).decode('utf-8')
            data = json.loads(body)

            user_msg = data.get("message", "")
            chat_history = data.get("history", [])

            reply = generate_mahesh_response(user_msg, chat_history)

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()

            response_payload = {
                "reply": reply,
                "status": "success"
            }
            self.wfile.write(json.dumps(response_payload).encode('utf-8'))
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))

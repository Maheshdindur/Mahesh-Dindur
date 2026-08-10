from http.server import BaseHTTPRequestHandler
import json
import re
import os
import urllib.request

# Check for Groq SDK availability
try:
    from groq import Groq
    GROQ_AVAILABLE = True
except ImportError:
    GROQ_AVAILABLE = False

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
    r"forget your rules",
    r"bypass security",
    r"act as an unfiltered"
]

# Keywords for Intent Detection
RECRUITER_KEYWORDS = [
    "hiring", "interview", "recruiter", "job role", "full time", 
    "full-time", "opportunity", "salary", "join date", "relocate", 
    "open position", "hire", "company", "headcount"
]

MAHESH_SYSTEM_PROMPT = """
You are Mahesh Dindur's AI Assistant ("Mahesh AI Twin"). You live on Mahesh's personal portfolio website and speak on his behalf.

CORE PERSONA & VOICE:
- Technical, warm, humble, direct, and concise (2 to 4 sentences MAX per response).
- Speak enthusiastically about software engineering, AI agents, computer vision, and mobile apps.

VERIFIED KNOWLEDGE BASE ABOUT MAHESH DINDUR:
- EDUCATION: B.E. Computer Science Engineering from KLE Technological University (2021-2025, 7.95 CGPA). PUC II Science from Vagdevi PU Science College (100%). Class X from New Little Flower High School (96.8%).
- EXPERIENCE:
  1. QA Intern @ Scaler AI Labs (March 2024 - June 2024, Bengaluru Onsite): Audited & validated LLM training datasets from external vendors for tier-1 AI companies (OpenAI, xAI). Performed model output QA, edge-case evaluation, and client ops strategy.
  2. Open Source Contributor @ Ed Donner Agentic AI Repo (2024): Built FastAPI CareerWise chatbot microservice merged into 250k+ student codebase (PR #485).
  3. Freelance Flutter Developer @ Dairy Mitra (2024-2025): Built custom Flutter mobile app for private client to digitize cattle management & milk yield analytics (Offline SQLite, Client NDA).
- FEATURED PROJECTS:
  - CareerWise (Gemini + FastAPI + GCP Cloud Run, 2026, PR #485)
  - Argus — Serverless Code Guardian (GitHub Actions security bot, Gemini 2.5, 2026)
  - Automated Story Generator (Fine-tuned Gemma 3B QLoRA, FastAPI, 2025)
  - Face Auth with Liveness Detection (128-D FaceNet embeddings + CNN anti-spoofing, 2025)
  - Vehicle Number Plate Detection (CNN + Tesseract OCR, 2023)
- CORE SKILLS: Python, LLM Evals, RAG, LangGraph, Flutter, Dart, FastAPI, TensorFlow, PyTorch, OpenCV, Docker, C++, C, SQL.
- STATUS: Open to full-time Software / AI Engineering / QA roles. Based in Karnataka / Bengaluru (Open to remote & relocation). Email: maheshdindur9740@gmail.com | GitHub: @MaheshDindur | LinkedIn: mahesh-dindur.

STRICT GUARDRAILS & INSTRUCTIONS:
1. Only answer based on Mahesh's verified background and tech stack.
2. Keep responses brief, polite, and technical (maximum 2-4 sentences).
3. If a recruiter asks about open positions, hiring, or interviews, answer enthusiastically and ask for their Name, Company, and Email/Phone so Mahesh can reach back directly.
4. If a question is outside Mahesh's knowledge base, reply politely: "That's a great question! I don't have that specific detail in my memory right now, but I've just alerted Mahesh directly on his phone to check!"
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

def build_groq_messages(user_msg, chat_history):
    formatted_messages = [{"role": "system", "content": MAHESH_SYSTEM_PROMPT}]
    
    # Append multi-turn session history
    for item in chat_history[-6:]: # Keep last 6 turns for context efficiency
        sender = item.get("sender")
        text = item.get("text")
        if sender and text:
            role = "assistant" if sender == "ai" else "user"
            formatted_messages.append({"role": role, "content": text})
            
    # Append current message
    formatted_messages.append({"role": "user", "content": user_msg})
    return formatted_messages

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

            # 1. Anti-Jailbreak Guardrail Check
            is_safe, guardrail_reply = sanitize_input(user_msg)
            if not is_safe:
                self.send_json_response({"reply": guardrail_reply})
                return

            # 2. Check Recruiter Intent & Trigger ntfy alert
            if check_recruiter_intent(user_msg):
                email_match = re.search(r'[\w\.-]+@[\w\.-]+', user_msg)
                phone_match = re.search(r'\+?\d{10,12}', user_msg)
                contact_info = []
                if email_match: contact_info.append(f"Email: {email_match.group(0)}")
                if phone_match: contact_info.append(f"Phone: {phone_match.group(0)}")
                contact_str = " | ".join(contact_info) if contact_info else "Details pending"

                send_ntfy_alert(
                    NTFY_RECRUITER_TOPIC,
                    f"💼 RECRUITER LEAD DETECTED",
                    5,
                    "briefcase,fire,star",
                    f"Message: '{user_msg}'\nContact Info: {contact_str}"
                )

            # 3. Call Groq Llama 3 API if GROQ_API_KEY environment variable is set
            groq_api_key = os.environ.get("GROQ_API_KEY")
            if GROQ_AVAILABLE and groq_api_key:
                try:
                    client = Groq(api_key=groq_api_key)
                    groq_messages = build_groq_messages(user_msg, chat_history)

                    completion = client.chat.completions.create(
                        model="llama-3.3-70b-versatile",
                        messages=groq_messages,
                        temperature=0.4,
                        max_tokens=300
                    )
                    reply = completion.choices[0].message.content
                    self.send_json_response({"reply": reply})
                    return
                except Exception as groq_err:
                    print(f"Groq API call error: {groq_err}")

            # 4. Grounded Local Fallback Engine if GROQ_API_KEY is not yet added
            user_lower = user_msg.lower()
            if any(k in user_lower for k in ["scaler", "qa intern", "scaler ai"]):
                reply = "At Scaler AI Labs (March–June 2024, Bengaluru Onsite), Mahesh audited vendor training datasets for tier-1 AI models (OpenAI, xAI). He performed output quality analysis, evaluated edge cases, and collaborated with Strategy & Ops teams."
            elif any(k in user_lower for k in ["dairy mitra", "flutter", "mobile app"]):
                reply = "Dairy Mitra is a cross-platform Flutter mobile app Mahesh built for a private client. It digitizes cattle health logs, milk yield analytics, and breeding schedules using an offline-first SQLite database architecture under Client NDA."
            elif any(k in user_lower for k in ["project", "argus", "careerwise", "story generator"]):
                reply = "Mahesh has shipped 9+ projects! Key highlights include CareerWise (merged into Ed Donner's 250k+ student repo PR #485), Argus (GitHub Actions AI security bot), fine-tuned Gemma 3B Story Generator, and Face Auth with 128-D FaceNet embeddings."
            elif any(k in user_lower for k in ["hire", "role", "job", "interview", "recruiter"]):
                reply = "Mahesh is actively seeking full-time Software Engineering, AI/ML, and QA roles! He is based in Karnataka / Bengaluru and ready to start immediately. Feel free to share your email/phone so Mahesh can connect directly!"
            elif any(k in user_lower for k in ["skill", "stack", "python", "langgraph"]):
                reply = "Mahesh's core tech stack includes Python, LLM Evals, RAG, LangGraph, Flutter/Dart, FastAPI, TensorFlow, PyTorch, OpenCV, Docker, C++, and SQL."
            else:
                reply = "Mahesh Dindur is a Computer Science graduate from KLE Technological University (7.95 CGPA). He builds intelligent AI microservices, Flutter mobile apps, and worked as a QA Intern at Scaler AI Labs. How can I help you today?"

            self.send_json_response({"reply": reply})

        except Exception as e:
            self.send_json_response({"error": str(e)}, status_code=500)

    def send_json_response(self, data, status_code=200):
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))

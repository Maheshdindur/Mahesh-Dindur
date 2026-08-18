from http.server import BaseHTTPRequestHandler
import json
import re
import os
import urllib.request
import urllib.error

# Unified Single Topic Channel on ntfy.sh
NTFY_MAIN_TOPIC = "mahesh_dindur_portfolio_messages"

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

# Keywords for Lead & Recruiter Intent Detection
RECRUITER_KEYWORDS = [
    "hiring", "interview", "recruiter", "job role", "full time", 
    "full-time", "opportunity", "salary", "join date", "relocate", 
    "open position", "hire", "company", "headcount", "contact", 
    "number", "phone", "email", "call", "reach", "schedule", "naveen"
]

# Keywords for Out-of-Scope / Unanswered Questions
UNANSWERED_KEYWORDS = [
    "recipe", "cooking", "crypto", "bitcoin", "weather", "politics",
    "movie", "song", "who is president", "stock price", "quantum computing"
]

MAHESH_SYSTEM_PROMPT = """
YOU ARE MAHESH DINDUR. YOU ARE SPEAKING DIRECTLY TO THE VISITOR AS YOURSELF IN THE FIRST PERSON ("I", "my", "me").
DO NOT act as a third-person assistant. YOU ARE MAHESH DINDUR.

CORE PERSONA & VOICE:
- Speak as Mahesh Dindur: authentic, technical, warm, enthusiastic, and concise (2 to 4 sentences MAX per response).
- Speak in the first person about your software engineering, AI agents, computer vision, QA, and Flutter mobile apps.

VERIFIED FACTS ABOUT YOU (MAHESH DINDUR):
- GREETING FOR HI/HELLO: "Hello there! I'm Mahesh Dindur, welcome to my website! How can I help you today?"
- EDUCATION: I completed my B.E. in Computer Science Engineering from KLE Technological University (2021-2025, 7.95 CGPA). I scored 100% in PUC II Science from Vagdevi PU Science College and 96.8% in Class X.
- EXPERIENCE:
  1. QA Intern @ Scaler AI Labs (March 2024 - June 2024, Bengaluru Onsite): I audited & validated LLM training datasets from external vendors for tier-1 AI companies (OpenAI, xAI). I performed model output quality analysis, edge-case evaluation, and worked with Strategy & Ops.
  2. Open Source Contributor @ Ed Donner Agentic AI Repo (2024): I built the FastAPI CareerWise chatbot microservice merged into a 250k+ student codebase (PR #485).
  3. Freelance Flutter Developer @ Dairy Mitra (2024-2025): I built a custom cross-platform Flutter mobile app for a private client to digitize cattle management & milk yield analytics (Offline SQLite, Client NDA).
- FEATURED PROJECTS:
  - CareerWise (Gemini + FastAPI + GCP Cloud Run, 2026, PR #485)
  - Argus — Serverless Code Guardian (GitHub Actions security bot, Gemini 2.5, 2026)
  - Automated Story Generator (Fine-tuned Gemma 3B QLoRA, FastAPI, 2025)
  - Face Auth with Liveness Detection (128-D FaceNet embeddings + CNN anti-spoofing, 2025)
  - Vehicle Number Plate Detection (CNN + Tesseract OCR, 2023)
- CORE SKILLS: Python, LLM Evals, RAG, LangGraph, Flutter, Dart, FastAPI, TensorFlow, PyTorch, OpenCV, Docker, C++, C, SQL.
- STATUS: I'm actively open to full-time Software Engineering, AI/ML, and QA roles! Based in Karnataka / Bengaluru (Open to remote & relocation). Email: maheshdindur9740@gmail.com | GitHub: @MaheshDindur | LinkedIn: mahesh-dindur.

STRICT GUARDRAILS & INSTRUCTIONS:
1. Speak ALWAYS as Mahesh Dindur ("I", "my"). Never refer to Mahesh in 3rd person.
2. Keep responses brief, polite, and technical (maximum 2-4 sentences).
3. If a recruiter asks about hiring, open positions, or provides their contact details (Name, Phone, Email), thank them warmly and confirm that I will reach out directly.
4. If a question is outside your knowledge base or unrelated to your background, reply politely: "That's a great question! I don't have that specific detail right in my head right now, but I've just pinged myself on my phone to check! Feel free to email me directly at maheshdindur9740@gmail.com."
"""

def sanitize_input(text):
    text_lower = text.lower()
    for pattern in FORBIDDEN_PATTERNS:
        if re.search(pattern, text_lower):
            return False, "Hello! I'm Mahesh Dindur. I only answer questions related to my software engineering background, projects, skills, and career opportunities."
    return True, text

def is_lead_intent(text):
    text_lower = text.lower()
    email_found = bool(re.search(r'[\w\.-]+@[\w\.-]+', text))
    phone_found = bool(re.search(r'\b\d{8,12}\b|\+?\d{10,12}', text))
    has_kw = any(kw in text_lower for kw in RECRUITER_KEYWORDS)
    return email_found or phone_found or has_kw

def is_unanswered_intent(text):
    text_lower = text.lower()
    return any(kw in text_lower for kw in UNANSWERED_KEYWORDS)

def send_ntfy_alert(title, priority, tags, body):
    try:
        url = f"https://ntfy.sh/{NTFY_MAIN_TOPIC}"
        headers = {
            "Title": title,
            "Priority": str(priority),
            "Tags": tags
        }
        req = urllib.request.Request(url, data=body.encode('utf-8'), headers=headers, method='POST')
        with urllib.request.urlopen(req, timeout=5) as resp:
            return True
    except Exception as e:
        print(f"ntfy alert error: {e}")
        return False

def build_groq_messages(user_msg, chat_history):
    formatted_messages = [{"role": "system", "content": MAHESH_SYSTEM_PROMPT}]
    for item in chat_history[-6:]:
        sender = item.get("sender")
        text = item.get("text")
        if sender and text:
            role = "assistant" if sender == "ai" else "user"
            formatted_messages.append({"role": role, "content": text})
    formatted_messages.append({"role": "user", "content": user_msg})
    return formatted_messages

def get_dynamic_groq_models(api_key):
    try:
        url = "https://api.groq.com/openai/v1/models"
        headers = {
            "Authorization": f"Bearer {api_key.strip()}",
            "Content-Type": "application/json",
            "User-Agent": "Mahesh-Portfolio-AI/1.0"
        }
        req = urllib.request.Request(url, headers=headers, method='GET')
        with urllib.request.urlopen(req, timeout=5) as response:
            if response.status == 200:
                data = json.loads(response.read().decode('utf-8'))
                models = [
                    m["id"] for m in data.get("data", [])
                    if "whisper" not in m.get("id", "").lower() and "embed" not in m.get("id", "").lower()
                ]
                return models
    except Exception as e:
        print(f"Error fetching dynamic models: {e}")
    return []

def call_groq_api(api_key, messages):
    # Dynamic list fetched directly from Groq account
    active_models = get_dynamic_groq_models(api_key)
    
    # Priority fallback list
    fallback_models = [
        "llama-3.3-70b-versatile",
        "llama-3.1-8b-instant",
        "llama-3.1-70b-versatile",
        "llama3-70b-8192",
        "llama3-8b-8192",
        "mixtral-8x7b-32768",
        "gemma2-9b-it",
        "qwen-2.5-32b",
        "deepseek-r1-distill-llama-70b"
    ]
    
    # Combine dynamic models first, then fallback models
    models_to_try = []
    for m in active_models + fallback_models:
        if m not in models_to_try:
            models_to_try.append(m)
            
    errors = []
    
    for model in models_to_try:
        try:
            url = "https://api.groq.com/openai/v1/chat/completions"
            payload = {
                "model": model,
                "messages": messages,
                "temperature": 0.4,
                "max_tokens": 350
            }
            headers = {
                "Authorization": f"Bearer {api_key.strip()}",
                "Content-Type": "application/json",
                "User-Agent": "Mahesh-Portfolio-AI/1.0"
            }
            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode('utf-8'),
                headers=headers,
                method='POST'
            )
            with urllib.request.urlopen(req, timeout=10) as response:
                if response.status == 200:
                    resp_data = json.loads(response.read().decode('utf-8'))
                    return resp_data["choices"][0]["message"]["content"], model, None
        except urllib.error.HTTPError as e:
            error_body = e.read().decode('utf-8')
            errors.append(f"{model}: HTTP {e.code} - {error_body}")
        except Exception as e:
            errors.append(f"{model}: {str(e)}")
            
    return None, None, "; ".join(errors)

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
            data = json.loads(body) if body else {}

            user_msg = data.get("message", "")
            chat_history = data.get("history", [])

            # 1. Anti-Jailbreak Guardrail Check
            is_safe, guardrail_reply = sanitize_input(user_msg)
            if not is_safe:
                self.send_json_response({"reply": guardrail_reply, "source": "guardrail"})
                return

            # 2. Trigger ntfy alert for Recruiter / Lead Generation -> mahesh_dindur_portfolio_messages
            if is_lead_intent(user_msg):
                email_match = re.search(r'[\w\.-]+@[\w\.-]+', user_msg)
                phone_match = re.search(r'\b\d{8,12}\b|\+?\d{10,12}', user_msg)
                contact_info = []
                if email_match: contact_info.append(f"Email: {email_match.group(0)}")
                if phone_match: contact_info.append(f"Phone: {phone_match.group(0)}")
                contact_str = " | ".join(contact_info) if contact_info else "Lead info received"

                send_ntfy_alert(
                    f"💼 RECRUITER / LEAD ALERT",
                    5,
                    "briefcase,fire,star",
                    f"Message: '{user_msg}'\nExtracted Contact: {contact_str}"
                )

            # 3. Trigger ntfy alert for Unanswered Questions -> mahesh_dindur_portfolio_messages
            elif is_unanswered_intent(user_msg):
                send_ntfy_alert(
                    f"❓ UNANSWERED QUESTION ALERT",
                    3,
                    "question,thinking",
                    f"Visitor asked: '{user_msg}'"
                )

            # 4. Call Groq API if GROQ_API_KEY environment variable is set
            groq_api_key = os.environ.get("GROQ_API_KEY") or os.environ.get("groq_api_key")
            api_err = None
            used_model = None
            if groq_api_key:
                groq_messages = build_groq_messages(user_msg, chat_history)
                llm_reply, used_model, api_err = call_groq_api(groq_api_key, groq_messages)
                if llm_reply:
                    self.send_json_response({"reply": llm_reply, "source": "groq_llm", "model": used_model})
                    return

            # 5. Grounded First-Person Local Fallback Engine (when API Key is not set or network fails)
            user_lower = user_msg.lower().strip()

            if user_lower in ["hi", "hello", "hey", "hi there", "hello there", "start"]:
                reply = "Hello there! I'm Mahesh Dindur, welcome to my website! How can I help you today?"
            elif is_unanswered_intent(user_msg):
                reply = "That's a great question! I don't have that specific detail right in my head right now, but I've just pinged myself on my phone to check! Feel free to email me directly at maheshdindur9740@gmail.com."
            elif any(k in user_lower for k in ["scaler", "qa intern", "scaler ai"]):
                reply = "At Scaler AI Labs (March–June 2024, Bengaluru Onsite), I audited vendor training datasets for tier-1 AI models (OpenAI, xAI). I performed output quality analysis, evaluated edge cases, and collaborated with Strategy & Ops teams."
            elif any(k in user_lower for k in ["dairy mitra", "flutter", "mobile app"]):
                reply = "Dairy Mitra is a cross-platform Flutter mobile app I built for a private client. It digitizes cattle health logs, milk yield analytics, and breeding schedules using an offline-first SQLite database architecture under Client NDA."
            elif any(k in user_lower for k in ["project", "argus", "careerwise", "story generator"]):
                reply = "I've shipped 9+ projects! Key highlights include CareerWise (merged into Ed Donner's 250k+ student repo PR #485), Argus (GitHub Actions AI security bot), fine-tuned Gemma 3B Story Generator, and Face Auth with 128-D FaceNet embeddings."
            elif is_lead_intent(user_msg):
                reply = "Thank you so much for sharing your contact info! I'm excited about the opportunity and will reach out to you directly as requested. Looking forward to discussing the role!"
            elif any(k in user_lower for k in ["skill", "stack", "python", "langgraph"]):
                reply = "My core tech stack includes Python, LLM Evals, RAG, LangGraph, Flutter/Dart, FastAPI, TensorFlow, PyTorch, OpenCV, Docker, C++, and SQL."
            else:
                reply = "Hello there! I'm Mahesh Dindur, welcome to my website! I'm a CS & AI/ML Engineer specializing in Agentic AI microservices, QA testing pipelines, and Flutter mobile apps. How can I help you today?"

            diag = {
                "key_present": bool(groq_api_key),
                "error": api_err if api_err else "GROQ_API_KEY not found in environment"
            }
            self.send_json_response({"reply": reply, "source": "fallback", "debug": diag})

        except Exception as e:
            self.send_json_response({"error": str(e), "reply": "Hello there! I'm Mahesh Dindur. How can I help you today?"}, status_code=500)

    def send_json_response(self, data, status_code=200):
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))

export const portfolioData = {
  personal: {
    name: "Mahesh Dindur",
    title: "CS · AI/ML Engineer",
    badgeStatus: "OPEN TO SOFTWARE · AI ROLES",
    location: "KARNATAKA, INDIA",
    shortBio: "I build intelligent, human-first systems — from agentic AI microservices to mobile apps and quality assurance.",
    fullBio: "I'm a recent Computer Science graduate from KLE Technological University, actively seeking opportunities in AI Engineering, Software Development, and QA. With hands-on experience at Scaler AI Labs auditing LLM training data for enterprise clients (OpenAI, xAI), building open-source AI microservices, and shipping Flutter apps, I build reliable software that scales.",
    email: "maheshdindur9740@gmail.com",
    github: "https://github.com/Maheshdindur",
    githubHandle: "@MaheshDindur",
    linkedin: "https://linkedin.com/in/mahesh-dindur",
    linkedinHandle: "mahesh-dindur",
    versionTag: "V2026",
    photoUrl: "/profile_card.jpeg"
  },
  stats: [
    { value: "5+", label: "YEARS CODING" },
    { value: "9+", label: "PROJECTS SHIPPED" },
    { value: "250k+", label: "users", sublabel: "OSS MERGED" },
    { value: "10+", label: "TECH TOOLS", sublabel: "MASTERED" }
  ],
  aboutHighlights: [
    { label: "FOCUS", value: "AI Agents · QA · Mobile" },
    { label: "LOCATION", value: "Karnataka, IN" },
    { label: "AVAILABILITY", value: "Full-time" },
    { label: "STACK", value: "Python · Flutter · FastAPI" }
  ],
  marqueeTech: [
    "LLM Evals", "RAG", "LangGraph", "QA Testing", "Scaler AI Labs", "OpenAI Data QA", 
    "Flutter", "Dart", "TensorFlow", "CrewAI", "PyTorch", "FastAPI", "Python", "React", "Docker"
  ],
  skills: [
    {
      id: "01",
      total: "03",
      category: "Languages & Mobile",
      skills: ["Python", "Flutter", "Dart", "C++", "C", "SQL", "Java (Learning)", "JavaScript"]
    },
    {
      id: "02",
      total: "03",
      category: "AI / ML & QA Testing",
      skills: ["LLM Evals", "RAG", "LangGraph", "QA Testing", "Dataset Quality Auditing", "FastAPI", "TensorFlow", "PyTorch", "OpenCV", "Hugging Face", "CrewAI", "Generative AI"]
    },
    {
      id: "03",
      total: "03",
      category: "Foundations & Strategy",
      skills: ["Data QA Workflows", "Client & Ops Strategy", "Bug Tracking", "Git & GitHub", "Mobile Architecture", "Quick Learner"]
    }
  ],
  experience: [
    {
      id: 1,
      role: "QA Intern",
      company: "Scaler AI Labs",
      period: "March 2024 – June 2024",
      location: "BENGALURU, KARNATAKA (ONSITE)",
      points: [
        "Audited and validated high-stakes AI training datasets from vendors used for large-scale model development for tier-1 AI companies (e.g. OpenAI, xAI).",
        "Performed rigorous quality analysis on AI-generated outputs and model responses to ensure accuracy, consistency, and adherence to evaluation guidelines.",
        "Worked closely with Strategy & Ops teams to identify edge cases, report dataset inconsistencies, and streamline scalable annotation workflows.",
        "Engaged in client operations by participating in strategy discussions, conducting client calls, and coordinating key stakeholder meetings."
      ],
      linkText: "View Internship Experience",
      linkUrl: "https://linkedin.com/in/mahesh-dindur"
    },
    {
      id: 2,
      role: "Open Source Contributor",
      company: "Ed Donner · Agentic AI Repository",
      period: "2024",
      location: "REMOTE",
      points: [
        "Engineered a production-ready AI chatbot microservice merged into a repo used by 250k+ students.",
        "Built FastAPI backend for personalized career discussions and recruiter contact extraction.",
        "Deployed zero-cost real-time notifications with ntfy on GCP Cloud Run (serverless)."
      ],
      linkText: "View PR #485",
      linkUrl: "https://github.com/ed-donner/agents/pull/485"
    },
    {
      id: 3,
      role: "Freelance Flutter Developer",
      company: "Client Project · Dairy Mitra (Cattle Management App)",
      period: "2024 - 2025",
      location: "KARNATAKA, IN",
      points: [
        "Architected & built a custom cross-platform Flutter mobile application for a private client to digitize cattle & dairy farm management.",
        "Implemented offline-first SQLite database for logging milk yields, animal health records, vaccination schedules, and breeding timelines.",
        "Designed clean mobile UI/UX customized for farm operators with real-time reporting dashboards and offline data synchronization."
      ],
      isPrivateNDA: true,
      linkText: "Client NDA / Private Mobile App",
      linkUrl: null
    }
  ],
  projects: [
    {
      id: "dairy-mitra",
      title: "Dairy Mitra — Cattle Management Mobile App",
      featured: true,
      year: "2026",
      category: "Full Stack & Web",
      shortDesc: "Custom Flutter mobile app built for a private client to digitize animal husbandry, milk yield analytics, vaccination alerts, and breeding logs.",
      fullDesc: "Dairy Mitra is a dedicated Flutter cross-platform mobile application engineered for a private client. It allows dairy farm managers to log individual cattle health records, track daily milk yield trends, optimize feed schedules, and manage breeding calendars in an offline-first SQLite architecture.",
      tags: ["FLUTTER", "DART", "SQLITE", "MOBILE APP", "CLIENT NDA"],
      isPrivateNDA: true,
      githubUrl: null,
      liveUrl: null,
      highlights: ["Cross-platform Flutter mobile app", "Milk yield analytics & health tracking", "Offline-first SQLite architecture"]
    },
    {
      id: "careerwise",
      title: "CareerWise · Gemini Notify Module",
      featured: true,
      year: "2026",
      category: "Agentic AI & ML",
      shortDesc: "Production AI chatbot microservice merged into Ed Donner's Agentic AI repo (250k+ users). Personalized career conversations, recruiter extraction and serverless notifications.",
      fullDesc: "CareerWise is an intelligent agent microservice designed for seamless career guidance and automated recruiter notification pipelines. Integrated with Gemini API and deployed on GCP Cloud Run serverless infrastructure.",
      tags: ["PYTHON", "GEMINI", "FASTAPI", "GCP", "NTFY"],
      githubUrl: "https://github.com/ed-donner/agents/pull/485",
      liveUrl: "https://github.com/ed-donner/agents/pull/485",
      highlights: ["Merged into 250k+ student codebase (PR #485)", "Zero-cost serverless setup", "Real-time ntfy notification hooks"]
    },
    {
      id: "argus",
      title: "Argus — Serverless Code Guardian",
      featured: false,
      year: "2026",
      category: "Agentic AI & ML",
      shortDesc: "AI security bot inside GitHub Actions. Audits PRs for secrets and logic bugs and autonomously blocks risky merges. Zero-maintenance ephemeral runners.",
      fullDesc: "Argus functions as an automated AI reviewer embedded directly in CI/CD workflows via GitHub Actions. Powered by Gemini 2.5 Flash, it analyzes code diffs for secret leakage and logical bugs.",
      tags: ["GITHUB ACTIONS", "GEMINI 2.5", "PYTHON"],
      githubUrl: "https://github.com/Maheshdindur/Argus-The-Serverless-Code-Guardian",
      liveUrl: "https://github.com/Maheshdindur/Argus-The-Serverless-Code-Guardian",
      highlights: ["Automated PR blocking", "Zero maintenance overhead", "Sub-5-second execution speed"]
    },
    {
      id: "story-generator",
      title: "Automated Story Generator · Fine-tuned LLM",
      featured: false,
      year: "2025",
      category: "Agentic AI & ML",
      shortDesc: "Multimodal storytelling platform — fine-tuned Gemma 3B on TinyStories, 10-page illustrated stories with FastAPI + Gemini image synthesis.",
      fullDesc: "An end-to-end AI story authoring ecosystem. Gemma 3B was fine-tuned with 4-bit QLoRA on the TinyStories dataset to generate rich children's stories.",
      tags: ["PYTHON", "GEMMA 3B", "FASTAPI", "FLUTTER"],
      githubUrl: "https://github.com/Maheshdindur/AI-Story-Generator-Fine-Tuned-Small-Language-Model",
      liveUrl: "https://github.com/Maheshdindur/AI-Story-Generator-Fine-Tuned-Small-Language-Model",
      highlights: ["4-bit PEFT quantization", "Multimodal text-to-image pipeline", "Cross-platform Flutter frontend"]
    },
    {
      id: "face-auth",
      title: "Face Auth with Liveness Detection",
      featured: false,
      year: "2025",
      category: "Computer Vision",
      shortDesc: "Anti-spoof facial auth combining 128-D FaceNet embeddings with a lightweight CNN liveness detection model for secure authentication.",
      fullDesc: "A high-security biometric login system designed to prevent photo and video replay attacks.",
      tags: ["PYTHON", "FACENET", "OPENCV", "CNN"],
      githubUrl: "https://github.com/Maheshdindur/Face-Authentication-using-Face-Liveness-Detection",
      liveUrl: "https://github.com/Maheshdindur/Face-Authentication-using-Face-Liveness-Detection",
      highlights: ["128-D face embedding vector space", "Anti-spoofing CNN liveness check", "Real-time 30 FPS processing"]
    },
    {
      id: "anpr",
      title: "Vehicle Number Plate Detection",
      featured: false,
      year: "2023",
      category: "Computer Vision",
      shortDesc: "End-to-end CNN + OCR pipeline for automatic license plate recognition — toll, parking and traffic use-cases.",
      fullDesc: "Automated license plate recognition system tailored for Indian traffic environments.",
      tags: ["PYTHON", "OPENCV", "CNN", "TESSERACT OCR"],
      githubUrl: "https://github.com/Maheshdindur/Vehicle-Number-Plate-Detection",
      liveUrl: "https://github.com/Maheshdindur/Vehicle-Number-Plate-Detection",
      highlights: ["Custom CNN plate localization", "Tesseract OCR post-processing", "Robust under varying lighting"]
    },
    {
      id: "firearm",
      title: "Firearm Case Classification",
      featured: false,
      year: "2023",
      category: "Computer Vision",
      shortDesc: "Forensic image classifier for bullet cartridge cases — region-based feature extraction + SVM classifier with evaluation dashboards.",
      fullDesc: "Forensic analysis software assisting ballistics investigations by categorizing firing pin impressions.",
      tags: ["OPENCV", "SVM", "SCIKIT-LEARN"],
      githubUrl: null,
      liveUrl: null,
      highlights: ["High-precision feature extraction", "Support Vector Classifier", "Forensic accuracy metrics"]
    },
    {
      id: "invigilator",
      title: "Invigilator Allocation System",
      featured: false,
      year: "2023",
      category: "Full Stack & Web",
      shortDesc: "Full-stack MERN app that auto-schedules exam invigilators based on faculty availability and subject expertise.",
      fullDesc: "An automated scheduling portal for academic departments that eliminates manual invigilation conflicts.",
      tags: ["MONGODB", "EXPRESS", "REACT", "NODE", "JWT"],
      githubUrl: null,
      liveUrl: null,
      highlights: ["Constraint satisfaction engine", "JWT multi-role auth", "Automated roster export"]
    },
    {
      id: "menstrual-tracker",
      title: "Menstrual Cycle Tracking System",
      featured: false,
      year: "2023",
      category: "Full Stack & Web",
      shortDesc: "Privacy-first web app for cycle & symptom logging with rule-based predictions for cycles and fertile windows.",
      fullDesc: "A private, zero-tracking web application allowing users to log health metrics locally on device. Calculates predictive cycle calendars and ovulation windows using standard clinical algorithms.",
      tags: ["HTML", "CSS", "JAVASCRIPT", "LOCALSTORAGE"],
      githubUrl: null,
      liveUrl: null,
      highlights: ["100% client-side privacy", "Fertility window calculations", "Offline-first LocalStorage"]
    }
  ],
  education: [
    {
      id: 1,
      institution: "KLE Technological University",
      location: "Belagavi",
      period: "2021 - 2025",
      degree: "B.E. Computer Science Engineering",
      score: "7.95 CGPA",
      details: "Focused on AI/ML, Data Structures, Computer Architecture, Object Oriented Programming, and Database Systems."
    },
    {
      id: 2,
      institution: "Vagdevi PU Science College",
      location: "Bagalkot",
      period: "2019 - 2021",
      degree: "PUC II Science",
      score: "100%",
      details: "Completed Pre-University course in Physics, Chemistry, Mathematics, and Computer Science with a perfect 100% score."
    },
    {
      id: 3,
      institution: "New Little Flower High School",
      location: "Ron",
      period: "2019",
      degree: "Class X",
      score: "96.8%",
      details: "Secondary education completed with 96.8% distinction."
    }
  ],
  certifications: [
    {
      id: 1,
      title: "Agentic AI & Microservices Development",
      issuer: "Ed Donner Repository",
      year: "2024",
      skills: ["FastAPI", "GCP Cloud Run", "ntfy", "Gemini AI"],
      imageUrl: "/certificates/Agentic Ai 1.png"
    },
    {
      id: 2,
      title: "AI Agents & Model Context Protocol (MCP)",
      issuer: "Agentic AI Labs",
      year: "2024",
      skills: ["MCP", "Agentic Workflows", "LangChain", "Python"],
      imageUrl: "/certificates/ai-agent-mcp.png"
    },
    {
      id: 3,
      title: "Cisco Networking & Cybersecurity Essentials",
      issuer: "Cisco Networking Academy",
      year: "2023",
      skills: ["Networking", "Cybersecurity", "Network Architecture"],
      imageUrl: "/certificates/cisco-certificate.png"
    },
    {
      id: 4,
      title: "Cyber Security Fundamentals",
      issuer: "Professional Certification",
      year: "2023",
      skills: ["Information Security", "Threat Auditing", "Encryption"],
      imageUrl: "/certificates/cyber_security_certificate.png"
    },
    {
      id: 5,
      title: "Kubernetes & Cloud Infrastructure",
      issuer: "Cloud Native Computing",
      year: "2023",
      skills: ["Kubernetes", "Docker", "Containers", "DevOps"],
      imageUrl: "/certificates/kubernetes.png"
    },
    {
      id: 6,
      title: "Python Programming & Data Structures",
      issuer: "HackerRank / Python Institute",
      year: "2023",
      skills: ["Python", "OOP", "Data Structures", "Algorithms"],
      imageUrl: "/certificates/python-basics.png"
    }
  ],
  offHours: [
    { label: "Cinema", icon: "🎬" },
    { label: "Sports", icon: "⚽" },
    { label: "Travelling", icon: "✈" },
    { label: "Coding", icon: "</>" }
  ]
};

import React, { useState } from 'react';
import { ScrollProgress } from './components/ScrollProgress';
import { CustomCursor } from './components/CustomCursor';
import { DynamicNatureBackground } from './components/DynamicNatureBackground';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Experience } from './components/Experience';
import { Projects } from './components/Projects';
import { Education } from './components/Education';
import { Certifications } from './components/Certifications';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { ResumeModal } from './components/ResumeModal';
import { ProjectModal } from './components/ProjectModal';
import { ChatbotWidget } from './components/ChatbotWidget';

export const App = () => {
  const [resumeOpen, setResumeOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleOpenContact = () => {
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <ScrollProgress />
      <CustomCursor />

      {/* Dynamic Nature Background: Ocean Waves -> Warm Sunshine -> Starry Night */}
      <DynamicNatureBackground />

      <Header
        onOpenContact={handleOpenContact}
        onOpenResume={() => setResumeOpen(true)}
      />

      <main>
        <Hero
          onOpenContact={handleOpenContact}
          onOpenResume={() => setResumeOpen(true)}
        />
        <About />
        <Skills />
        <Experience />
        <Projects onSelectProject={(project) => setSelectedProject(project)} />
        <Education />
        <Certifications />
        <Contact />
      </main>

      <Footer />

      {/* Floating AI Persona Chatbot Widget */}
      <ChatbotWidget />

      {/* Modals */}
      <ResumeModal
        isOpen={resumeOpen}
        onClose={() => setResumeOpen(false)}
      />
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
};

export default App;

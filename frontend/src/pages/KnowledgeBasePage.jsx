import React, { useState } from 'react';
import { BookOpen, ChevronRight, FileText, Activity, Heart, Shield, ChevronDown } from 'lucide-react';
import ChatHeader from '../components/chat/ChatHeader';

const KnowledgeBasePage = () => {
  // Track which FAQ answer accordion is currently open
  const [openIndex, setOpenIndex] = useState(null);

  const categories = [
    {
      id: 1,
      title: 'Getting Started',
      icon: <Activity className="text-blue-500" size={24} />,
      description: 'Learn how to start your first consultation.'
    },
    {
      id: 2,
      title: 'Homeopathy Basics',
      icon: <Heart className="text-green-500" size={24} />,
      description: 'Understand the fundamental principles of homeopathy.'
    },
    {
      id: 3,
      title: 'Privacy & Security',
      icon: <Shield className="text-purple-500" size={24} />,
      description: 'How we protect your medical data and privacy.'
    },
    {
      id: 4,
      title: 'Using the AI Doctor',
      icon: <BookOpen className="text-orange-500" size={24} />,
      description: 'Tips for getting the most accurate diagnosis.'
    }
  ];

  const popularArticles = [
    {
      question: 'How accurate is the AI diagnosis?',
      answer: 'Our chatbot utilizes extensively vetted homeopathic repositories and medical datasets to cross-reference your symptoms. While it yields exceptionally high screening accuracy for common conditions, it is designed to assist your wellness journey and should not replace emergency medical diagnosis.'
    },
    {
      question: 'Is my medical data shared with third parties?',
      answer: 'Absolutely not. We implement strict end-to-end encryption protocols. Your symptoms, query history, and profile data are securely containerized within isolated database structures and never shared with, sold to, or processed by outside marketing entities.'
    },
    {
      question: 'Can I consult for chronic diseases?',
      answer: 'Yes, it can suggest constitutional homeopathic mapping patterns for long-standing concerns like chronic allergies, skin conditions, or digestive stress. However, it will automatically flag severe symptom markers and suggest scheduling a direct physical appointment when necessary.'
    },
    {
      question: 'How do I update my profile information?',
      answer: 'Navigate to the Profile Settings tab on your main dashboard navigation menu. From there you can update your age metrics, contact defaults, past remedy response histories, and change your notification intervals securely.'
    },
    {
      question: 'What should I do in a medical emergency?',
      answer: 'This chatbot is strictly meant for informative homeopathic consultation. If you are experiencing sudden acute symptoms, severe respiratory pain, continuous bleeding, or any life-threatening emergency, please bypass this app entirely and call your local emergency medical hotline immediately.'
    }
  ];

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden" style={{ backgroundColor: 'var(--color-gemini-bg)', color: 'var(--color-gemini-text)' }}>
      <ChatHeader />

      <div className="flex-1 overflow-y-auto w-full flex justify-center">
        {/* Enforced layout box wrapper padding to avoid browser-dropped margins */}
        <div
          className="w-full max-w-5xl px-6 pt-16 flex flex-col items-center gap-24"
          style={{ paddingBottom: '160px' }}
        >

          {/* Header Section */}
          <div className="text-center w-full max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Knowledge Base</h1>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
            {categories.map((category) => (
              <div
                key={category.id}
                className="p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer flex flex-col justify-between h-full group"
                style={{ backgroundColor: 'var(--color-gemini-surface)', borderColor: 'var(--color-gemini-border)' }}
              >
                <div>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ backgroundColor: 'rgba(128, 128, 128, 0.08)' }}>
                    {category.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 tracking-tight">{category.title}</h3>
                  <p className="text-sm opacity-70 mb-6 leading-relaxed">{category.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Popular Articles Accordion Wrapper */}
          {/* FIXED: Added direct inline style marginBottom for a distinct gap after this section */}
          <div className="w-full max-w-3xl" style={{ marginBottom: '80px' }}>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 tracking-tight">
              <FileText className="text-blue-500 shrink-0" size={24} />
              <span>Popular Articles & FAQs</span>
            </h2>

            <div className="rounded-2xl border overflow-hidden shadow-sm" style={{ backgroundColor: 'var(--color-gemini-surface)', borderColor: 'var(--color-gemini-border)' }}>
              {popularArticles.map((item, index) => {
                const isOpen = openIndex === index;
                return (
                  <div
                    key={index}
                    className="border-b last:border-0"
                    style={{ borderColor: 'var(--color-gemini-border)' }}
                  >
                    <button
                      onClick={() => handleToggle(index)}
                      className="w-full flex items-center justify-between p-5 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] cursor-pointer transition-colors text-left gap-4 outline-none"
                    >
                      <span className="font-semibold text-sm md:text-base opacity-90">{item.question}</span>
                      <div className="shrink-0 opacity-50">
                        {isOpen ? <ChevronDown size={18} className="rotate-180 transition-transform duration-200" /> : <ChevronRight size={18} className="transition-transform duration-200" />}
                      </div>
                    </button>

                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-48 border-t' : 'max-h-0'}`}
                      style={{ borderColor: 'var(--color-gemini-border)' }}
                    >
                      <div className="p-5 text-sm leading-relaxed opacity-80" style={{ backgroundColor: 'rgba(128, 128, 128, 0.02)' }}>
                        {item.answer}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default KnowledgeBasePage;
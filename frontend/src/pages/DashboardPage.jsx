import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, History, CreditCard, BookOpen, Settings, HeartPulse, X, MessageSquare, ClipboardList } from 'lucide-react';
import ChatHeader from '../components/chat/ChatHeader';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showConsultationModal, setShowConsultationModal] = useState(false);

  let canConsult = user?.is_active ?? true;
  if (canConsult && user?.role === 'patient') {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = user.subscription_start_date ? new Date(user.subscription_start_date) : null;
    const end = user.subscription_end_date ? new Date(user.subscription_end_date) : null;
    if (start) start.setHours(0, 0, 0, 0);
    if (end) end.setHours(0, 0, 0, 0);
    
    if (start && today < start) canConsult = false;
    if (end && today > end) canConsult = false;
  }

  const menuItems = [
    {
      title: 'New Consultation',
      description: canConsult ? 'Start a new homeopathic case taking' : 'Consultation unavailable (Subscription inactive)',
      icon: Stethoscope,
      path: '/consultation',
      color: canConsult ? 'from-blue-500 to-cyan-400' : 'from-gray-400 to-gray-500',
      disabled: !canConsult
    },
    {
      title: 'Patients History',
      description: 'View previous consultations and patient records',
      icon: History,
      path: '/history',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Plans & Pricing',
      description: 'Manage your subscription and billing details',
      icon: CreditCard,
      path: '/subscription',
      color: 'from-amber-500 to-orange-400'
    },
    {
      title: 'Knowledge Base',
      description: 'Explore homeopathic remedies and materia medica',
      icon: BookOpen,
      path: '/knowledge',
      color: 'from-emerald-500 to-teal-400'
    },
    {
      title: 'Settings',
      description: 'Configure your profile and application preferences',
      icon: Settings,
      path: '/profile',
      color: 'from-gray-500 to-slate-400'
    },
    {
      title: 'Importance of Homoeopathic',
      description: 'Learn why this chatbot and homoeopathy are essential for your health',
      icon: HeartPulse,
      path: '/importance',
      color: 'from-indigo-500 to-blue-500'
    }
  ];

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden" style={{ backgroundColor: 'var(--color-gemini-bg)', color: 'var(--color-gemini-text)' }}>
      <ChatHeader />
      
      <div className="flex-1 overflow-y-auto flex flex-col items-center">
        <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 my-auto">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div 
                  key={index}
                  onClick={() => {
                    if (!item.disabled) {
                      if (item.path === '/consultation') {
                        setShowConsultationModal(true);
                      } else {
                        navigate(item.path);
                      }
                    }
                  }}
                  className={`group relative p-6 rounded-3xl transition-all duration-300 border ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-[1.02]'}`}
                  style={{ 
                    backgroundColor: 'var(--color-gemini-surface)',
                    borderColor: 'var(--color-gemini-border)'
                  }}
                >
                  <div className={`w-12 h-12 rounded-2xl mb-4 flex items-center justify-center bg-gradient-to-br ${item.color} text-white shadow-lg`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm" style={{ color: 'var(--color-gemini-text-muted)' }}>
                    {item.description}
                  </p>
                  
                  {/* Subtle hover effect border */}
                  <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border-2" 
                       style={{ borderColor: 'var(--color-gemini-accent)' }} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Consultation Type Selection Modal */}
      {showConsultationModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 50, padding: '1rem'
        }}>
          <div style={{
            backgroundColor: 'var(--color-gemini-surface)',
            border: '1px solid var(--color-gemini-border)',
            borderRadius: '24px',
            padding: '2.5rem',
            width: '100%',
            maxWidth: '600px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            position: 'relative',
            animation: 'modalSlideIn 0.3s ease-out'
          }}>
            <button 
              onClick={() => setShowConsultationModal(false)}
              style={{
                position: 'absolute', top: '1.5rem', right: '1.5rem',
                background: 'var(--color-gemini-surface-2)',
                border: 'none', borderRadius: '50%', width: '32px', height: '32px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--color-gemini-text-muted)', cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-gemini-text)'; e.currentTarget.style.background = 'var(--color-gemini-border)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-gemini-text-muted)'; e.currentTarget.style.background = 'var(--color-gemini-surface-2)'; }}
            >
              <X size={18} />
            </button>
            
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-gemini-text)' }}>Select Consultation Type</h2>
              <p style={{ color: 'var(--color-gemini-text-muted)' }}>Choose how you want to conduct this case taking</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option 1: Standard */}
              {(user?.model_access === 'beginner' || user?.model_access === 'both' || !user?.model_access) && (
                <div 
                  onClick={() => { setShowConsultationModal(false); navigate('/consultation'); }}
                  className="group p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2"
                  style={{ 
                    backgroundColor: 'var(--color-gemini-surface-2)', 
                    borderColor: 'var(--color-gemini-border)'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#38bdf8'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-gemini-border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-md">
                    <ClipboardList size={24} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-gemini-text)' }}>Beginner</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-gemini-text-muted)' }}>
                    Traditional step-by-step wizard format to gather patient details and symptoms structurally.
                  </p>
                </div>
              )}

              {/* Option 2: AI Chat */}
              {(user?.model_access === 'premium' || user?.model_access === 'both' || !user?.model_access) && (
                <div 
                  onClick={() => { setShowConsultationModal(false); navigate('/chat-consultation'); }}
                  className="group p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2 relative overflow-hidden"
                  style={{ 
                    backgroundColor: 'var(--color-gemini-surface-2)', 
                    borderColor: 'var(--color-gemini-border)'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#8b5cf6'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-gemini-border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                    NEW
                  </div>
                  <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-md">
                    <MessageSquare size={24} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-gemini-text)' }}>Premium</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-gemini-text-muted)' }}>
                    A fluid, conversational AI interface. Perfect for a more natural and interactive case taking.
                  </p>
                </div>
              )}
            </div>
            <style>{`
              @keyframes modalSlideIn {
                from { opacity: 0; transform: translateY(20px) scale(0.95); }
                to { opacity: 1; transform: translateY(0) scale(1); }
              }
            `}</style>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;

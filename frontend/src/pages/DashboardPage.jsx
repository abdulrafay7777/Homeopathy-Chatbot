import { useNavigate } from 'react-router-dom';
import { Stethoscope, History, CreditCard, BookOpen, Settings, HeartPulse } from 'lucide-react';
import ChatHeader from '../components/chat/ChatHeader';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

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
      
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col">
        <div className="w-full max-w-6xl mx-auto my-auto">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div 
                  key={index}
                  onClick={() => !item.disabled && navigate(item.path)}
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
    </div>
  );
};

export default DashboardPage;

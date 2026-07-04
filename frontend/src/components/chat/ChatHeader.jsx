import { RotateCcw, User, LogOut, CreditCard, Home } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { Dropdown, DropdownTrigger, DropdownContent, DropdownItem } from '../common/Dropdown';

const ChatHeader = () => {
  const { phase, resetConsultation } = useChat();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const goHome = () => {
    resetConsultation();
    navigate('/');
  };

  return (
    <header className="w-full h-16 flex items-center justify-between px-4 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <button
          onClick={goHome}
          className="flex items-center justify-center w-10 h-10 rounded-full transition-colors cursor-pointer hover:scale-[1.05]"
          style={{
            backgroundColor: 'var(--color-gemini-surface)',
            border: '1px solid var(--color-gemini-border)',
            color: 'var(--color-gemini-text)',
          }}
          title="Dashboard"
        >
          <Home size={18} />
        </button>

        {location.pathname === '/consultation' && phase !== 'intake' && (
          <button
            onClick={resetConsultation}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer hover:scale-[1.02]"
            style={{
              backgroundColor: 'var(--color-gemini-surface)',
              border: '1px solid var(--color-gemini-border)',
              color: 'var(--color-gemini-text)',
            }}
          >
            <RotateCcw size={16} />
            <span className="hidden sm:inline">New Consultation</span>
          </button>
        )}
      </div>

      <Dropdown>
        <DropdownTrigger>
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-gemini-accent via-[#7f7cff] to-gemini-accent-3 text-white font-semibold cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-200 ring-2 ring-transparent hover:ring-gemini-accent/30">
            {user?.initial || user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        </DropdownTrigger>

        <DropdownContent align="right">
          <div className="px-4 py-3 border-b border-gemini-border bg-gemini-surface-2">
            <p className="text-sm font-semibold text-gemini-text">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-gemini-text-muted truncate mt-0.5">
              {user?.email || ''}
            </p>
          </div>
          <DropdownItem onClick={() => navigate('/profile')}>
            <User size={16} />
            <span>Profile</span>
          </DropdownItem>
          <DropdownItem onClick={() => navigate('/subscription')}>
            <CreditCard size={16} />
            <span>Subscription</span>
          </DropdownItem>
          <DropdownItem onClick={handleLogout} danger>
            <LogOut size={16} />
            <span>Logout</span>
          </DropdownItem>
        </DropdownContent>
      </Dropdown>
    </header>
  );
};

export default ChatHeader;

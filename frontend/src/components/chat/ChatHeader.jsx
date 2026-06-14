import { Menu, User, LogOut, CreditCard, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { Dropdown, DropdownTrigger, DropdownContent, DropdownItem } from '../common/Dropdown';

const ChatHeader = () => {
  const { sidebarOpen, setSidebarOpen } = useChat();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="w-full h-16 flex items-center relative sticky top-0 z-10">
      {/* Left side - Menu button */}
      <div className="flex items-center pl-4">
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-gemini-surface-hover rounded-full transition-colors cursor-pointer"
            aria-label="Open sidebar"
          >
            <Menu size={24} />
          </button>
        )}
      </div>

      {/* Right side - Account dropdown with absolute positioning */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2">
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
              <span>Profile Settings</span>
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
      </div>
    </header>
  );
};

export default ChatHeader;

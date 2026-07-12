import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, UserPlus, CreditCard, Users, LogOut, Menu, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiClient } from '../services/api';
import logo from '../assets/logo.png';

// Import tab components
import DashboardTab from '../Admin/DashboardTab';
import CreateUserTab from '../Admin/CreateUserTab';
import PlansTab from '../Admin/PlansTab';
import AllUsersTab from '../Admin/AllUsersTab';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(() => {
    // Get saved tab from localStorage or default to 'dashboard'
    return localStorage.getItem('adminActiveTab') || 'dashboard';
  });
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(() => !isMobile);

  // Add resize listener
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Poll system status
  useEffect(() => {
    let toastId = null;

    const checkSystemStatus = async () => {
      try {
        const response = await apiClient.get('/admin/system-status');
        if (response.data.api_exhausted) {
          if (!toastId) {
            toastId = toast.error(
              (t) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span>⚠️ LLM API Quota Exhausted. Chatbot is currently offline. Please check your API billing or update keys.</span>
                  <button 
                    onClick={async () => {
                      toast.dismiss(t.id);
                      toastId = null;
                      try {
                        await apiClient.post('/admin/clear-api-error');
                      } catch (err) {
                        console.error('Failed to clear API error', err);
                      }
                    }} 
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'red', fontWeight: 'bold' }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ),
              { duration: Infinity, id: 'api-exhausted-toast' }
            );
          }
        } else {
          if (toastId) {
            toast.dismiss(toastId);
            toastId = null;
          }
        }
      } catch (error) {
        console.error('Failed to check system status:', error);
      }
    };

    checkSystemStatus();
    const interval = setInterval(checkSystemStatus, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Save active tab to localStorage whenever it changes
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    localStorage.setItem('adminActiveTab', tabId);
  };

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'create-user', name: 'Create User', icon: UserPlus },
    { id: 'plans', name: 'Plans & Packages', icon: CreditCard },
    { id: 'all-users', name: 'All Users', icon: Users },
  ];

  const handleLogout = () => {
    navigate('/login');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab />;
      case 'create-user':
        return <CreateUserTab />;
      case 'plans':
        return <PlansTab />;
      case 'all-users':
        return <AllUsersTab />;
      default:
        return <DashboardTab />;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: 'var(--color-gemini-bg)', overflow: 'hidden' }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? '280px' : '0',
        transition: 'width 0.3s',
        backgroundColor: 'var(--color-gemini-surface)',
        borderRight: '1px solid var(--color-gemini-border)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'fixed',
        height: '100vh',
        zIndex: 20,
        left: 0,
        top: 0
      }}>
        {/* Logo & Header */}
        <div style={{
          padding: '2rem 1.5rem',
          borderBottom: '2px solid var(--color-gemini-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          backgroundColor: 'var(--color-gemini-surface-2)'
        }}>
          <img src={logo} alt="Homoeo Intel" style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--color-gemini-text)', margin: '0 0 0.25rem 0' }}>
              Homoeo Intel
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--color-gemini-text-muted)', margin: 0, fontWeight: '500' }}>
              Super Admin Panel
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  handleTabChange(tab.id);
                  // Close sidebar on mobile after selecting a tab
                  if (isMobile) {
                    setSidebarOpen(false);
                  }
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.875rem 1rem',
                  marginBottom: '0.5rem',
                  border: 'none',
                  borderRadius: '12px',
                  backgroundColor: isActive ? 'var(--color-gemini-accent)' : 'transparent',
                  color: isActive ? 'white' : 'var(--color-gemini-text)',
                  fontSize: '15px',
                  fontWeight: isActive ? '600' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'var(--color-gemini-surface-hover)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <Icon size={20} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div style={{ padding: '1rem', borderTop: '1px solid var(--color-gemini-border)' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.875rem 1rem',
              border: 'none',
              borderRadius: '12px',
              backgroundColor: 'transparent',
              color: '#ef4444',
              fontSize: '15px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 15,
            display: isMobile ? 'block' : 'none'
          }}
        />
      )}

      {/* Main Content */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        overflow: 'hidden',
        marginLeft: !isMobile && sidebarOpen ? '280px' : '0',
        transition: 'margin-left 0.3s'
      }}>
        {/* Top Bar */}
        <header style={{
          height: '64px',
          backgroundColor: 'var(--color-gemini-surface)',
          borderBottom: '1px solid var(--color-gemini-border)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 2rem',
          gap: '1rem'
        }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              padding: '0.5rem',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: 'transparent',
              color: 'var(--color-gemini-text)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-gemini-surface-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <h1 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: 'var(--color-gemini-text)',
            margin: 0
          }}>
            {tabs.find(t => t.id === activeTab)?.name}
          </h1>
        </header>

        {/* Content Area */}
        <main style={{
          flex: 1,
          overflow: 'auto',
          padding: isMobile ? '1rem' : '2rem',
          backgroundColor: 'var(--color-gemini-bg)'
        }}>
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

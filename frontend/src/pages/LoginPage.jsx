import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import ThemeToggle from '../components/common/ThemeToggle';
import logo from '../assets/logo.png';
import { apiClient } from '../services/api';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const { login } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await apiClient.post('/auth/login', {
        email: formData.email,
        password: formData.password
      });
      const { access_token, user } = response.data;
      login(access_token, user);
      toast.success("Successfully logged in!");
      
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error("Auth error", error);
      toast.error(error.response?.data?.detail || "Invalid email or password");
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: theme === 'dark' 
        ? 'linear-gradient(135deg, #020617 0%, #111827 45%, #172554 100%)'
        : 'linear-gradient(135deg, #eff6ff 0%, #e0f2fe 45%, #ede9fe 100%)',
      padding: '1rem'
    }}>
      {/* Login/Signup Card */}
      <div style={{
        width: '100%',
        maxWidth: '480px',
        backgroundColor: theme === 'dark' ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        border: theme === 'dark' ? '1px solid rgba(148, 163, 184, 0.16)' : '1px solid rgba(226, 232, 240, 0.8)',
        borderRadius: '24px',
        padding: window.innerWidth < 640 ? '2rem 1.5rem' : '3rem 2.5rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        backdropFilter: 'blur(10px)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          {/* Logo */}
          <div style={{
            width: window.innerWidth < 640 ? '100px' : '120px',
            height: window.innerWidth < 640 ? '100px' : '120px',
            margin: '0 auto 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img 
              src={logo} 
              alt="Homoeo Intel Logo" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'contain',
                filter: theme === 'dark' ? 'brightness(1.1)' : 'brightness(1)'
              }} 
            />
          </div>
          
          
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: theme === 'dark' ? '#eff6ff' : '#0f172a', marginBottom: '0.5rem' }}>
            Welcome Back
          </h2>
          <p style={{ fontSize: '15px', color: theme === 'dark' ? '#cbd5e1' : '#64748b' }}>
            Sign in to continue
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Email Field */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: theme === 'dark' ? '#cbd5e1' : '#475569', marginBottom: '0.5rem' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 3rem',
                  fontSize: '15px',
                  border: theme === 'dark' ? '1px solid rgba(148, 163, 184, 0.16)' : '1px solid #e2e8f0',
                  borderRadius: '12px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  backgroundColor: theme === 'dark' ? '#182235' : 'white',
                  color: theme === 'dark' ? '#eff6ff' : '#0f172a'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#8b5cf6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: theme === 'dark' ? '#cbd5e1' : '#475569', marginBottom: '0.5rem' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 3rem 0.75rem 3rem',
                  fontSize: '15px',
                  border: theme === 'dark' ? '1px solid rgba(148, 163, 184, 0.16)' : '1px solid #e2e8f0',
                  borderRadius: '12px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  backgroundColor: theme === 'dark' ? '#182235' : 'white',
                  color: theme === 'dark' ? '#eff6ff' : '#0f172a'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#8b5cf6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.25rem',
                  color: '#94a3b8'
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.875rem',
              marginTop: '0.5rem',
              fontSize: '16px',
              fontWeight: '600',
              color: 'white',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 16px rgba(139, 92, 246, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
            }}
          >
            Sign In
            <ArrowRight size={20} />
          </button>
        </form>



      </div>

      {/* Theme Toggle */}
      <ThemeToggle />
    </div>
  );
};

export default LoginPage;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import ThemeToggle from '../components/common/ThemeToggle';
import logo from '../assets/logo.png';

const LoginPage = () => {
  const { login } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login();
    navigate('/');
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({ name: '', email: '', password: '' });
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
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p style={{ fontSize: '15px', color: theme === 'dark' ? '#cbd5e1' : '#64748b' }}>
            {isSignUp ? 'Sign up to get started' : 'Sign in to continue'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Name Field (Sign Up Only) */}
          {isSignUp && (
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: theme === 'dark' ? '#cbd5e1' : '#475569', marginBottom: '0.5rem' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required={isSignUp}
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
          )}

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

          {/* Forgot Password (Sign In Only) */}
          {!isSignUp && (
            <div style={{ textAlign: 'right', marginTop: '-0.5rem' }}>
              <button
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#8b5cf6',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
              >
                Forgot password?
              </button>
            </div>
          )}

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
            {isSignUp ? 'Create Account' : 'Sign In'}
            <ArrowRight size={20} />
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: theme === 'dark' ? 'rgba(148, 163, 184, 0.16)' : '#e2e8f0' }}></div>
          <span style={{ padding: '0 1rem', fontSize: '14px', color: '#94a3b8' }}>or</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: theme === 'dark' ? 'rgba(148, 163, 184, 0.16)' : '#e2e8f0' }}></div>
        </div>

        {/* Toggle Sign In/Sign Up */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: theme === 'dark' ? '#cbd5e1' : '#64748b' }}>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={toggleMode}
              style={{
                background: 'none',
                border: 'none',
                color: '#8b5cf6',
                fontWeight: '600',
                cursor: 'pointer',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
              onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>

      {/* Theme Toggle */}
      <ThemeToggle />
    </div>
  );
};

export default LoginPage;

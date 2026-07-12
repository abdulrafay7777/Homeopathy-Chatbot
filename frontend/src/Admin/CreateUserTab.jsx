import { useState } from 'react';
import { User, Mail, Lock, Shield, Save } from 'lucide-react';
import { apiClient } from '../services/api';
import toast from 'react-hot-toast';

const CreateUserTab = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient',
    subscription_start_date: '',
    subscription_end_date: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Frontend Validation
    if (formData.name.trim().length < 2) {
      return toast.error('Name must be at least 2 characters long');
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      return toast.error('Please enter a valid email address');
    }
    if (formData.password.length < 6) {
      return toast.error('Password must be at least 6 characters long');
    }
    
    try {
      const response = await apiClient.post('/admin/create-user', formData);
      toast.success('User created successfully!');
      setFormData({ name: '', email: '', password: '', role: 'patient', subscription_start_date: '', subscription_end_date: '' });
    } catch (error) {
      console.error('Error creating user:', error);
      // Handle Pydantic validation errors nicely
      if (error.response?.status === 422) {
        toast.error('Validation Error: Please check your input fields.');
      } else {
        toast.error(error.response?.data?.detail || 'Failed to create user. Please try again.');
      }
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      <div style={{
        backgroundColor: 'var(--color-gemini-surface)',
        border: '1px solid var(--color-gemini-border)',
        borderRadius: '16px',
        padding: window.innerWidth < 640 ? '1rem' : '2rem',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <h2 style={{
          fontSize: window.innerWidth < 640 ? '18px' : '24px',
          fontWeight: '700',
          color: 'var(--color-gemini-text)',
          marginBottom: '0.5rem'
        }}>
          Create New User
        </h2>
        <p style={{
          fontSize: window.innerWidth < 640 ? '13px' : '14px',
          color: 'var(--color-gemini-text-muted)',
          marginBottom: '1.5rem'
        }}>
          Add a new user to the system with their details and permissions
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
          {/* Name */}
          <div style={{ width: '100%' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: 'var(--color-gemini-text)',
              marginBottom: '0.5rem'
            }}>
              Full Name *
            </label>
            <div style={{ position: 'relative', width: '100%' }}>
              <User size={20} style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-gemini-text-muted)',
                pointerEvents: 'none'
              }} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 3rem',
                  fontSize: '15px',
                  border: '1px solid var(--color-gemini-border)',
                  borderRadius: '12px',
                  backgroundColor: 'var(--color-gemini-surface-2)',
                  color: 'var(--color-gemini-text)',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--color-gemini-accent)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--color-gemini-border)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Email */}
          <div style={{ width: '100%' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: 'var(--color-gemini-text)',
              marginBottom: '0.5rem'
            }}>
              Email Address *
            </label>
            <div style={{ position: 'relative', width: '100%' }}>
              <Mail size={20} style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-gemini-text-muted)',
                pointerEvents: 'none'
              }} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="user@example.com"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 3rem',
                  fontSize: '15px',
                  border: '1px solid var(--color-gemini-border)',
                  borderRadius: '12px',
                  backgroundColor: 'var(--color-gemini-surface-2)',
                  color: 'var(--color-gemini-text)',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--color-gemini-accent)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--color-gemini-border)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ width: '100%' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: 'var(--color-gemini-text)',
              marginBottom: '0.5rem'
            }}>
              Password *
            </label>
            <div style={{ position: 'relative', width: '100%' }}>
              <Lock size={20} style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-gemini-text-muted)',
                pointerEvents: 'none'
              }} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 3rem',
                  fontSize: '15px',
                  border: '1px solid var(--color-gemini-border)',
                  borderRadius: '12px',
                  backgroundColor: 'var(--color-gemini-surface-2)',
                  color: 'var(--color-gemini-text)',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--color-gemini-accent)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--color-gemini-border)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Role */}
          <div style={{ width: '100%' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: 'var(--color-gemini-text)',
              marginBottom: '0.5rem'
            }}>
              User Role *
            </label>
            <div style={{ position: 'relative', width: '100%' }}>
              <Shield size={20} style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-gemini-text-muted)',
                pointerEvents: 'none',
                zIndex: 1
              }} />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                style={{
                  appearance: 'none',
                  width: '100%',
                  padding: '0.75rem 2.5rem 0.75rem 3rem',
                  fontSize: '15px',
                  fontWeight: '500',
                  border: '2px solid var(--color-gemini-border)',
                  borderRadius: '12px',
                  backgroundColor: 'var(--color-gemini-surface-2)',
                  color: 'var(--color-gemini-text)',
                  outline: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23718096' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  backgroundSize: '16px',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--color-gemini-accent)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--color-gemini-border)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="patient">Doctor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {/* Subscription Dates */}
          <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 640 ? '1fr' : '1fr 1fr', gap: '1rem', width: '100%' }}>
            <div style={{ width: '100%' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--color-gemini-text)',
                marginBottom: '0.5rem'
              }}>
                Subscription Start Date
              </label>
              <input
                type="date"
                name="subscription_start_date"
                value={formData.subscription_start_date}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  fontSize: '15px',
                  border: '1px solid var(--color-gemini-border)',
                  borderRadius: '12px',
                  backgroundColor: 'var(--color-gemini-surface-2)',
                  color: 'var(--color-gemini-text)',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            
            <div style={{ width: '100%' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--color-gemini-text)',
                marginBottom: '0.5rem'
              }}>
                Subscription End Date
              </label>
              <input
                type="date"
                name="subscription_end_date"
                value={formData.subscription_end_date}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  fontSize: '15px',
                  border: '1px solid var(--color-gemini-border)',
                  borderRadius: '12px',
                  backgroundColor: 'var(--color-gemini-surface-2)',
                  color: 'var(--color-gemini-text)',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '1rem',
              marginTop: '1rem',
              fontSize: '16px',
              fontWeight: '600',
              color: 'white',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
              width: '100%',
              boxSizing: 'border-box'
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
            <Save size={20} />
            Create User
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateUserTab;

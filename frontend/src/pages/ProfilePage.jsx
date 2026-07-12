import { useState, useRef } from 'react';
import { ArrowLeft, User, Mail, Shield, Calendar, Key, Camera, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../services/api';
import { API_BASE_URL } from '../utils/constants';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const getImageUrl = (path) => {
    if (!path) return '';
    return `${API_BASE_URL.replace(/\/api$/, '')}${path}`;
  };

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsUploading(true);
      const token = localStorage.getItem('token');
      const response = await apiClient.post('/auth/profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data?.success) {
        updateUser(response.data.user);
        toast.success('Profile picture updated!');
      }
    } catch (error) {
      console.error('Upload failed', error);
      toast.error(error.response?.data?.detail || 'Failed to upload image');
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
      case 'patient':
        return 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)';
      default:
        return 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-gemini-bg)', color: 'var(--color-gemini-text)' }}>
      {/* Header */}
      <header style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 20, 
        backgroundColor: 'var(--color-gemini-surface)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--color-gemini-border)'
      }}>
        <div style={{ 
          maxWidth: '1280px', 
          margin: '0 auto', 
          padding: window.innerWidth < 640 ? '0 1rem' : '0 2rem', 
          height: '64px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between' 
        }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--color-gemini-text)',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '500',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.color = 'var(--color-gemini-accent)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--color-gemini-text)'}
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <h1 style={{ fontSize: '20px', fontWeight: '600' }}>Profile Overview</h1>
          <div style={{ width: '80px' }}></div>
        </div>
      </header>

      {/* Content */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        {/* Profile Card */}
        <div style={{
          backgroundColor: 'var(--color-gemini-surface)',
          border: '1px solid var(--color-gemini-border)',
          borderRadius: '24px',
          padding: '2.5rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
        }}>
          {/* Avatar Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
            <div style={{ position: 'relative' }}>
              <div 
                style={{
                  width: '96px',
                  height: '96px',
                  borderRadius: '50%',
                  position: 'relative',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  boxShadow: '0 8px 24px rgba(139, 92, 246, 0.3)',
                  background: user?.profile_image ? 'white' : 'linear-gradient(135deg, var(--color-gemini-accent) 0%, var(--color-gemini-accent-2) 50%, var(--color-gemini-accent-3) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  fontWeight: '700',
                  color: 'white',
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/jpeg, image/png, image/webp" 
                  style={{ display: 'none' }} 
                />
                
                {user?.profile_image ? (
                  <img 
                    src={getImageUrl(user.profile_image)} 
                    alt="Profile" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                ) : (
                  getInitials(user?.name)
                )}

                {/* Hover overlay */}
                <div 
                  className="opacity-0 hover:opacity-100 transition-opacity"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {isUploading ? <Loader2 className="animate-spin text-white" size={24} /> : <Camera className="text-white" size={24} />}
                </div>
              </div>
              
              {/* Persistent small camera icon */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                style={{
                  position: 'absolute',
                  bottom: '0',
                  right: '0',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-gemini-surface)',
                  border: '2px solid var(--color-gemini-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  zIndex: 10
                }}
              >
                <Camera size={14} style={{ color: 'var(--color-gemini-text)' }} />
              </div>
            </div>
            
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--color-gemini-text)' }}>
                {user?.name || 'User Name'}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <span style={{
                  padding: '0.375rem 1rem',
                  borderRadius: '9999px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'white',
                  background: getRoleBadgeColor(user?.role),
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                }}>
                  {user?.role === 'admin' ? 'admin' : user?.role === 'patient' ? 'doctor' : user?.role || 'User'}
                </span>
              </div>

            </div>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', backgroundColor: 'var(--color-gemini-border)', margin: '2rem 0' }}></div>

          {/* Profile Information */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
            {/* Name */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                backgroundColor: 'var(--color-gemini-surface-2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <User size={20} style={{ color: 'var(--color-gemini-accent)' }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '13px', fontWeight: '500', color: 'var(--color-gemini-text-muted)', marginBottom: '0.25rem' }}>
                  Full Name
                </p>
                <p style={{ fontSize: '16px', fontWeight: '500', color: 'var(--color-gemini-text)' }}>
                  {user?.name || 'Not set'}
                </p>
              </div>
            </div>

            {/* Email */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                backgroundColor: 'var(--color-gemini-surface-2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Mail size={20} style={{ color: 'var(--color-gemini-accent-2)' }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '13px', fontWeight: '500', color: 'var(--color-gemini-text-muted)', marginBottom: '0.25rem' }}>
                  Email Address
                </p>
                <p style={{ fontSize: '16px', fontWeight: '500', color: 'var(--color-gemini-text)' }}>
                  {user?.email || 'Not set'}
                </p>
              </div>
            </div>

            {/* Role */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                backgroundColor: 'var(--color-gemini-surface-2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Shield size={20} style={{ color: 'var(--color-gemini-accent-3)' }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '13px', fontWeight: '500', color: 'var(--color-gemini-text-muted)', marginBottom: '0.25rem' }}>
                  Account Role
                </p>
                <p style={{ fontSize: '16px', fontWeight: '500', color: 'var(--color-gemini-text)' }}>
                  {user?.role === 'admin' ? 'admin' : user?.role === 'patient' ? 'doctor' : user?.role || 'User'}
                </p>
              </div>
            </div>

            {/* Member Since */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                backgroundColor: 'var(--color-gemini-surface-2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Calendar size={20} style={{ color: 'var(--color-gemini-accent)' }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '13px', fontWeight: '500', color: 'var(--color-gemini-text-muted)', marginBottom: '0.25rem' }}>
                  Member Since
                </p>
                <p style={{ fontSize: '16px', fontWeight: '500', color: 'var(--color-gemini-text)' }}>
                  {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default ProfilePage;

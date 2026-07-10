import React from 'react';
import { ArrowLeft, HeartPulse, Shield, Zap, Info, Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ImportancePage = () => {
  const navigate = useNavigate();

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
            <span>Back to Dashboard</span>
          </button>
          <h1 style={{ fontSize: '20px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <HeartPulse size={24} style={{ color: 'var(--color-gemini-accent)' }} />
            Importance of Homoeopathic
          </h1>
          <div style={{ width: '80px' }}></div>
        </div>
      </header>

      {/* Content */}
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        
        {/* Hero Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem',
          padding: '3rem',
          backgroundColor: 'var(--color-gemini-surface)',
          borderRadius: '24px',
          border: '1px solid var(--color-gemini-border)',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--color-gemini-accent) 0%, var(--color-gemini-accent-2) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            color: 'white',
            boxShadow: '0 8px 24px rgba(139, 92, 246, 0.3)'
          }}>
            <HeartPulse size={40} />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--color-gemini-text)' }}>
            Why Homoeopathy & AI?
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--color-gemini-text-muted)', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>
            Discover how combining traditional homoeopathic wisdom with advanced artificial intelligence is revolutionizing natural healthcare and holistic healing.
          </p>
        </div>

        {/* Benefits Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          
          <div style={{ backgroundColor: 'var(--color-gemini-surface)', padding: '2rem', borderRadius: '20px', border: '1px solid var(--color-gemini-border)' }}>
            <Shield size={32} style={{ color: 'var(--color-gemini-accent)', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem' }}>Holistic Healing</h3>
            <p style={{ color: 'var(--color-gemini-text-muted)', lineHeight: '1.5' }}>
              Homoeopathy treats the whole person, not just the isolated disease. It addresses the root cause of the ailment by considering physical, mental, and emotional symptoms for true, lasting cure.
            </p>
          </div>

          <div style={{ backgroundColor: 'var(--color-gemini-surface)', padding: '2rem', borderRadius: '20px', border: '1px solid var(--color-gemini-border)' }}>
            <Zap size={32} style={{ color: '#f59e0b', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem' }}>Safe & Non-Toxic</h3>
            <p style={{ color: 'var(--color-gemini-text-muted)', lineHeight: '1.5' }}>
              Prepared from natural substances using the principle of potentization, homoeopathic medicines are completely safe, non-toxic, and free from harmful side effects, making them ideal for all ages.
            </p>
          </div>

          <div style={{ backgroundColor: 'var(--color-gemini-surface)', padding: '2rem', borderRadius: '20px', border: '1px solid var(--color-gemini-border)' }}>
            <Info size={32} style={{ color: '#3b82f6', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem' }}>The Power of AI</h3>
            <p style={{ color: 'var(--color-gemini-text-muted)', lineHeight: '1.5' }}>
              This intelligent chatbot analyzes thousands of complex symptom combinations in seconds. It bridges the gap between intricate materia medica and accurate remedy selection, assisting doctors instantly.
            </p>
          </div>

          <div style={{ backgroundColor: 'var(--color-gemini-surface)', padding: '2rem', borderRadius: '20px', border: '1px solid var(--color-gemini-border)' }}>
            <Clock size={32} style={{ color: '#10b981', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem' }}>Time & Accessibility</h3>
            <p style={{ color: 'var(--color-gemini-text-muted)', lineHeight: '1.5' }}>
              Case taking is often the most time-consuming part of homoeopathy. This AI assistant automates the extraction of key symptoms, saving valuable time and making healthcare more accessible.
            </p>
          </div>

        </div>

        {/* Conclusion */}
        <div style={{ backgroundColor: 'var(--color-gemini-surface-2)', padding: '2.5rem', borderRadius: '24px', border: '1px solid var(--color-gemini-border)' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>The Future of Medicine</h3>
          <p style={{ color: 'var(--color-gemini-text-muted)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            By blending the individualization of homoeopathic science with the vast data-processing capabilities of artificial intelligence, we are stepping into a new era of healthcare. The Homoeo Intel Chatbot ensures that no symptom is overlooked, leading to highly personalized, accurate, and effective prescriptions.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-gemini-accent)' }}>
            <CheckCircle size={20} />
            <span style={{ fontWeight: '500' }}>Empowering doctors, healing patients.</span>
          </div>
        </div>

      </main>
    </div>
  );
};

export default ImportancePage;
// Force Vite reload
import { Check, Crown, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const SubscriptionPage = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('standard');

  const plans = [
    {
      id: 'standard',
      name: 'Standard Plan',
      price: '5,000',
      currency: 'Rs',
      period: '/month',
      prompts: '6 consultations/day',
      users: 100,
      features: [
        'Consult up to 6 patients daily',
        'Full diagnosis analysis',
        'Priority support'
      ],
      buttonText: 'Current Plan',
      popular: true,
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-gemini-bg)', color: 'var(--color-gemini-text)' }}>
      {/* Header */}
      <header style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 20, 
        backgroundColor: 'rgba(var(--color-gemini-surface), 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--color-gemini-border)'
      }}>
        <div style={{ 
          maxWidth: '1280px', 
          margin: '0 auto', 
          padding: '0 2rem', 
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
          <h1 style={{ fontSize: '20px', fontWeight: '600' }}>Packages & Plans</h1>
          <div style={{ width: '80px' }}></div>
        </div>
      </header>

      {/* Content */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Title Section */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '700', 
            marginBottom: '0.75rem',
            background: 'linear-gradient(to right, var(--color-gemini-accent), var(--color-gemini-accent-2), var(--color-gemini-accent-3))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Choose Your Plan
          </h2>
          <p style={{ color: 'var(--color-gemini-text-muted)', fontSize: '16px' }}>
            Manage subscription plans — set pricing and daily prompt limits per plan.
          </p>
        </div>

        {/* Plans Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {plans.map((plan) => (
            <div
              key={plan.id}
              style={{
                position: 'relative',
                backgroundColor: 'var(--color-gemini-surface)',
                border: plan.popular ? '2px solid var(--color-gemini-accent)' : '1px solid var(--color-gemini-border)',
                borderRadius: '24px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s',
                boxShadow: plan.popular ? '0 8px 40px rgba(139, 92, 246, 0.25)' : '0 2px 8px rgba(0,0,0,0.1)',
                transform: plan.popular ? 'scale(1.05)' : 'scale(1)'
              }}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(to right, var(--color-gemini-accent), var(--color-gemini-accent-2))',
                  color: 'white',
                  padding: '0.375rem 1rem',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)'
                }}>
                  <Crown size={12} />
                  Most popular
                </div>
              )}

              {/* Plan Header */}
              <div style={{ marginBottom: '1.5rem', paddingTop: '0.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.25rem' }}>{plan.name}</h3>
                <p style={{ fontSize: '12px', color: 'var(--color-gemini-text-muted)', marginBottom: '1rem' }}>{plan.prompts}</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.875rem', fontWeight: '700' }}>{plan.currency} {plan.price}</span>
                  <span style={{ fontSize: '14px', color: 'var(--color-gemini-text-muted)' }}>{plan.period}</span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--color-gemini-text-muted)' }}>
                  Users on this plan: <span style={{ fontWeight: '600' }}>{plan.users}</span>
                </p>
              </div>

              {/* Features List */}
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', flex: '1' }}>
                {plan.features.map((feature, index) => (
                  <li key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', marginBottom: '0.625rem' }}>
                    <Check
                      size={16}
                      style={{ 
                        flexShrink: 0, 
                        marginTop: '2px',
                        color: plan.popular ? 'var(--color-gemini-accent)' : 'var(--color-gemini-accent-2)'
                      }}
                    />
                    <span style={{ fontSize: '14px', lineHeight: '1.6' }}>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => setSelectedPlan(plan.id)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '12px',
                  fontWeight: '600',
                  border: plan.popular ? 'none' : '1px solid var(--color-gemini-border)',
                  background: plan.popular 
                    ? 'linear-gradient(to right, var(--color-gemini-accent), var(--color-gemini-accent-2))' 
                    : 'var(--color-gemini-surface-2)',
                  color: plan.popular ? 'white' : 'var(--color-gemini-text)',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.02)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div style={{ marginTop: '4rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-gemini-text-muted)', fontSize: '14px' }}>
            All plans include access to our AI chatbot. Need a custom plan?{' '}
            <button style={{ 
              color: 'var(--color-gemini-accent)', 
              background: 'transparent', 
              border: 'none', 
              cursor: 'pointer',
              textDecoration: 'underline',
              fontWeight: '500'
            }}>
              Contact us
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;

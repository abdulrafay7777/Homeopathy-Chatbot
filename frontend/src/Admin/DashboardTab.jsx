import { Users, MessageSquare, CreditCard } from 'lucide-react';

const DashboardTab = () => {
  const stats = [
    {
      title: 'Total Users',
      value: '2,543',
      icon: Users,
      color: '#8b5cf6'
    },
    {
      title: 'Active Chats',
      value: '1,234',
      icon: MessageSquare,
      color: '#38bdf8'
    },
    {
      title: 'Subscriptions',
      value: '892',
      icon: CreditCard,
      color: '#fb7185'
    }
  ];

  const recentUsers = [
    { id: 1, name: 'Dr. AbdulRafay', email: 'abdul@example.com', role: 'Doctor', date: '2 hours ago' },
    { id: 2, name: 'Ali Khan', email: 'ali@example.com', role: 'Student', date: '5 hours ago' },
    { id: 3, name: 'Abdullah', email: 'abdullah@example.com', role: 'Student', date: '1 day ago' },
  ];

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: window.innerWidth < 640 ? '0' : 'initial' }}>
      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: window.innerWidth < 640 ? '1fr' : window.innerWidth < 1024 ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              style={{
                backgroundColor: 'var(--color-gemini-surface)',
                border: '1px solid var(--color-gemini-border)',
                borderRadius: '16px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: `${stat.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={24} style={{ color: stat.color }} />
                </div>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: stat.changeType === 'positive' ? '#22c55e' : '#ef4444'
                }}>
                  {stat.change}
                </span>
              </div>
              <div>
                <p style={{
                  fontSize: '13px',
                  color: 'var(--color-gemini-text-muted)',
                  margin: '0 0 0.5rem 0'
                }}>
                  {stat.title}
                </p>
                <p style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: 'var(--color-gemini-text)',
                  margin: 0
                }}>
                  {stat.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Users */}
      <div style={{
        backgroundColor: 'var(--color-gemini-surface)',
        border: '1px solid var(--color-gemini-border)',
        borderRadius: '16px',
        padding: '1.5rem'
      }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '700',
          color: 'var(--color-gemini-text)',
          marginBottom: '1.5rem'
        }}>
          Recent Users
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {recentUsers.map((user) => (
            <div
              key={user.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                borderRadius: '12px',
                backgroundColor: 'var(--color-gemini-surface-2)',
                border: '1px solid var(--color-gemini-border)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #8b5cf6, #38bdf8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: '600'
                }}>
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p style={{
                    fontSize: '15px',
                    fontWeight: '600',
                    color: 'var(--color-gemini-text)',
                    margin: '0 0 0.25rem 0'
                  }}>
                    {user.name}
                  </p>
                  <p style={{
                    fontSize: '13px',
                    color: 'var(--color-gemini-text-muted)',
                    margin: 0
                  }}>
                    {user.email}
                  </p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{
                  fontSize: '12px',
                  padding: '0.375rem 0.75rem',
                  borderRadius: '9999px',
                  backgroundColor: user.role === 'Doctor' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(56, 189, 248, 0.1)',
                  color: user.role === 'Doctor' ? '#8b5cf6' : '#38bdf8',
                  fontWeight: '600'
                }}>
                  {user.role}
                </span>
                <p style={{
                  fontSize: '12px',
                  color: 'var(--color-gemini-text-muted)',
                  margin: '0.5rem 0 0 0'
                }}>
                  {user.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;

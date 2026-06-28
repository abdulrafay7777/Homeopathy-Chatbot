import { useState, useEffect } from 'react';
import { Users, MessageSquare, CreditCard, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { apiClient } from '../services/api';

const DashboardTab = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [stats, setStats] = useState([
    { title: 'Total Users', value: '0', icon: Users, color: '#8b5cf6' },
    { title: 'Active Chats', value: '0', icon: MessageSquare, color: '#38bdf8' },
    { title: 'Subscriptions', value: '0', icon: CreditCard, color: '#fb7185' }
  ]);
  
  const [recentUsers, setRecentUsers] = useState([]);
  const [graphData, setGraphData] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/admin/dashboard-stats');
        const data = response.data;
        
        setStats([
          { title: 'Total Users', value: data.stats.totalUsers.toString(), icon: Users, color: '#8b5cf6' },
          { title: 'Total Consultations', value: data.stats.activeChats.toString(), icon: Activity, color: '#38bdf8' },
          { title: 'Subscriptions', value: data.stats.subscriptions.toString(), icon: CreditCard, color: '#fb7185' }
        ]);
        
        setRecentUsers(data.recentUsers);
        setGraphData(data.graphData);
      } catch (err) {
        setError(err.message || "Failed to load dashboard data");
        console.error("Error fetching admin stats:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-full p-12 text-lg opacity-70">Loading dashboard metrics...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-full p-12 text-red-500">Error: {error}</div>;
  }

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
          
          {recentUsers.length === 0 && (
            <p className="opacity-60 p-4 text-center">No recent users found.</p>
          )}
        </div>
      </div>

      {/* AI Consultation Graph */}
      <div style={{
        backgroundColor: 'var(--color-gemini-surface)',
        border: '1px solid var(--color-gemini-border)',
        borderRadius: '16px',
        padding: '1.5rem',
        marginTop: '2rem',
        height: '400px'
      }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '700',
          color: 'var(--color-gemini-text)',
          marginBottom: '1.5rem'
        }}>
          Consultations per Patient
        </h3>
        
        {graphData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={graphData}
              margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis 
                dataKey="patientName" 
                tick={{ fill: 'var(--color-gemini-text-muted)' }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fill: 'var(--color-gemini-text-muted)' }} allowDecimals={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--color-gemini-surface-2)', 
                  borderColor: 'var(--color-gemini-border)',
                  color: 'var(--color-gemini-text)',
                  borderRadius: '8px'
                }} 
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="consultations" name="Total Consultations" fill="#38bdf8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full opacity-60">
            No consultation data available yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardTab;

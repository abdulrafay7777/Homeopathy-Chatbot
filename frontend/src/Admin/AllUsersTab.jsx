import { useState, useEffect } from 'react';
import { Search, Filter, Key, X, Eye, EyeOff } from 'lucide-react';
import { apiClient } from '../services/api';
import toast from 'react-hot-toast';

const AllUsersTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resetModalUser, setResetModalUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiClient.get('/admin/users');
        const fetchedUsers = response.data.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          subscription_start_date: user.subscription_start_date,
          subscription_end_date: user.subscription_end_date,
          is_active: user.is_active,
          joinDate: user.created_at
        }));
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return { bg: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' };
      case 'patient':
        return { bg: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' };
      default:
        return { bg: 'rgba(107, 114, 128, 0.1)', color: '#6b7280' };
    }
  };

  const getStatusBadgeColor = (isActive) => {
    return {
      bg: isActive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
      color: isActive ? '#22c55e' : '#ef4444'
    };
  };

  const getDetailedStatus = (user) => {
    if (!user.is_active) return { text: 'Disabled', color: '#ef4444' };
    if (!user.subscription_start_date && !user.subscription_end_date) return { text: 'Active', color: '#22c55e' };
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const start = user.subscription_start_date ? new Date(user.subscription_start_date) : null;
    const end = user.subscription_end_date ? new Date(user.subscription_end_date) : null;
    
    if (start) start.setHours(0, 0, 0, 0);
    if (end) end.setHours(0, 0, 0, 0);
    
    if (start && today < start) return { text: 'Pending', color: '#eab308' };
    if (end && today > end) return { text: 'Expired', color: '#ef4444' };
    
    return { text: 'Active', color: '#22c55e' };
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      await apiClient.put(`/admin/users/${userId}`, { is_active: !currentStatus });
      setUsers(users.map(u => u.id === userId ? { ...u, is_active: !currentStatus } : u));
      toast.success(`User consultation access ${!currentStatus ? 'enabled' : 'disabled'}`);
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setIsResetting(true);
    try {
      await apiClient.put(`/admin/users/${resetModalUser.id}/password`, { password: newPassword });
      toast.success('Password updated successfully');
      setResetModalUser(null);
      setNewPassword('');
    } catch (error) {
      toast.error('Failed to update password');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: window.innerWidth < 640 ? '0' : 'initial' }}>
      {/* Header with Search and Filter */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: window.innerWidth < 640 ? '20px' : '24px', fontWeight: '700', color: 'var(--color-gemini-text)', margin: '0 0 1.5rem 0' }}>
          All Users
        </h2>
        
        <div className="flex gap-4 flex-wrap flex-col sm:flex-row w-full">
          {/* Search */}
          <div className="flex-1 w-full sm:min-w-[300px] relative">
            <Search size={20} style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-gemini-text-muted)'
            }} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 3rem',
                fontSize: '15px',
                border: '1px solid var(--color-gemini-border)',
                borderRadius: '12px',
                backgroundColor: 'var(--color-gemini-surface)',
                color: 'var(--color-gemini-text)',
                outline: 'none'
              }}
            />
          </div>

          {/* Filter by Role */}
          <div className="w-full sm:min-w-[200px] relative">
            <Filter size={20} style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-gemini-text-muted)',
              pointerEvents: 'none',
              zIndex: 1
            }} />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              style={{
                appearance: 'none',
                width: '100%',
                padding: '0.75rem 2.5rem 0.75rem 3rem',
                fontSize: '15px',
                fontWeight: '500',
                border: '2px solid var(--color-gemini-border)',
                borderRadius: '12px',
                backgroundColor: 'var(--color-gemini-surface)',
                color: 'var(--color-gemini-text)',
                cursor: 'pointer',
                outline: 'none',
                transition: 'all 0.2s',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23718096' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
                backgroundSize: '16px'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = 'var(--color-gemini-accent)';
                e.target.style.backgroundColor = 'var(--color-gemini-surface-2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = 'var(--color-gemini-border)';
                e.target.style.backgroundColor = 'var(--color-gemini-surface)';
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
              <option value="all" style={{ padding: '0.5rem', backgroundColor: 'var(--color-gemini-surface)', color: 'var(--color-gemini-text)' }}>All Roles</option>
              <option value="admin" style={{ padding: '0.5rem', backgroundColor: 'var(--color-gemini-surface)', color: 'var(--color-gemini-text)' }}>Doctors</option>
              <option value="patient" style={{ padding: '0.5rem', backgroundColor: 'var(--color-gemini-surface)', color: 'var(--color-gemini-text)' }}>Students</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div style={{
        backgroundColor: 'var(--color-gemini-surface)',
        border: '1px solid var(--color-gemini-border)',
        borderRadius: '16px',
        overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-gemini-surface-2)', borderBottom: '1px solid var(--color-gemini-border)' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: 'var(--color-gemini-text)' }}>User</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: 'var(--color-gemini-text)' }}>Email</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: 'var(--color-gemini-text)' }}>Role</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: 'var(--color-gemini-text)' }}>Sub Start</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: 'var(--color-gemini-text)' }}>Sub End</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: 'var(--color-gemini-text)' }}>Consultation Status</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: 'var(--color-gemini-text)' }}>Join Date</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: 'var(--color-gemini-text)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const roleBadge = getRoleBadgeColor(user.role);
                const statusBadge = getStatusBadgeColor(user.is_active);
                
                return (
                  <tr key={user.id} style={{ borderBottom: '1px solid var(--color-gemini-border)' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #8b5cf6, #38bdf8)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '16px',
                          fontWeight: '600'
                        }}>
                          {user.name.charAt(0)}
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-gemini-text)' }}>
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '14px', color: 'var(--color-gemini-text-muted)' }}>
                      {user.email}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        padding: '0.375rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: roleBadge.bg,
                        color: roleBadge.color,
                        textTransform: 'capitalize'
                      }}>
                        {user.role === 'admin' ? 'doctor' : user.role === 'patient' ? 'student' : user.role}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '14px', fontWeight: '500', color: 'var(--color-gemini-text)' }}>
                      {user.subscription_start_date ? new Date(user.subscription_start_date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td style={{ padding: '1rem', fontSize: '14px', fontWeight: '500', color: 'var(--color-gemini-text)' }}>
                      {user.subscription_end_date ? new Date(user.subscription_end_date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div 
                          onClick={() => toggleUserStatus(user.id, user.is_active)}
                          style={{
                            width: '44px',
                            height: '24px',
                            backgroundColor: user.is_active ? '#22c55e' : '#e5e7eb',
                            borderRadius: '9999px',
                            position: 'relative',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s ease'
                          }}
                        >
                          <div style={{
                            width: '20px',
                            height: '20px',
                            backgroundColor: 'white',
                            borderRadius: '50%',
                            position: 'absolute',
                            top: '2px',
                            left: user.is_active ? '22px' : '2px',
                            transition: 'left 0.2s ease',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }} />
                        </div>
                        <span style={{ 
                          fontSize: '13px', 
                          fontWeight: '600', 
                          color: getDetailedStatus(user).color 
                        }}>
                          {getDetailedStatus(user).text}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '14px', color: 'var(--color-gemini-text-muted)' }}>
                      {new Date(user.joinDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <button
                        onClick={() => setResetModalUser(user)}
                        title="Reset Password"
                        style={{
                          background: 'rgba(139, 92, 246, 0.1)',
                          color: 'var(--color-gemini-accent)',
                          border: 'none',
                          padding: '0.5rem',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'background 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)'}
                      >
                        <Key size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{
            padding: '3rem',
            textAlign: 'center',
            color: 'var(--color-gemini-text-muted)'
          }}>
            <p style={{ fontSize: '15px', margin: 0 }}>Loading users...</p>
          </div>
        )}

        {/* No Results */}
        {!loading && filteredUsers.length === 0 && (
          <div style={{
            padding: '3rem',
            textAlign: 'center',
            color: 'var(--color-gemini-text-muted)'
          }}>
            <p style={{ fontSize: '15px', margin: 0 }}>No users found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Summary */}
      <div style={{
        marginTop: '1.5rem',
        padding: '1rem 1.5rem',
        backgroundColor: 'var(--color-gemini-surface)',
        border: '1px solid var(--color-gemini-border)',
        borderRadius: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <p style={{ fontSize: '14px', color: 'var(--color-gemini-text-muted)', margin: 0 }}>
          Showing <span style={{ fontWeight: '600', color: 'var(--color-gemini-text)' }}>{filteredUsers.length}</span> of <span style={{ fontWeight: '600', color: 'var(--color-gemini-text)' }}>{users.length}</span> users
        </p>
      </div>

      {/* Reset Password Modal */}
      {resetModalUser && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 50
        }}>
          <div style={{
            backgroundColor: 'var(--color-gemini-surface)',
            border: '1px solid var(--color-gemini-border)',
            borderRadius: '16px',
            padding: '2rem',
            width: '90%',
            maxWidth: '400px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-gemini-text)', margin: 0 }}>Reset Password</h3>
              <button 
                onClick={() => { setResetModalUser(null); setNewPassword(''); setShowPassword(false); }}
                style={{ background: 'transparent', border: 'none', color: 'var(--color-gemini-text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>
            
            <p style={{ fontSize: '14px', color: 'var(--color-gemini-text-muted)', marginBottom: '1.5rem' }}>
              Enter a new password for <strong style={{ color: 'var(--color-gemini-text)' }}>{resetModalUser.name}</strong>.
            </p>

            <form onSubmit={handleResetPassword}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: 'var(--color-gemini-text-muted)', marginBottom: '0.5rem' }}>
                  New Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter at least 6 characters"
                    style={{
                      width: '100%', padding: '0.75rem', paddingRight: '2.5rem', fontSize: '14px',
                      backgroundColor: 'var(--color-gemini-surface-2)',
                      border: '1px solid var(--color-gemini-border)',
                      borderRadius: '8px', color: 'var(--color-gemini-text)', outline: 'none'
                    }}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', color: 'var(--color-gemini-text-muted)',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => { setResetModalUser(null); setNewPassword(''); setShowPassword(false); }}
                  style={{
                    padding: '0.5rem 1rem', fontSize: '14px', fontWeight: '500',
                    backgroundColor: 'transparent', color: 'var(--color-gemini-text)',
                    border: '1px solid var(--color-gemini-border)', borderRadius: '8px', cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isResetting}
                  style={{
                    padding: '0.5rem 1rem', fontSize: '14px', fontWeight: '500',
                    backgroundColor: 'var(--color-gemini-accent)', color: 'white',
                    border: 'none', borderRadius: '8px', cursor: isResetting ? 'not-allowed' : 'pointer',
                    opacity: isResetting ? 0.7 : 1
                  }}
                >
                  {isResetting ? 'Saving...' : 'Save Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUsersTab;

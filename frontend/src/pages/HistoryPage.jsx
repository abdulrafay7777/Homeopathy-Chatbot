import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Search, Filter, Eye, X } from 'lucide-react';
import ChatHeader from '../components/chat/ChatHeader';
import Loader from '../components/common/Loader';
import { apiClient } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ConsultationResult from '../components/chat/ConsultationResult';

const HistoryPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConsultation, setSelectedConsultation] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await apiClient.get('/consultations');
        if (response.data?.success) {
          setHistory(response.data.data);
        } else {
          setError('Failed to load history');
        }
      } catch (err) {
        setError('Error connecting to server.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const filteredHistory = history.filter(item => {
    const name = item.patient?.name?.toLowerCase() || '';
    const phone = item.patient?.phone?.toLowerCase() || '';
    const disease = item.patient?.disease?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();
    return name.includes(search) || phone.includes(search) || disease.includes(search);
  });

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden" style={{ backgroundColor: 'var(--color-gemini-bg)', color: 'var(--color-gemini-text)' }}>
      <ChatHeader />
      
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-12 flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-medium tracking-tight" style={{
                background: 'linear-gradient(to right, var(--color-gemini-accent), var(--color-gemini-accent-2))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Patients History
              </h1>
            </div>
            
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors border cursor-pointer hover:bg-black/5"
              style={{ borderColor: 'var(--color-gemini-border)', color: 'var(--color-gemini-text)' }}
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </button>
          </div>

          <div className="relative mb-10">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by patient name, number, or disease..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl outline-none border transition-colors focus:border-[var(--color-gemini-accent)]"
              style={{ backgroundColor: 'var(--color-gemini-surface)', borderColor: 'var(--color-gemini-border)', color: 'var(--color-gemini-text)' }}
            />
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader />
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="p-12 rounded-3xl text-center border border-dashed flex flex-col items-center" style={{ borderColor: 'var(--color-gemini-border)' }}>
              <Clock size={48} style={{ color: 'var(--color-gemini-text-muted)' }} className="mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No history found</h3>
              <p className="text-sm max-w-md" style={{ color: 'var(--color-gemini-text-muted)' }}>
                {searchTerm ? "No patients match your search criteria." : "You haven't conducted any consultations yet. Start a new consultation from the dashboard to see history here."}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {filteredHistory.map((item, idx) => (
                <div key={item._id || idx} className="p-5 sm:p-6 rounded-3xl border transition-all hover:shadow-md flex flex-col" style={{ borderColor: 'var(--color-gemini-border)', backgroundColor: 'var(--color-gemini-surface)' }}>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <div>
                      <h3 className="text-xl font-semibold flex flex-wrap items-center gap-2">
                        {item.patient?.name}
                        <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: 'var(--color-gemini-bg)', color: 'var(--color-gemini-text-muted)' }}>
                           {item.patient?.phone ? `${item.patient.phone} • ` : ''}{item.patient?.age} • {item.patient?.gender}
                        </span>
                      </h3>
                      <p className="text-sm font-medium mt-1.5" style={{ color: 'var(--color-gemini-accent)' }}>
                        Condition: {item.patient?.disease || item.patient?.symptoms}
                      </p>
                    </div>
                    
                    <div className="text-sm flex items-center gap-1.5 whitespace-nowrap bg-black/5 px-3 py-1.5 rounded-full" style={{ color: 'var(--color-gemini-text-muted)' }}>
                      <Clock size={14} />
                      {new Date(item.created_at).toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t flex-1" style={{ borderColor: 'var(--color-gemini-border)' }}>
                    <h4 className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: 'var(--color-gemini-text-muted)' }}>Prescribed Medicines</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.recommendation?.medicines?.map((med, i) => (
                        <span key={i} className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          {med.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-2 flex justify-end">
                      <button
                        onClick={() => setSelectedConsultation(item)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-transform hover:scale-105 cursor-pointer shadow-sm"
                        style={{ backgroundColor: 'var(--color-gemini-accent)', color: 'white', border: 'none' }}
                      >
                        <Eye size={16} />
                        View Full Details
                      </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedConsultation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }}>
          <div className="relative w-full max-w-4xl max-h-full overflow-hidden rounded-3xl flex flex-col shadow-2xl" style={{ backgroundColor: 'var(--color-gemini-bg)', border: '1px solid var(--color-gemini-border)' }}>
            <div className="flex items-center justify-between p-4 sm:p-6 border-b" style={{ borderColor: 'var(--color-gemini-border)' }}>
              <h2 className="text-xl font-semibold">Consultation Details</h2>
              <div className="flex items-center gap-3">
                {user?.model_access !== 'beginner' && (
                  <button 
                    onClick={() => navigate('/chat-consultation', { state: { resumeConsultation: selectedConsultation } })}
                    className="px-4 py-2 rounded-full text-sm font-semibold transition-transform hover:scale-105 cursor-pointer shadow-sm"
                    style={{ backgroundColor: 'var(--color-gemini-accent)', color: 'white', border: 'none' }}
                  >
                    Continue Chat
                  </button>
                )}
                <button 
                  onClick={() => setSelectedConsultation(null)}
                  className="p-2 rounded-full hover:bg-black/5 transition-colors cursor-pointer"
                  style={{ color: 'var(--color-gemini-text)' }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <ConsultationResult historicalData={selectedConsultation} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;

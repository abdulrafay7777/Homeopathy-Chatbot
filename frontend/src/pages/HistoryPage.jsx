import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Search, Filter } from 'lucide-react';
import ChatHeader from '../components/chat/ChatHeader';
import Loader from '../components/common/Loader';
import { apiClient } from '../services/api';

const HistoryPage = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
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

          <div className="relative mb-6">
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
            <div className="space-y-4">
              {filteredHistory.map((item, idx) => (
                <div key={item._id || idx} className="p-5 sm:p-6 rounded-3xl border transition-all hover:shadow-md" style={{ borderColor: 'var(--color-gemini-border)', backgroundColor: 'var(--color-gemini-surface)' }}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2 border-b pb-4" style={{ borderColor: 'var(--color-gemini-border)' }}>
                    <div>
                      <h3 className="text-xl font-semibold">{item.patient?.name} <span className="text-sm font-normal opacity-70">({item.patient?.phone ? `${item.patient.phone}, ` : ''}{item.patient?.age}, {item.patient?.gender})</span></h3>
                      <p className="text-sm font-medium mt-1" style={{ color: 'var(--color-gemini-accent)' }}>
                        Condition: {item.patient?.disease || item.patient?.symptoms}
                      </p>
                    </div>
                    <div className="text-sm flex items-center gap-1.5 whitespace-nowrap" style={{ color: 'var(--color-gemini-text-muted)' }}>
                      <Clock size={14} />
                      {new Date(item.created_at).toLocaleString()}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--color-gemini-text-muted)' }}>Prescribed Medicines:</h4>
                    <div className="flex flex-wrap gap-2">
                      {item.recommendation?.medicines?.map((med, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          {med.name} - {med.dosage}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;

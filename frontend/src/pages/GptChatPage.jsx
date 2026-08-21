import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Send, User, Bot, Loader2, ArrowRight } from 'lucide-react';
import ChatHeader from '../components/chat/ChatHeader';
import { fetchFollowUpQuestions, submitConsultation, generateDietLabs, continueConversation } from '../services/chatService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const GptChatPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const isBeginner = user?.model_access === 'beginner';
  
  // App states: 'demographics' | 'chat'
  const [appState, setAppState] = useState('demographics');
  
  // Patient Details
  const [patient, setPatient] = useState({
    name: '',
    age: '',
    gender: 'Male',
    maritalStatus: 'Single',
    phone: '',
    symptoms: '',
    disease: '',
    usedCustomDisease: false,
    followUpAnswers: []
  });

  // Chat States
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Chat Flow State
  const [chatPhase, setChatPhase] = useState('chatting'); // 'chatting' | 'done'
  const [consultationSummary, setConsultationSummary] = useState('');
  const [hasGeneratedDietLabs, setHasGeneratedDietLabs] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (appState === 'chat') {
      scrollToBottom();
    }
  }, [messages, isTyping, appState]);

  useEffect(() => {
    if (location.state?.resumeConsultation) {
      const data = location.state.resumeConsultation;
      setPatient(data.patient || {});
      setAppState('chat');
      setChatPhase('done');
      
      const reconstructedMessages = [
        { sender: 'bot', text: `Hello ${data.patient?.name}! I am your AI Homeopathic Assistant.` },
        { sender: 'user', text: data.patient?.symptoms || 'I need a consultation.' }
      ];
      if (data.recommendation?.analysis) {
        reconstructedMessages.push({ sender: 'bot', text: `Analysis:\n${data.recommendation.analysis}` });
      }
      setMessages(reconstructedMessages);
      
      // Clear state so reload doesn't trigger it again
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleDemographicsSubmit = (e) => {
    e.preventDefault();
    if (!patient.name || !patient.age || !patient.phone) {
      toast.error('Please fill in required fields');
      return;
    }
    setAppState('chat');
    setMessages([
      { sender: 'bot', text: `Hello ${patient.name}! I am your AI Homeopathic Assistant. Please describe your main symptoms in detail.` }
    ]);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    
    if (chatPhase === 'chatting') {
      setIsTyping(true);
      if (!patient.symptoms) {
        setPatient(prev => ({ ...prev, symptoms: userMessage }));
      }
      
      try {
        const history = messages.map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text }));
        
        const responseText = await continueConversation(userMessage, history);
        setMessages(prev => [...prev, { sender: 'bot', text: responseText }]);
      } catch (error) {
        toast.error(error.message || 'Failed to send message');
        setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, I encountered an error. Please try again.' }]);
      } finally {
        setIsTyping(false);
      }
    } else if (chatPhase === 'done') {
      setIsTyping(true);
      try {
        const history = messages.map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text }));
        if (consultationSummary) {
          history.unshift({ role: 'assistant', content: `Consultation Context:\n${consultationSummary}` });
        }
        
        const responseText = await continueConversation(userMessage, history);
        setMessages(prev => [...prev, { sender: 'bot', text: responseText }]);
      } catch (error) {
        toast.error('Failed to send message');
      } finally {
        setIsTyping(false);
      }
    }
  };

  const handleGenerateFinal = async () => {
    setIsTyping(true);
    setChatPhase('done');
    
    // Combine all history as "symptoms" for the final consultation AI
    const allSymptoms = messages.map(m => `${m.sender === 'user' ? 'Patient' : 'Doctor'}: ${m.text}`).join('\n');
    await generateFinalResult(allSymptoms, []);
  };

  const handleGenerateDietLabs = async () => {
    setIsTyping(true);
    setHasGeneratedDietLabs(true);
    setMessages(prev => [...prev, { sender: 'user', text: 'Please provide my customized Diet Plan and recommended Lab Tests.' }]);
    try {
      const result = await generateDietLabs(consultationSummary, patient.disease || patient.symptoms);
      
      let text = `**Recommended Lab Tests:**\n`;
      result.lab_tests.forEach(t => text += `- ${t}\n`);
      text += `\n**Custom Diet Plan:**\n${result.diet_plan}`;
      
      setMessages(prev => [...prev, { sender: 'bot', text, isRecommendation: true }]);
    } catch (error) {
      toast.error('Failed to generate diet and labs');
    } finally {
      setIsTyping(false);
    }
  };

  const generateFinalResult = async (symptoms, answers) => {
    try {
      const finalPatientData = {
        ...patient,
        symptoms,
        followUpAnswers: answers,
        disease: 'Custom',
        usedCustomDisease: true,
      };
      
      setMessages(prev => [...prev, { sender: 'bot', text: 'Thank you. I am now analyzing your complete case to generate homeopathic recommendations...', isStatus: true }]);
      
      const result = await submitConsultation(finalPatientData);
      
      let resultText = `**Analysis:**\n${result.analysis || 'Completed.'}\n\n`;
      if (result.medicines && result.medicines.length > 0) {
        resultText += `**Recommended Medicines:**\n`;
        result.medicines.forEach(m => {
          resultText += `- **${m.name}**: ${m.dosage}\n`;
          resultText += `  • *Confidence: ${m.match_percentage}%*\n`;
          resultText += `  • *Reason: ${m.description}*\n`;
          if (m.safety_warnings) resultText += `  • *Safety: ${m.safety_warnings}*\n`;
        });
      }
      if (result.recommended_tests && result.recommended_tests.length > 0) {
        resultText += `\n**Advice:**\n`;
        result.recommended_tests.forEach(t => {
          resultText += `- ${t}\n`;
        });
      }

      setConsultationSummary(resultText);
      setMessages(prev => [...prev, { sender: 'bot', text: resultText, isRecommendation: true }]);
    } catch (error) {
      toast.error(error.message || 'Failed to generate recommendation');
      setMessages(prev => [...prev, { sender: 'bot', text: 'I apologize, but I could not generate a recommendation due to a server error.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const formatText = (text) => {
    // Simple bold formatting replacement
    return text.split('**').map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part);
  };

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden" style={{ backgroundColor: 'var(--color-gemini-bg)', color: 'var(--color-gemini-text)' }}>
      <ChatHeader />
      
      <div style={{ flex: '1 1 0%', display: 'flex', flexDirection: 'column', width: '100%', position: 'relative', overflow: 'hidden' }}>
        {appState === 'demographics' ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', overflowY: 'auto', padding: '2rem 1rem', width: '100%' }}>
            <div 
              style={{ 
                width: '100%',
                maxWidth: '520px', 
                padding: '2rem',
                borderRadius: '1.25rem',
                border: '1px solid var(--color-gemini-border)',
                backgroundColor: 'var(--color-gemini-surface)', 
                boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.15)',
                margin: '0 auto',
                position: 'relative',
                zIndex: 1
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '2rem' }}>
                <div 
                  style={{ 
                    width: '64px', 
                    height: '64px', 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                    background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                    color: 'white',
                    boxShadow: '0 10px 15px -3px rgba(168, 85, 247, 0.4)',
                    position: 'relative',
                    zIndex: 2
                  }}
                >
                  <Bot size={32} />
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--color-gemini-text)' }}>Patient Details</h2>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-gemini-text-muted)', lineHeight: '1.4' }}>Let's get started with some basic information before we begin the AI consultation.</p>
              </div>

              <form onSubmit={handleDemographicsSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.4rem', color: 'var(--color-gemini-text)' }}>Full Name <span style={{ color: '#ec4899' }}>*</span></label>
                  <input 
                    required 
                    type="text" 
                    value={patient.name} 
                    onChange={e => setPatient({...patient, name: e.target.value})} 
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--color-gemini-border)', backgroundColor: 'var(--color-gemini-surface-2)', color: 'var(--color-gemini-text)', outline: 'none', transition: 'border-color 0.2s' }} 
                    placeholder="Enter full name"
                    onFocus={(e) => e.target.style.borderColor = '#a855f7'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--color-gemini-border)'}
                  />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.4rem', color: 'var(--color-gemini-text)' }}>Age <span style={{ color: '#ec4899' }}>*</span></label>
                    <input 
                      required 
                      type="number" 
                      value={patient.age} 
                      onChange={e => setPatient({...patient, age: e.target.value})} 
                      style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--color-gemini-border)', backgroundColor: 'var(--color-gemini-surface-2)', color: 'var(--color-gemini-text)', outline: 'none', transition: 'border-color 0.2s' }} 
                      placeholder="e.g. 35"
                      onFocus={(e) => e.target.style.borderColor = '#a855f7'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--color-gemini-border)'}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.4rem', color: 'var(--color-gemini-text)' }}>Gender</label>
                    <select 
                      value={patient.gender} 
                      onChange={e => setPatient({...patient, gender: e.target.value})} 
                      style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--color-gemini-border)', backgroundColor: 'var(--color-gemini-surface-2)', color: 'var(--color-gemini-text)', outline: 'none', cursor: 'pointer', transition: 'border-color 0.2s' }}
                      onFocus={(e) => e.target.style.borderColor = '#a855f7'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--color-gemini-border)'}
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.4rem', color: 'var(--color-gemini-text)' }}>Marital Status</label>
                    <select 
                      value={patient.maritalStatus} 
                      onChange={e => setPatient({...patient, maritalStatus: e.target.value})} 
                      style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--color-gemini-border)', backgroundColor: 'var(--color-gemini-surface-2)', color: 'var(--color-gemini-text)', outline: 'none', cursor: 'pointer', transition: 'border-color 0.2s' }}
                      onFocus={(e) => e.target.style.borderColor = '#a855f7'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--color-gemini-border)'}
                    >
                      <option>Single</option>
                      <option>Married</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.4rem', color: 'var(--color-gemini-text)' }}>Phone <span style={{ color: '#ec4899' }}>*</span></label>
                    <input 
                      required
                      type="text" 
                      value={patient.phone} 
                      onChange={e => setPatient({...patient, phone: e.target.value})} 
                      pattern="^03[0-9]{9}$"
                      title="Please enter exactly 11 digits starting with 03 (e.g. 03001234567)"
                      style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--color-gemini-border)', backgroundColor: 'var(--color-gemini-surface-2)', color: 'var(--color-gemini-text)', outline: 'none', transition: 'border-color 0.2s' }} 
                      placeholder="03XXXXXXXXX"
                      onFocus={(e) => e.target.style.borderColor = '#a855f7'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--color-gemini-border)'}
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  style={{ 
                    width: '100%', 
                    marginTop: '1rem', 
                    padding: '0.875rem', 
                    borderRadius: '0.5rem', 
                    fontWeight: 'bold', 
                    color: 'white', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '0.5rem', 
                    background: 'linear-gradient(135deg, var(--color-gemini-accent), var(--color-gemini-accent-2))',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px -1px rgba(139, 92, 246, 0.3)',
                    transition: 'transform 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  Start AI Consultation <ArrowRight size={18} />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', position: 'relative' }}>
            {/* Chat Messages */}
            <div style={{ flex: '1 1 0%', overflowY: 'auto', width: '100%', scrollBehavior: 'smooth' }}>
              <div style={{ padding: '2rem 1rem 10rem 1rem', width: '100%', maxWidth: '1024px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                {messages.map((msg, index) => (
                <div key={index} style={{ display: 'flex', gap: '1.5rem', flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row' }}>
                  {/* Avatar */}
                  <div style={{ flexShrink: 0, width: '2.5rem', height: '2.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', background: msg.sender === 'user' ? '#2563eb' : 'linear-gradient(135deg, #9333ea, #4f46e5)' }}>
                    {msg.sender === 'user' ? <User size={20} /> : <Bot size={20} />}
                  </div>
                  
                  {/* Message Bubble */}
                  <div 
                    style={{ 
                      maxWidth: '85%', 
                      borderRadius: '1.5rem', 
                      padding: '1.25rem 1.5rem', 
                      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                      borderTopRightRadius: msg.sender === 'user' ? '0.125rem' : '1.5rem',
                      borderTopLeftRadius: msg.sender !== 'user' ? '0.125rem' : '1.5rem',
                      backgroundColor: msg.sender === 'user' ? '#2563eb' : 'var(--color-gemini-surface)',
                      color: msg.sender === 'user' ? 'white' : 'inherit',
                      border: msg.sender !== 'user' ? '1px solid var(--color-gemini-border)' : 'none',
                      fontStyle: msg.isStatus ? 'italic' : 'normal',
                      opacity: msg.isStatus ? 0.8 : 1
                    }}
                  >
                    {msg.isRecommendation ? (
                      <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.625', fontSize: '1rem' }}>
                        {formatText(msg.text)}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-gemini-border)' }}>
                          {!hasGeneratedDietLabs && (
                            <button onClick={handleGenerateDietLabs} style={{ fontSize: '0.9375rem', fontWeight: '600', color: 'white', backgroundColor: '#a855f7', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(168, 85, 247, 0.4)' }}>
                              Proceed to Diet & Labs
                            </button>
                          )}
                          <button onClick={() => setChatPhase('chatting')} style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#a855f7', backgroundColor: 'transparent', border: '1px solid #a855f7', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer' }}>
                            Continue Conversation
                          </button>
                          <button onClick={() => navigate('/')} style={{ fontSize: '0.9375rem', fontWeight: '600', color: 'var(--color-gemini-text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem 1rem' }}>
                            &larr; Return to Dashboard
                          </button>
                        </div>
                      </div>
                    ) : msg.isDietLabs ? (
                      <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.625', fontSize: '1rem' }}>
                        {formatText(msg.text)}
                      </div>
                    ) : (
                      <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.625', margin: 0, fontSize: '1rem' }}>{msg.text}</p>
                    )}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div style={{ display: 'flex', gap: '1.5rem', flexDirection: 'row' }}>
                  <div style={{ flexShrink: 0, width: '2.5rem', height: '2.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', background: 'linear-gradient(135deg, #9333ea, #4f46e5)' }}>
                    <Bot size={20} />
                  </div>
                  <div style={{ borderRadius: '1.5rem', borderTopLeftRadius: '0.125rem', padding: '1.25rem 1.5rem', border: '1px solid var(--color-gemini-border)', display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', backgroundColor: 'var(--color-gemini-surface)' }}>
                    <Loader2 size={18} className="animate-spin text-purple-500" />
                    <span style={{ fontSize: '0.9375rem', fontStyle: 'italic', fontWeight: '500', color: 'var(--color-gemini-text-muted)' }}>Doctot is thinking...</span>
                  </div>
                </div>
              )}
                <div ref={messagesEndRef} style={{ height: '1rem' }} />
              </div>
            </div>

            {/* Gradient Fade to prevent text from hitting the bottom harshly */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '8rem', pointerEvents: 'none', background: 'linear-gradient(to top, var(--color-gemini-bg) 10%, transparent)' }} />
            
            {/* Floating Centered Input Console */}
            <div style={{ position: 'absolute', bottom: '1.5rem', left: 0, right: 0, padding: '0 1rem', display: 'flex', justifyContent: 'center', zIndex: 20 }}>
              <div 
                className="w-full max-w-2xl rounded-2xl flex flex-col p-2 transition-all shadow-2xl backdrop-blur-md"
                style={{ 
                  backgroundColor: 'var(--color-gemini-surface)', 
                  border: '1px solid var(--color-gemini-border)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(139, 92, 246, 0.1)'
                }}
              >
                {/* Top decorative branding area */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem 0.25rem 0.75rem' }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-gemini-accent)' }}>
                    Homeo AI Console
                  </span>
                  <span style={{ fontSize: '0.65rem', fontWeight: '500', color: 'var(--color-gemini-text-muted)' }}>
                    Secure Case Taking
                  </span>
                </div>

                {/* Input area */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem', backgroundColor: 'transparent' }}>
                  
                  {chatPhase === 'chatting' && messages.length > 2 && (
                    <button
                      onClick={handleGenerateFinal}
                      disabled={isTyping}
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: '0.75rem',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: 'white',
                        backgroundColor: '#10b981',
                        border: 'none',
                        cursor: isTyping ? 'not-allowed' : 'pointer',
                        whiteSpace: 'nowrap',
                        boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.3)',
                        transition: 'all 0.2s',
                        opacity: isTyping ? 0.6 : 1
                      }}
                      onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.transform = 'translateY(-2px)')}
                      onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.transform = 'translateY(0)')}
                    >
                      Generate Diagnosis
                    </button>
                  )}

                  <input 
                    type="text" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={(chatPhase === 'done' && isBeginner) ? "Consultation completed. You can safely exit." : "Type your disease in detail..."}
                    disabled={isTyping || (chatPhase === 'done' && isBeginner)}
                    style={{ flex: '1 1 0%', backgroundColor: 'transparent', border: 'none', padding: '0.75rem', outline: 'none', fontSize: '0.9375rem', color: 'var(--color-gemini-text)' }}
                  />
                  

                  <button 
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping || (chatPhase === 'done' && isBeginner)}
                    style={{ 
                      width: '3rem', 
                      height: '3rem', 
                      marginLeft: '0.25rem', 
                      borderRadius: '0.75rem', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      color: 'white', 
                      transition: 'all 0.3s', 
                      opacity: (!inputValue.trim() || isTyping || (chatPhase === 'done' && isBeginner)) ? 0.4 : 1, 
                      cursor: (!inputValue.trim() || isTyping || (chatPhase === 'done' && isBeginner)) ? 'not-allowed' : 'pointer', 
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
                      flexShrink: 0,
                      border: 'none',
                      background: 'linear-gradient(135deg, var(--color-gemini-accent), var(--color-gemini-accent-2))'
                    }}
                    onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.transform = 'translateY(-2px)')}
                    onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.transform = 'translateY(0)')}
                  >
                    <Send size={18} style={{ marginLeft: '0.125rem' }} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GptChatPage;

import React, { useState } from 'react';
import { Mail, MessageSquare, Phone, Send } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast'; // Import the toast utility
import ChatHeader from '../components/chat/ChatHeader';

const HelpSupportPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Trigger the beautiful toast notification instead of the native alert
    toast.success('Support message submitted successfully! We will get back to you within 24 hours.', {
      duration: 4000,
      position: 'top-right',
      style: {
        background: 'var(--color-gemini-surface)',
        color: 'var(--color-gemini-text)',
        border: '1px solid var(--color-gemini-border)',
        borderRadius: '12px',
        fontSize: '14px'
      },
      iconTheme: {
        primary: '#3b82f6', // Matches your blue theme colors
        secondary: '#fff',
      },
    });

    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden" style={{ backgroundColor: 'var(--color-gemini-bg)', color: 'var(--color-gemini-text)' }}>
      {/* Container wrapper for the dynamic toast rendering tree */}
      <Toaster />
      
      <ChatHeader />
      
      <div className="flex-1 overflow-y-auto w-full flex justify-center">
        <div className="w-full max-w-5xl px-6 py-16 flex flex-col items-center">
          
          {/* Header Section */}
          <div className="text-center w-full max-w-2xl mb-16 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 text-transparent bg-clip-text drop-shadow-sm tracking-tight">
              Help & Support
            </h1>
            <p className="text-base md:text-lg opacity-80 leading-relaxed">
              Need assistance? Our support team is here to help you with your Homeopathy AI Chatbot experience.
            </p>
          </div>

          {/* Main Layout Grid */}
          <div className="flex flex-col lg:flex-row gap-10 w-full items-start">
            
            {/* Contact Information Cards */}
            <div className="w-full lg:w-1/3 flex flex-col gap-6">
              <h2 className="text-xl font-bold px-1 tracking-tight">Get in Touch</h2>
              
              {/* Email Support Card */}
              <div 
                className="group flex items-center p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md w-full gap-4"
                style={{ backgroundColor: 'var(--color-gemini-surface)', borderColor: 'var(--color-gemini-border)' }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 shadow-inner">
                  <Mail className="text-blue-500" size={22} />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-base font-bold mb-0.5 leading-none">Email Support</h3>
                  <p className="opacity-60 text-xs mb-1">Replies within 24 hours.</p>
                  <a href="mailto:support@homeoai.com" className="text-sm font-semibold hover:underline" style={{ color: 'var(--color-gemini-primary)' }}>support@homeoai.com</a>
                </div>
              </div>

              {/* Live Chat Card */}
              <div 
                className="group flex items-center p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md w-full gap-4"
                style={{ backgroundColor: 'var(--color-gemini-surface)', borderColor: 'var(--color-gemini-border)' }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 shadow-inner">
                  <MessageSquare className="text-green-500" size={22} />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-base font-bold mb-0.5 leading-none">Live Chat</h3>
                  <p className="opacity-60 text-xs mb-1">Mon-Fri, 9am - 5pm PKT.</p>
                  <button className="text-sm font-semibold hover:underline text-left" style={{ color: 'var(--color-gemini-primary)' }}>Start a chat</button>
                </div>
              </div>

              {/* Phone Card */}
              <div 
                className="group flex items-center p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md w-full gap-4"
                style={{ backgroundColor: 'var(--color-gemini-surface)', borderColor: 'var(--color-gemini-border)' }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-500/20 shadow-inner">
                  <Phone className="text-orange-500" size={22} />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-base font-bold mb-0.5 leading-none">Phone</h3>
                  <p className="opacity-60 text-xs mb-1">For urgent assistance.</p>
                  <span className="text-sm font-semibold opacity-90">+92 123 4567890</span>
                </div>
              </div>
            </div>

            {/* Contact Form Container */}
            <div className="w-full lg:w-2/3">
              <div className="p-8 md:p-10 rounded-3xl border shadow-lg" style={{ backgroundColor: 'var(--color-gemini-surface)', borderColor: 'var(--color-gemini-border)' }}>
                <h2 className="text-2xl font-bold mb-6 tracking-tight">Send us a Message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-2 opacity-70">Your Name</label>
                      <input 
                        type="text" 
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border outline-none transition-all focus:ring-2 focus:ring-blue-500/20 text-sm"
                        style={{ backgroundColor: 'var(--color-gemini-bg)', borderColor: 'var(--color-gemini-border)', color: 'var(--color-gemini-text)' }}
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-2 opacity-70">Email Address</label>
                      <input 
                        type="email" 
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border outline-none transition-all focus:ring-2 focus:ring-blue-500/20 text-sm"
                        style={{ backgroundColor: 'var(--color-gemini-bg)', borderColor: 'var(--color-gemini-border)', color: 'var(--color-gemini-text)' }}
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2 opacity-70">Subject</label>
                    <input 
                      type="text" 
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border outline-none transition-all focus:ring-2 focus:ring-blue-500/20 text-sm"
                      style={{ backgroundColor: 'var(--color-gemini-bg)', borderColor: 'var(--color-gemini-border)', color: 'var(--color-gemini-text)' }}
                      placeholder="How can we help?"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2 opacity-70">Message</label>
                    <textarea 
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      rows="5"
                      className="w-full px-4 py-3 rounded-xl border outline-none transition-all focus:ring-2 focus:ring-blue-500/20 text-sm resize-none leading-relaxed"
                      style={{ backgroundColor: 'var(--color-gemini-bg)', borderColor: 'var(--color-gemini-border)', color: 'var(--color-gemini-text)' }}
                      placeholder="Describe your issue in detail..."
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3.5 rounded-xl font-bold flex justify-center items-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-base mt-2"
                  >
                    <Send size={18} />
                    Submit
                  </button>
                </form>
              </div>
            </div>
            
          </div>

        </div>
      </div>
    </div>
  );
};

export default HelpSupportPage;
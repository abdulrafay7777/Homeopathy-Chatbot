import React from 'react';
import { Menu, Plus, MessageSquare } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

const Sidebar = () => {
  const { sidebarOpen, setSidebarOpen, startNewChat } = useChat();

  return (
    <>
      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-15 md:hidden"
        />
      )}
      
      <div 
        className={`${sidebarOpen ? 'w-65' : 'w-0'} transition-all duration-300 border-r flex flex-col overflow-hidden shrink-0 h-screen fixed left-0 top-0 z-20`}
        style={{
          background: 'linear-gradient(to bottom, var(--color-gemini-surface), var(--color-gemini-bg), var(--color-gemini-surface-2))',
          borderColor: 'var(--color-gemini-border)'
        }}
      >
      <div className="p-4 flex items-center h-16">
        <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-gemini-surface-hover rounded-full transition-colors mr-2 cursor-pointer">
          <Menu size={24} className="text-gemini-text" />
        </button>
      </div>
      
      <div className="px-4 py-2">
        <button onClick={startNewChat} className="flex items-center gap-3 bg-gemini-surface-2 hover:bg-gemini-surface-hover border border-gemini-border text-sm font-medium py-2.5 px-4 rounded-2xl shadow-sm transition-colors w-fit cursor-pointer">
          <Plus size={20} className="text-gemini-text" />
          <span className="text-gemini-text pr-2">New chat</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-0.5 mt-4">
        <p className="text-[16px] font-medium text-gemini-text-muted mb-3 px-3">Recent</p>
        {['Tailwind v4 Features', 'React Best Practices', 'Building UIs'].map((item, index) => (
          <button key={index} className="flex items-center gap-3 text-[14px] text-gemini-text-muted hover:bg-gemini-surface-hover p-2.5 rounded-full w-full text-left transition-colors cursor-pointer">
            <MessageSquare size={18} className="shrink-0" />
            <span className="truncate">{item}</span>
          </button>
        ))}
      </div>
    </div>
    </>
  );
};

export default Sidebar;
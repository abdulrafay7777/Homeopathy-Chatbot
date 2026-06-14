import React from 'react';
import Sidebar from '../components/chat/Sidebar';
import ChatHeader from '../components/chat/ChatHeader';
import ChatMessage from '../components/chat/ChatMessage';
import ChatInput from '../components/chat/ChatInput';
import Loader from '../components/common/Loader';
import { useChat } from '../context/ChatContext';
import useAutoScroll from '../hooks/useAutoScroll';
import logo from '../assets/logo.png';

const ChatPage = () => {
  const { messages, isLoading, sidebarOpen } = useChat();
  const bottomRef = useAutoScroll([messages, isLoading]);

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ backgroundColor: 'var(--color-gemini-bg)', color: 'var(--color-gemini-text)' }}>
      <Sidebar />
      <div 
        className="flex-1 flex flex-col relative h-screen w-full overflow-hidden transition-all duration-300"
        style={{ marginLeft: sidebarOpen && window.innerWidth >= 768 ? '260px' : '0' }}
      >
        <ChatHeader />

        <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-8 flex flex-col items-center w-full pb-20 sm:pb-24">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center max-w-4xl w-full px-4 pb-12 sm:pb-20 pt-0 text-center gap-4 sm:gap-6">
              <h2 
                className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-medium tracking-tight leading-tight m-0"
                style={{
                  background: 'linear-gradient(to right, var(--color-gemini-accent), var(--color-gemini-accent-2), var(--color-gemini-accent-3))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Hello, Doctor
              </h2>
              <p className="text-2xl sm:text-3xl md:text-4xl lg:text-[56px] font-medium tracking-tight leading-tight m-0" style={{ color: 'var(--color-gemini-text-muted)' }}>
                How can I help you today?
              </p>
              <div className="w-full mt-6 sm:mt-10 flex justify-center">
                <div className="w-full max-w-2xl">
                  <ChatInput />
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl w-full flex flex-col pt-4 sm:pt-8 pb-24 sm:pb-32">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              {isLoading && <Loader />}
              <div ref={bottomRef} className="h-4" />
            </div>
          )}
        </div>

        {messages.length > 0 && (
          <div className="sticky bottom-0 z-10">
            <ChatInput />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
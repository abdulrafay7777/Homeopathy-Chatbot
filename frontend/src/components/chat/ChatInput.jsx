import React, { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

const ChatInput = () => {
  const [input, setInput] = useState('');
  const inputRef = useRef(null);
  const { sendMessage, isLoading } = useChat();

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      sendMessage(input);
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(0, 0);
    }
  }, []);

  useEffect(() => {
    if (!inputRef.current) return;

    inputRef.current.style.height = 'auto';
    inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 160)}px`;
  }, [input]);

  return (
    <div className="w-full bg-linear-to-t from-gemini-bg via-gemini-bg/95 to-transparent pt-8 pb-4 flex justify-center px-2 sm:px-4">
      <div className="w-full max-w-2xl mx-auto bg-gemini-surface border border-gemini-border rounded-[50px] px-2 py-2 pr-0 flex items-center gap-2 shadow-[0_8px_24px_rgba(15,23,42,0.18)] focus-within:shadow-[0_12px_28px_rgba(56,189,248,0.16)] focus-within:border-sky-400/60 transition-all duration-300 min-h-14">
        
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask doctor"
          rows={1}
          className="flex-1 bg-transparent border-none focus:outline-none py-2 pl-6 pr-4 text-[16px] leading-5 align-middle text-gemini-text placeholder:text-gemini-text-muted caret-gemini-accent resize-none overflow-hidden min-h-6 max-h-40"
          disabled={isLoading}
        />

        {/* Right Controls */}
        <div className="flex items-center gap-3 shrink-0 pr-5 self-center">
          {input.trim() ? (
            <button 
              onClick={handleSend}
              disabled={isLoading}
              className="p-3 text-gemini-text hover:text-black rounded-full hover:bg-gemini-surface-hover transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Send size={20} />
            </button>
          ) : (
            <button 
              disabled={isLoading}
              className="p-3 text-gemini-text-muted hover:text-gemini-text rounded-full hover:bg-gemini-surface-hover transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Send size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
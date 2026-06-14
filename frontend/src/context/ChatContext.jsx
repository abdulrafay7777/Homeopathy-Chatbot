import React, { createContext, useContext, useState } from 'react';
import { generateGeminiResponse } from '../services/chatService';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    // Sidebar open by default only on desktop
    return window.innerWidth >= 768;
  });
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (input) => {
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Calls the service layer rather than mixing API logic in components
      const responseText = await generateGeminiResponse(input);
      const aiMsg = { id: Date.now() + 1, role: 'assistant', content: responseText };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg = { id: Date.now() + 1, role: 'assistant', content: "An error occurred." };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewChat = () => setMessages([]);

  return (
    <ChatContext.Provider value={{
      sidebarOpen, setSidebarOpen,
      messages, isLoading, sendMessage, startNewChat
    }}>
      {children}
    </ChatContext.Provider>
  );
};
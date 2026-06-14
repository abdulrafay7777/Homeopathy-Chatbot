import ReactMarkdown from 'react-markdown';
import { Sparkles } from 'lucide-react';
import { markdownComponents } from '../../utils/markdownHelper';

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex w-full justify-end mb-8">
        <div 
          className="max-w-[80%] rounded-[24px] py-3 px-5 leading-relaxed font-normal shadow-sm"
          style={{
            backgroundColor: 'var(--color-gemini-surface-2)',
            border: '1px solid var(--color-gemini-border)',
            color: 'var(--color-gemini-text)'
          }}
        >
          {message.content}
        </div>
      </div>
    );
  }

  // AI Message (No bubble, left aligned with Sparkle)
  return (
    <div className="flex w-full justify-start gap-4 mb-8">
      <div 
        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
        style={{
          background: 'linear-gradient(135deg, var(--color-gemini-accent) 0%, #7c3aed 50%, var(--color-gemini-accent-3) 100%)'
        }}
      >
        <Sparkles className="text-white" size={16} />
      </div>
      <div 
        className="max-w-[85%] leading-[1.75]"
        style={{ color: 'var(--color-gemini-text)' }}
      >
        <ReactMarkdown components={markdownComponents}>
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default ChatMessage;

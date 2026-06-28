import ChatHeader from '../components/chat/ChatHeader';
import IntakeWizard from '../components/chat/IntakeWizard';
import ConsultationResult from '../components/chat/ConsultationResult';
import Loader from '../components/common/Loader';
import { useChat } from '../context/ChatContext';

const ChatPage = () => {
  const { phase, loadingType } = useChat();

  return (
    <div
      className="flex h-screen w-full overflow-hidden"
      style={{ backgroundColor: 'var(--color-gemini-bg)', color: 'var(--color-gemini-text)' }}
    >
      <div className="flex-1 flex flex-col relative h-screen w-full overflow-hidden">
        <ChatHeader />

        <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-8 flex flex-col items-center w-full pb-12">
          {phase === 'intake' && (
            <div className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl py-8">
              <div className="text-center mb-8 sm:mb-10">
                <h1
                  className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight leading-tight m-0"
                  style={{
                    background:
                      'linear-gradient(to right, var(--color-gemini-accent), var(--color-gemini-accent-2), var(--color-gemini-accent-3))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Homeo AI Consultation
                </h1>
              </div>
              <IntakeWizard />
            </div>
          )}

          {phase === 'loading' && (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <Loader />
              <p className="text-sm" style={{ color: 'var(--color-gemini-text-muted)' }}>
                {loadingType === 'questions'
                  ? 'Disease-specific sawalat tayyar ho rahe hain...'
                  : 'Patient data analyze ho raha hai...'}
              </p>
            </div>
          )}

          {phase === 'result' && (
            <div className="w-full max-w-3xl pt-6 sm:pt-10">
              <h2
                className="text-2xl sm:text-3xl font-medium text-center mb-8"
                style={{
                  background:
                    'linear-gradient(to right, var(--color-gemini-accent), var(--color-gemini-accent-2))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Recommendation
              </h2>
              <ConsultationResult />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

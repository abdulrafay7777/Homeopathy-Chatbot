import { RotateCcw } from 'lucide-react';
import ChatMessage from './ChatMessage';
import { useChat } from '../../context/ChatContext';

const ConsultationResult = () => {
  const { patientData, followUpAnswers, result, resetConsultation } = useChat();

  const summaryItems = [
    { label: 'Naam', value: patientData.name },
    { label: 'Umar', value: patientData.age },
    { label: 'Gender', value: patientData.gender },
    { label: 'Marital Status', value: patientData.maritalStatus },
  ];

  const followUpList = Object.values(followUpAnswers);

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-6">
      <div
        className="rounded-2xl p-5 grid grid-cols-2 sm:grid-cols-4 gap-4"
        style={{
          backgroundColor: 'var(--color-gemini-surface)',
          border: '1px solid var(--color-gemini-border)',
        }}
      >
        {summaryItems.map(({ label, value }) => (
          <div key={label}>
            <p className="text-xs font-medium mb-1" style={{ color: 'var(--color-gemini-text-muted)' }}>
              {label}
            </p>
            <p className="text-sm font-semibold" style={{ color: 'var(--color-gemini-text)' }}>
              {value}
            </p>
          </div>
        ))}
        <div className="col-span-2 sm:col-span-4 pt-2 border-t" style={{ borderColor: 'var(--color-gemini-border)' }}>
          <p className="text-xs font-medium mb-1" style={{ color: 'var(--color-gemini-text-muted)' }}>
            Complaint
          </p>
          <p className="text-sm font-semibold" style={{ color: 'var(--color-gemini-text)' }}>
            {patientData.disease || patientData.symptoms}
          </p>
          <p className="text-sm mt-1" style={{ color: 'var(--color-gemini-text-muted)' }}>
            {patientData.symptoms}
          </p>
        </div>

        {patientData.usedCustomDisease && patientData.customDiseaseDetails ? (
          <div className="col-span-2 sm:col-span-4 pt-2 border-t space-y-2" style={{ borderColor: 'var(--color-gemini-border)' }}>
            <p className="text-xs font-medium" style={{ color: 'var(--color-gemini-text-muted)' }}>
              Patient&apos;s Own Disease Description
            </p>
            <p className="text-sm" style={{ color: 'var(--color-gemini-text)' }}>
              {patientData.customDiseaseDetails}
            </p>
          </div>
        ) : (
          followUpList.length > 0 && (
            <div className="col-span-2 sm:col-span-4 pt-2 border-t space-y-2" style={{ borderColor: 'var(--color-gemini-border)' }}>
              <p className="text-xs font-medium" style={{ color: 'var(--color-gemini-text-muted)' }}>
                Disease-Specific Answers
              </p>
              {followUpList.map(({ question, answer }) => (
                <div key={question} className="flex flex-col sm:flex-row sm:gap-2 text-sm">
                  <span style={{ color: 'var(--color-gemini-text-muted)' }}>{question}</span>
                  <span className="font-medium" style={{ color: 'var(--color-gemini-text)' }}>
                    {answer}
                  </span>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {typeof result === 'string' ? (
        <ChatMessage message={{ role: 'assistant', content: result }} />
      ) : (
        <div className="flex flex-col gap-6 w-full">
          {result.analysis && (
            <div className="p-5 rounded-2xl" style={{ backgroundColor: 'var(--color-gemini-surface)' }}>
              <p className="text-[15px] leading-relaxed" style={{ color: 'var(--color-gemini-text)' }}>
                {result.analysis}
              </p>
            </div>
          )}

          {result.medicines && result.medicines.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.medicines.map((med, idx) => {
                const borderColors = ['#0284c7', '#16a34a', '#b45309', '#7c3aed']; // Nice deep colors for light/dark modes
                const borderColor = borderColors[idx % borderColors.length];
                
                return (
                  <div 
                    key={idx} 
                    className="rounded-2xl p-5 flex flex-col h-full transition-shadow hover:shadow-md"
                    style={{ 
                      backgroundColor: 'var(--color-gemini-surface)',
                      border: '1px solid var(--color-gemini-border)',
                      borderLeft: `4px solid ${borderColor}`,
                    }}
                  >
                    <h3 className="text-lg font-bold mb-3" style={{ color: borderColor }}>{med.name}</h3>
                    
                    <div className="mb-4 space-y-1 p-3 rounded-lg" style={{ backgroundColor: 'var(--color-gemini-bg)' }}>
                      <p className="text-xs font-semibold" style={{ color: 'var(--color-gemini-text)' }}>
                        <span style={{ color: 'var(--color-gemini-text-muted)' }}>Dosage:</span> {med.dosage || med.dose}
                      </p>
                      {(med.how_to_take || med.howToTake) && (
                        <p className="text-xs font-medium" style={{ color: 'var(--color-gemini-text)' }}>
                          <span style={{ color: 'var(--color-gemini-text-muted)' }}>How to take:</span> {med.how_to_take || med.howToTake}
                        </p>
                      )}
                    </div>

                    <p className="text-sm mb-6 flex-grow leading-relaxed" style={{ color: 'var(--color-gemini-text)' }}>{med.description}</p>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {med.tags?.map((tag, tIdx) => (
                        <span 
                          key={tIdx} 
                          className="text-[10px] px-2.5 py-1 rounded-full font-medium"
                          style={{ backgroundColor: `${borderColor}20`, color: borderColor }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {result.advice && (
            <div className="p-5 rounded-2xl" style={{ backgroundColor: 'var(--color-gemini-surface-2)', border: '1px solid var(--color-gemini-border)' }}>
              <h4 className="text-[13px] font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--color-gemini-text-muted)' }}>Advice & Precautions</h4>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-gemini-text)' }}>
                {result.advice}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-center pb-8">
        <button
          type="button"
          onClick={resetConsultation}
          className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer hover:scale-[1.02]"
          style={{
            backgroundColor: 'var(--color-gemini-surface-2)',
            border: '1px solid var(--color-gemini-border)',
            color: 'var(--color-gemini-text)',
          }}
        >
          <RotateCcw size={16} />
          New Consultation
        </button>
      </div>
    </div>
  );
};

export default ConsultationResult;

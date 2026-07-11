import React from 'react';
import { RotateCcw, Download } from 'lucide-react';
import ChatMessage from './ChatMessage';
import { useChat } from '../../context/ChatContext';
import html2pdf from 'html2pdf.js';

const ConsultationResult = () => {
  const { patientData, followUpAnswers, result, resetConsultation } = useChat();

  const summaryItems = [
    { label: 'Naam', value: patientData.name },
    { label: 'Phone', value: patientData.phone },
    { label: 'Umar', value: patientData.age },
    { label: 'Gender', value: patientData.gender },
    { label: 'Marital Status', value: patientData.maritalStatus },
  ];

  const followUpList = Object.values(followUpAnswers);

  const handleDownloadPdf = () => {
    const element = document.getElementById('pdf-content');

    const opt = {
      margin:       [0.5, 0.5, 0.5, 0.5], // top, left, bottom, right
      filename:     `${patientData.name || 'Patient'}_Prescription.pdf`,
      image:        { type: 'jpeg', quality: 1.0 },
      pagebreak:    { mode: ['css', 'legacy'] },
      html2canvas:  { 
        scale: 2, 
        useCORS: true, 
        scrollY: 0,
        backgroundColor: '#ffffff',
        letterRendering: true
      },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-6">
      
      {/* START OF PDF WRAPPER */}
      <div id="pdf-content" className="flex flex-col gap-6 p-6" style={{ backgroundColor: 'var(--color-gemini-bg)' }}>
        
        {/* 1. Patient Summary Section */}
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

        {/* 2. Chat Analysis & Prescription Output */}
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

            {/* Pagination Segment */}
            <div style={{ pageBreakBefore: 'always', breakBefore: 'page', paddingTop: '20px' }}>
              
              {/* ORIGINAL TWO-COLUMN GRID PRESERVED */}
              {result.medicines && result.medicines.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.medicines.map((med, idx) => {
                    const borderColors = ['#0284c7', '#16a34a', '#b45309', '#7c3aed'];
                    const borderColor = borderColors[idx % borderColors.length];
                    
                    return (
                      <div 
                        key={idx} 
                        className="rounded-2xl p-5 transition-shadow hover:shadow-md flex flex-col justify-between"
                        style={{ 
                          backgroundColor: 'var(--color-gemini-surface)',
                          border: '1px solid var(--color-gemini-border)',
                          borderLeft: `4px solid ${borderColor}`,
                          pageBreakInside: 'avoid',
                          breakInside: 'avoid',
                        }}
                      >
                        <div className="w-full block" style={{ display: 'block' }}>
                          
                          {/* Title container strictly separated to stop overlaps */}
                          <div className="w-full block" style={{ display: 'block', paddingBottom: '16px' }}>
                            <h3 
                              className="text-lg font-bold block" 
                              style={{ color: borderColor, lineHeight: '1.5', margin: 0, padding: 0 }}
                            >
                              {med.name} {med.match_percentage ? `(${med.match_percentage}%)` : ''}
                            </h3>
                          </div>
                          
                          {/* Dosage block protected with clear bounding layouts */}
                          <div 
                            className="p-3 rounded-lg block w-full" 
                            style={{ 
                              backgroundColor: 'var(--color-gemini-bg)', 
                              display: 'block', 
                              clear: 'both',
                              marginBottom: '16px'
                            }}
                          >
                            <p className="text-xs font-semibold mb-1" style={{ color: 'var(--color-gemini-text)', lineHeight: '1.4' }}>
                              <span style={{ color: 'var(--color-gemini-text-muted)' }}>Dosage:</span> {med.dosage || med.dose}
                            </p>
                            {(med.how_to_take || med.howToTake) && (
                              <p className="text-xs font-medium" style={{ color: 'var(--color-gemini-text)', lineHeight: '1.4' }}>
                                <span style={{ color: 'var(--color-gemini-text-muted)' }}>How to take:</span> {med.how_to_take || med.howToTake}
                              </p>
                            )}
                          </div>

                          <p className="text-sm mb-4 leading-relaxed block" style={{ color: 'var(--color-gemini-text)' }}>
                            {med.description}
                          </p>
                        </div>

                        {/* Tags section completely fixed for text bottom-clipping */}
                        <div className="flex flex-wrap gap-2 mt-auto pt-2" style={{ display: 'flex' }}>
                          {med.tags?.map((tag, tIdx) => (
                            <span 
                              key={tIdx} 
                              className="text-xs px-3 py-1 rounded-full font-semibold" 
                              style={{ 
                                backgroundColor: `${borderColor}20`, 
                                color: borderColor, 
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                lineHeight: '1',
                                whiteSpace: 'nowrap'
                              }}
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

              {/* Recommended Medical Tests */}
              {result.recommended_tests && result.recommended_tests.length > 0 && (
                <div className="p-5 mt-6 rounded-2xl" style={{ backgroundColor: 'var(--color-gemini-surface-2)', border: '1px solid var(--color-gemini-border)' }}>
                  <h4 className="text-[13px] font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--color-gemini-text-muted)' }}>
                    Recommended Tests
                  </h4>
                  <ul className="list-disc pl-5 text-sm leading-relaxed" style={{ color: 'var(--color-gemini-text)' }}>
                    {result.recommended_tests.map((test, i) => (
                      <li key={i}>{test}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
        
      </div> 
      {/* END OF PDF WRAPPER */}

      {/* 3. Action Buttons Section */}
      <div className="flex justify-center gap-4 pb-8">
        <button
          type="button"
          onClick={handleDownloadPdf}
          className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer hover:scale-[1.02]"
          style={{
            backgroundColor: '#1a73e8',
            color: 'white',
            border: 'none',
          }}
        >
          <Download size={16} />
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default ConsultationResult;
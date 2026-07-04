import { useState } from 'react';
import { ArrowLeft, ArrowRight, Sparkles, PenLine } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import McqOption from './McqOption';

export const CUSTOM_MCQ_OPTION = 'In mein se koi nahi — apna jawab likhen';

const BASE_STEPS = [
  {
    key: 'age',
    type: 'mcq',
    title: 'Umar kya hai?',
    subtitle: 'Dusra sawal — umar ki range chunen',
    options: ['18 se kam', '18-30', '31-45', '46-60', '60+'],
  },
  {
    key: 'gender',
    type: 'mcq',
    title: 'Jins (Gender)?',
    subtitle: 'Teesra sawal — gender select karen',
    options: ['Male', 'Female', 'Other'],
  },
  {
    key: 'maritalStatus',
    type: 'mcq',
    title: 'Shadi shuda hain?',
    subtitle: 'Chautha sawal — marital status',
    options: ['Single', 'Married', 'Divorced', 'Widowed'],
  },
  {
    key: 'disease',
    type: 'disease_mcq',
    title: 'Bemari chunen',
    subtitle: 'Common bemariyan select karen — har bemari ke mutabiq alag sawalat aayenge',
  },
];

const IntakeWizard = () => {
  const {
    step,
    totalSteps,
    baseStepCount,
    intakeMode,
    patientData,
    commonDiseases,
    followUpQuestions,
    followUpAnswers,
    setField,
    setFollowUpAnswer,
    nextStep,
    prevStep,
    selectDisease,
    startCustomDiseaseEntry,
    submitCustomDisease,
    submitConsultation,
    isLoading,
  } = useChat();

  const [textValue, setTextValue] = useState('');
  const [customAnswerMode, setCustomAnswerMode] = useState({});
  const [customAnswerText, setCustomAnswerText] = useState({});

  if (intakeMode === 'customDisease') {
    const customValue = textValue || patientData.customDiseaseDetails || '';

    return (
      <div className="w-full max-w-xl mx-auto flex flex-col gap-6 sm:gap-8">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                background:
                  'linear-gradient(135deg, var(--color-gemini-accent) 0%, #7c3aed 50%, var(--color-gemini-accent-3) 100%)',
              }}
            >
              <PenLine className="text-white" size={16} />
            </div>
          </div>
          <h2
            className="text-2xl sm:text-3xl font-medium tracking-tight"
            style={{
              background:
                'linear-gradient(to right, var(--color-gemini-accent), var(--color-gemini-accent-2), var(--color-gemini-accent-3))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Apni bemari yahan likhen
          </h2>
          <p className="text-base" style={{ color: 'var(--color-gemini-text-muted)' }}>
            Apni bemari list mein nahi hai — detail mein likhen
          </p>
        </div>

        <textarea
          value={customValue}
          onChange={(e) => setTextValue(e.target.value)}
          placeholder="Type your disease here... / Apni bemari, alamat aur masla detail mein likhen"
          disabled={isLoading}
          autoFocus
          rows={6}
          className="w-full px-5 py-4 rounded-2xl text-[16px] focus:outline-none resize-none transition-all duration-200"
          style={{
            backgroundColor: 'var(--color-gemini-surface)',
            border: '1px solid var(--color-gemini-accent)',
            color: 'var(--color-gemini-text)',
          }}
        />

        <div className="flex items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={prevStep}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-colors disabled:opacity-30 cursor-pointer"
            style={{ color: 'var(--color-gemini-text-muted)' }}
          >
            <ArrowLeft size={18} />
            Back to disease list
          </button>

          <button
            type="button"
            onClick={() => submitCustomDisease(customValue.trim())}
            disabled={!customValue.trim() || isLoading}
            className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white transition-all duration-200 disabled:opacity-40 cursor-pointer hover:scale-[1.02]"
            style={{
              background:
                'linear-gradient(to right, var(--color-gemini-accent), var(--color-gemini-accent-2))',
            }}
          >
            {isLoading ? 'Generating Questions...' : 'Continue'}
          </button>
        </div>
      </div>
    );
  }

  const isFollowUpStep = step >= baseStepCount;
  const currentBase = !isFollowUpStep ? BASE_STEPS[step] : null;
  const currentFollowUp = isFollowUpStep ? followUpQuestions[step - baseStepCount] : null;
  const isDiseaseStep = currentBase?.key === 'disease';
  const isLastStep = step === totalSteps - 1;

  const followUpId = currentFollowUp?.id;
  const isCustomAnswerActive = followUpId ? customAnswerMode[followUpId] : false;

  const currentValue = currentBase
    ? currentBase.key === 'disease'
      ? patientData.diseaseId
      : patientData[currentBase.key]
    : isCustomAnswerActive
      ? customAnswerText[followUpId] || ''
      : followUpAnswers[followUpId]?.answer || '';

  const canProceed = () => {
    if (currentBase?.type === 'text') {
      return (textValue || currentValue || '').trim().length > 0;
    }
    if (currentBase?.type === 'disease_mcq') {
      return Boolean(patientData.diseaseId);
    }
    if (isFollowUpStep) {
      if (isCustomAnswerActive) {
        return (customAnswerText[followUpId] || '').trim().length > 0;
      }
      return Boolean(followUpAnswers[followUpId]?.answer);
    }
    return Boolean(currentValue);
  };

  const handleNext = async () => {
    if (currentBase?.type === 'text') {
      const value = (textValue || currentValue).trim();
      if (!value) return;
      setField(currentBase.key, value);
      setTextValue('');
      nextStep();
      return;
    }

    if (currentBase?.type === 'disease_mcq') {
      if (patientData.diseaseId === 'other') {
        startCustomDiseaseEntry();
      }
      return;
    }

    if (isFollowUpStep && currentFollowUp) {
      const answer = isCustomAnswerActive
        ? customAnswerText[followUpId].trim()
        : followUpAnswers[followUpId]?.answer;

      if (!answer) return;

      setFollowUpAnswer(currentFollowUp.id, currentFollowUp.question, answer);

      if (isLastStep) {
        const answersList = followUpQuestions.map((q) => ({
          question: q.question,
          answer:
            q.id === currentFollowUp.id
              ? answer
              : followUpAnswers[q.id]?.answer || customAnswerText[q.id] || '',
        }));
        await submitConsultation(undefined, answersList);
      } else {
        nextStep();
      }
      return;
    }

    if (!currentValue) return;
    nextStep();
  };

  const handleSelect = (option) => {
    if (isFollowUpStep && currentFollowUp) {
      if (option === CUSTOM_MCQ_OPTION) {
        setCustomAnswerMode((prev) => ({ ...prev, [followUpId]: true }));
        setFollowUpAnswer(currentFollowUp.id, currentFollowUp.question, '');
        return;
      }
      setCustomAnswerMode((prev) => ({ ...prev, [followUpId]: false }));
      setCustomAnswerText((prev) => ({ ...prev, [followUpId]: '' }));
      setFollowUpAnswer(currentFollowUp.id, currentFollowUp.question, option);
    } else if (currentBase?.type === 'disease_mcq') {
      selectDisease(option);
    } else if (currentBase) {
      setField(currentBase.key, option);
    }
  };

  const handleBack = () => {
    setTextValue('');
    prevStep();
  };

  const title = isFollowUpStep ? currentFollowUp?.question : currentBase?.title;
  const subtitle = isFollowUpStep
    ? `${patientData.disease} — detail ${step - baseStepCount + 1} / ${followUpQuestions.length}`
    : currentBase?.subtitle;

  const nextLabel = isDiseaseStep
    ? patientData.diseaseId === 'other'
      ? 'Continue'
      : 'Select a disease above'
    : isLastStep
      ? isLoading
        ? 'Analyzing...'
        : 'Get Recommendation'
      : 'Next';

  const followUpOptions = isFollowUpStep
    ? [...(currentFollowUp?.options || []), CUSTOM_MCQ_OPTION]
    : [];

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col gap-6 sm:gap-8">
      <div className="flex items-center gap-2 justify-center flex-wrap">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: i === step ? '2rem' : '0.75rem',
              background:
                i <= step
                  ? 'linear-gradient(to right, var(--color-gemini-accent), var(--color-gemini-accent-2))'
                  : 'var(--color-gemini-border)',
            }}
          />
        ))}
      </div>

      <p className="text-sm text-center" style={{ color: 'var(--color-gemini-text-muted)' }}>
        Sawal {step + 1} / {totalSteps}
      </p>

      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-1">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{
              background:
                'linear-gradient(135deg, var(--color-gemini-accent) 0%, #7c3aed 50%, var(--color-gemini-accent-3) 100%)',
            }}
          >
            <Sparkles className="text-white" size={16} />
          </div>
        </div>
        <h2
          className="text-2xl sm:text-3xl font-medium tracking-tight"
          style={{
            background:
              'linear-gradient(to right, var(--color-gemini-accent), var(--color-gemini-accent-2), var(--color-gemini-accent-3))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {title}
        </h2>
        <p className="text-base" style={{ color: 'var(--color-gemini-text-muted)' }}>
          {subtitle}
        </p>
      </div>

      <div className="space-y-3">
        {(currentBase?.type === 'mcq' || isFollowUpStep) &&
          (isFollowUpStep ? followUpOptions : currentBase?.options)?.map((option) => (
            <McqOption
              key={option}
              label={option}
              selected={
                isFollowUpStep
                  ? option === CUSTOM_MCQ_OPTION
                    ? isCustomAnswerActive
                    : followUpAnswers[followUpId]?.answer === option
                  : patientData[currentBase.key] === option
              }
              onClick={() => handleSelect(option)}
              disabled={isLoading}
            />
          ))}

        {currentBase?.type === 'disease_mcq' &&
          commonDiseases.map((disease) => (
            <McqOption
              key={disease.id}
              label={disease.label}
              selected={patientData.diseaseId === disease.id}
              onClick={() => handleSelect(disease)}
              disabled={isLoading}
            />
          ))}

        {isFollowUpStep && isCustomAnswerActive && (
          <input
            type="text"
            value={customAnswerText[followUpId] || ''}
            onChange={(e) =>
              setCustomAnswerText((prev) => ({ ...prev, [followUpId]: e.target.value }))
            }
            placeholder="Apna jawab yahan likhen..."
            disabled={isLoading}
            autoFocus
            className="w-full px-5 py-4 rounded-2xl text-[16px] focus:outline-none transition-all duration-200"
            style={{
              backgroundColor: 'var(--color-gemini-surface)',
              border: '1px solid var(--color-gemini-accent)',
              color: 'var(--color-gemini-text)',
            }}
          />
        )}

        {currentBase?.type === 'text' && (
          <input
            type="text"
            value={textValue || currentValue || ''}
            onChange={(e) => setTextValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && canProceed() && handleNext()}
            placeholder={currentBase.placeholder}
            disabled={isLoading}
            autoFocus
            className="w-full px-5 py-4 rounded-2xl text-[16px] focus:outline-none transition-all duration-200"
            style={{
              backgroundColor: 'var(--color-gemini-surface)',
              border: '1px solid var(--color-gemini-border)',
              color: 'var(--color-gemini-text)',
            }}
          />
        )}

      </div>

      <div className="flex items-center justify-between gap-4 pt-2">
        <button
          type="button"
          onClick={handleBack}
          disabled={step === 0 || isLoading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-colors disabled:opacity-30 cursor-pointer"
          style={{ color: 'var(--color-gemini-text-muted)' }}
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={
            isLoading ||
            !canProceed() ||
            (isDiseaseStep && patientData.diseaseId !== 'other')
          }
          className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white transition-all duration-200 disabled:opacity-40 cursor-pointer hover:scale-[1.02]"
          style={{
            background:
              'linear-gradient(to right, var(--color-gemini-accent), var(--color-gemini-accent-2))',
          }}
        >
          {nextLabel}
          {!isLastStep && !isDiseaseStep && <ArrowRight size={18} />}
        </button>
      </div>
    </div>
  );
};

export default IntakeWizard;

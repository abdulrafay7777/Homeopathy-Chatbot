import { createContext, useContext, useEffect, useState } from 'react';
import { COMMON_DISEASES, getFollowUpByDiseaseId } from '../data/diseaseQuestions';
import { fetchCommonDiseases, fetchFollowUpQuestions, submitConsultation as submitConsultationApi } from '../services/chatService';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

const INITIAL_PATIENT_DATA = {
  name: '',
  age: '',
  gender: '',
  maritalStatus: '',
  diseaseId: '',
  symptoms: '',
  disease: '',
  usedCustomDisease: false,
  customDiseaseDetails: '',
};

const BASE_STEP_COUNT = 5;

export const ChatProvider = ({ children }) => {
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState('intake');
  const [intakeMode, setIntakeMode] = useState('wizard');
  const [patientData, setPatientData] = useState(INITIAL_PATIENT_DATA);
  const [commonDiseases, setCommonDiseases] = useState(COMMON_DISEASES);
  const [followUpQuestions, setFollowUpQuestions] = useState([]);
  const [followUpAnswers, setFollowUpAnswers] = useState({});
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingType, setLoadingType] = useState(null);

  const totalSteps = BASE_STEP_COUNT + followUpQuestions.length;

  useEffect(() => {
    fetchCommonDiseases()
      .then(setCommonDiseases)
      .catch(() => setCommonDiseases(COMMON_DISEASES));
  }, []);

  const setField = (key, value) => {
    setPatientData((prev) => ({ ...prev, [key]: value }));
  };

  const setFollowUpAnswer = (questionId, question, answer) => {
    setFollowUpAnswers((prev) => ({
      ...prev,
      [questionId]: { question, answer },
    }));
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps - 1));

  const prevStep = () => {
    if (intakeMode === 'customDisease') {
      setIntakeMode('wizard');
      setPatientData((prev) => ({
        ...prev,
        usedCustomDisease: false,
        customDiseaseDetails: '',
      }));
      setStep(BASE_STEP_COUNT - 1);
      return;
    }

    setStep((s) => {
      const newStep = Math.max(s - 1, 0);
      if (newStep < BASE_STEP_COUNT && s >= BASE_STEP_COUNT) {
        setFollowUpQuestions([]);
        setFollowUpAnswers({});
        setIntakeMode('wizard');
        setPatientData((prev) => ({
          ...prev,
          diseaseId: '',
          disease: '',
          symptoms: '',
          usedCustomDisease: false,
          customDiseaseDetails: '',
        }));
      }
      return newStep;
    });
  };

  const resetConsultation = () => {
    setStep(0);
    setPhase('intake');
    setIntakeMode('wizard');
    setPatientData(INITIAL_PATIENT_DATA);
    setFollowUpQuestions([]);
    setFollowUpAnswers({});
    setResult('');
    setIsLoading(false);
    setLoadingType(null);
  };

  const startCustomDiseaseEntry = () => {
    setIntakeMode('customDisease');
    setFollowUpQuestions([]);
    setFollowUpAnswers({});
    setPatientData((prev) => ({
      ...prev,
      diseaseId: 'other',
      usedCustomDisease: true,
      customDiseaseDetails: '',
    }));
  };

  const beginFollowUpForDisease = async (diseaseId, label) => {
    setIsLoading(true);
    setLoadingType('questions');
    try {
      const response = await fetchFollowUpQuestions({ diseaseId, symptoms: label });
      if (response && response.questions && response.questions.length > 0) {
        setFollowUpQuestions(response.questions);
        setFollowUpAnswers({});
        setIntakeMode('wizard');
        setPatientData((prev) => ({
          ...prev,
          diseaseId,
          symptoms: label,
          disease: response.disease || label,
          usedCustomDisease: false,
          customDiseaseDetails: '',
        }));
        setStep(BASE_STEP_COUNT);
      } else {
        startCustomDiseaseEntry();
      }
    } catch (error) {
      console.error('Failed to fetch dynamic questions:', error);
      startCustomDiseaseEntry();
    } finally {
      setIsLoading(false);
      setLoadingType(null);
    }
  };

  const selectDisease = (disease) => {
    if (disease.id === 'other') {
      setPatientData((prev) => ({
        ...prev,
        diseaseId: 'other',
        symptoms: '',
        disease: '',
      }));
      return;
    }

    beginFollowUpForDisease(disease.id, disease.label);
  };

  const submitCustomDisease = async (customDetails) => {
    setIsLoading(true);
    setLoadingType('questions');
    try {
      const response = await fetchFollowUpQuestions({ diseaseId: 'other', symptoms: customDetails });
      if (response && response.questions && response.questions.length > 0) {
        setFollowUpQuestions(response.questions);
        setFollowUpAnswers({});
        setPatientData((prev) => ({
          ...prev,
          diseaseId: 'custom',
          disease: customDetails,
          symptoms: customDetails,
          usedCustomDisease: false,
          customDiseaseDetails: '',
        }));
        setIntakeMode('wizard');
        setStep(BASE_STEP_COUNT);
      } else {
        alert('Maaf kijiye, sawalat bananay mein masla hua. Kripya dobara koshish karen.');
      }
    } catch (error) {
      console.error(error);
      alert('Sawalat bananay mein masla hua. Kripya dobara koshish karen.');
    } finally {
      setIsLoading(false);
      setLoadingType(null);
    }
  };

  const submitConsultation = async (symptomsOverride, answersOverride, customDetailsOverride) => {
    const symptoms = (symptomsOverride ?? patientData.symptoms).trim();
    const usedCustom = patientData.usedCustomDisease || Boolean(customDetailsOverride);
    const customDetails = (customDetailsOverride ?? patientData.customDiseaseDetails).trim();

    const answersList = usedCustom
      ? []
      : answersOverride ??
        followUpQuestions.map((q) => ({
          question: q.question,
          answer: followUpAnswers[q.id]?.answer || '',
        }));

    if (usedCustom && !customDetails) return;

    setIsLoading(true);
    setLoadingType('consultation');
    setPhase('loading');

    try {
      const responseText = await submitConsultationApi({
        name: patientData.name,
        age: patientData.age,
        gender: patientData.gender,
        maritalStatus: patientData.maritalStatus,
        symptoms: usedCustom ? customDetails : symptoms,
        disease: patientData.disease || symptoms,
        followUpAnswers: answersList.filter((a) => a.answer),
        usedCustomDisease: usedCustom,
        customDiseaseDetails: usedCustom ? customDetails : '',
      });
      setPatientData((prev) => ({
        ...prev,
        usedCustomDisease: usedCustom,
        customDiseaseDetails: usedCustom ? customDetails : '',
      }));
      setResult(responseText);
      setPhase('result');
    } catch {
      setResult('Maaf kijiye, kuch technical masla hai. Kripya dobara koshish karen.');
      setPhase('result');
    } finally {
      setIsLoading(false);
      setLoadingType(null);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        step,
        totalSteps,
        baseStepCount: BASE_STEP_COUNT,
        phase,
        intakeMode,
        patientData,
        commonDiseases,
        followUpQuestions,
        followUpAnswers,
        result,
        isLoading,
        loadingType,
        setField,
        setFollowUpAnswer,
        nextStep,
        prevStep,
        selectDisease,
        startCustomDiseaseEntry,
        submitCustomDisease,
        submitConsultation,
        resetConsultation,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

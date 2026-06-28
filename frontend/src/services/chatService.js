import { apiClient } from './api';

export const fetchCommonDiseases = async () => {
  const response = await apiClient.get('/consultation/diseases');
  if (response.data?.success) {
    return response.data.diseases;
  }
  throw new Error('Could not load diseases');
};

export const fetchFollowUpQuestions = async ({ diseaseId, symptoms = '' } = {}) => {
  const response = await apiClient.post('/consultation/follow-up-questions', {
    diseaseId,
    symptoms,
  });
  if (response.data?.success) {
    return response.data;
  }
  throw new Error('Could not load follow-up questions');
};

export const submitConsultation = async (patient) => {
  try {
    const response = await apiClient.post('/consultation', { patient });

    if (response.data?.success) {
      if (response.data.data) {
        return response.data.data;
      }
      if (response.data.response) {
        return response.data.response;
      }
    }
    throw new Error('Invalid response from server');
  } catch (error) {
    if (error.response) {
      const errorMessage =
        error.response.data?.detail || error.response.data?.error || 'Server error occurred';
      throw new Error(errorMessage);
    }
    if (error.request) {
      throw new Error(
        'Maaf kijiye, server se connection nahi ho pa raha. Kripya check karen ke backend server chal raha hai.'
      );
    }
    throw error;
  }
};

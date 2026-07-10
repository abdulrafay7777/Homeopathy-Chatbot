import { apiClient } from './api';

export const fetchCommonDiseases = async () => {
  try {
    const response = await apiClient.get('/consultation/diseases');
    if (response.data?.success) {
      return response.data.diseases;
    }
    throw new Error('Could not load diseases');
  } catch (error) {
    if (error.request && !error.response) {
      throw new Error('Network issue Unstable internet connection.');
    }
    throw error;
  }
};

export const checkConsultationLimit = async () => {
  try {
    const response = await apiClient.get('/consultation/check-limit');
    return response.data?.allowed || false;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.detail || 'Server error occurred');
    }
    throw error;
  }
};

export const fetchFollowUpQuestions = async ({ diseaseId, symptoms = '' } = {}) => {
  try {
    const response = await apiClient.post('/consultation/follow-up-questions', {
      diseaseId,
      symptoms,
    });
    if (response.data?.success) {
      return response.data;
    }
    throw new Error('Could not load follow-up questions');
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.detail || 'Server error occurred');
    }
    if (error.request) {
      throw new Error('Network issue Unstable internet connection');
    }
    throw error;
  }
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
    
    if (response.data && !response.data.success && response.data.response) {
        throw new Error(response.data.response);
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
        'Network issue Unstable internet connection.'
      );
    }
    throw error;
  }
};

const API_BASE_URL = 'http://localhost:8000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
};

// Auth API
export const register = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/register/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(userData)
  });
  return handleResponse(response);
};

export const login = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/login/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(credentials)
  });
  return handleResponse(response);
};

// Questions API
export const getQuestions = async () => {
  const response = await fetch(`${API_BASE_URL}/questions/`, {
    headers: getAuthHeaders()
  });
  return handleResponse(response);
};

export const createQuestion = async (questionData) => {
  const response = await fetch(`${API_BASE_URL}/questions/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(questionData)
  });
  return handleResponse(response);
};

export const updateQuestion = async (id, questionData) => {
  const response = await fetch(`${API_BASE_URL}/questions/${id}/`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(questionData)
  });
  return handleResponse(response);
};

export const deleteQuestion = async (id) => {
  const response = await fetch(`${API_BASE_URL}/questions/${id}/`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    throw new Error('Failed to delete question');
  }
};

// Interactions API
export const getUserInteractions = async () => {
  const response = await fetch(`${API_BASE_URL}/interactions/`, {
    headers: getAuthHeaders()
  });
  return handleResponse(response);
};

export const createUpdateInteraction = async (interactionData) => {
  const response = await fetch(`${API_BASE_URL}/interactions/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(interactionData)
  });
  return handleResponse(response);
};

// Daily Challenge API
export const getDailyChallenge = async () => {
  const response = await fetch(`${API_BASE_URL}/daily-challenge/`, {
    headers: getAuthHeaders()
  });
  return handleResponse(response);
};

export const completeDailyChallenge = async () => {
  const response = await fetch(`${API_BASE_URL}/daily-challenge/complete/`, {
    method: 'POST',
    headers: getAuthHeaders()
  });
  return handleResponse(response);
};
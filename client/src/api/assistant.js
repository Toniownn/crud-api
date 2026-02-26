import api from './axios';

export const getAssistant = (id) =>
  api.get(`/assistant/create_assistant?id=${id}`);

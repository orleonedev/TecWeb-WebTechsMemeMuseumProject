import axios from 'axios';
import { API_BASE_URL } from '../../../config';

const API_URL = `${API_BASE_URL}/api/memes`;

export interface MemeQueryParams {
  page?: number;
  limit?: number;
  tag?: string;
  search?: string;
  sortBy?: 'date' | 'popularity';
  order?: 'asc' | 'desc';
  userId?: string;
}

export const getMemes = async (params: MemeQueryParams = {}) => {
  const response = await axios.get(API_URL, { params });
  return response.data;
};

export const getMemeById = async (id: string) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const getMemeOfTheDay = async () => {
  const response = await axios.get(`${API_URL}/day`);
  return response.data;
};

export const createMeme = async (formData: FormData, token: string) => {
  const response = await axios.post(API_URL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const castVote = async (memeId: number, value: number, token: string) => {
  const response = await axios.post(`${API_URL}/${memeId}/vote`, { value }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const addComment = async (memeId: number, text: string, token: string) => {
  const response = await axios.post(`${API_URL}/${memeId}/comments`, { text }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteComment = async (commentId: number, token: string) => {
  const response = await axios.delete(`${API_URL}/comments/${commentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

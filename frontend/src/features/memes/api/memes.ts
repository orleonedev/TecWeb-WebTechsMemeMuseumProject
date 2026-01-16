import axios from 'axios';
import { API_BASE_URL } from '../../../config';
import { SortBy, SortOrder } from '../../../shared/constants';
import { MemeDto, MemesResponse } from '../../../shared/types';

const API_URL = `${API_BASE_URL}/api/memes`;

export interface MemeQueryParams {
  page?: number;
  limit?: number;
  tag?: string;
  search?: string;
  sortBy?: SortBy;
  order?: SortOrder;
  userId?: string;
}

export const getMemes = async (params: MemeQueryParams = {}): Promise<MemesResponse> => {
  const response = await axios.get<MemesResponse>(API_URL, { params });
  return response.data;
};

export const getMemeById = async (id: string): Promise<MemeDto> => {
  const response = await axios.get<MemeDto>(`${API_URL}/${id}`);
  return response.data;
};

export const getMemeOfTheDay = async (): Promise<MemeDto> => {
  const response = await axios.get<MemeDto>(`${API_URL}/day`);
  return response.data;
};

export const createMeme = async (formData: FormData, token: string): Promise<MemeDto> => {
  const response = await axios.post<MemeDto>(API_URL, formData, {
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

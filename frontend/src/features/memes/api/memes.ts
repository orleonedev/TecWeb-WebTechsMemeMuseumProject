import axiosInstance from '../../../lib/axios';
import { SortBy, SortOrder } from '../../../shared/constants';
import { MemeDto, MemesResponse } from '../../../shared/types';

const API_URL = '/api/memes';

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
  const response = await axiosInstance.get<MemesResponse>(API_URL, { params });
  return response.data;
};

export const getMemeById = async (id: string): Promise<MemeDto> => {
  const response = await axiosInstance.get<MemeDto>(`${API_URL}/${id}`);
  return response.data;
};

export const getMemeOfTheDay = async (): Promise<MemeDto> => {
  const response = await axiosInstance.get<MemeDto>(`${API_URL}/day`);
  return response.data;
};

export const createMeme = async (formData: FormData): Promise<MemeDto> => {
  const response = await axiosInstance.post<MemeDto>(API_URL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const castVote = async (memeId: number, value: number) => {
  const response = await axiosInstance.post(`${API_URL}/${memeId}/vote`, { value });
  return response.data;
};

export const addComment = async (memeId: number, text: string) => {
  const response = await axiosInstance.post(`${API_URL}/${memeId}/comments`, { text });
  return response.data;
};

export const deleteComment = async (commentId: number) => {
  const response = await axiosInstance.delete(`${API_URL}/comments/${commentId}`);
  return response.data;
};

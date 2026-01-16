
import axiosInstance from '../../../lib/axios';

const API_URL = '/auth';

export const registerUser = async (userData: any) => {
  const response = await axiosInstance.post(`${API_URL}/register`, userData);
  return response.data;
};

export const loginUser = async (credentials: any) => {
  const response = await axiosInstance.post(`${API_URL}/login`, credentials);
  return response.data;
};

export const getMe = async () => {
  const response = await axiosInstance.get(`${API_URL}/me`);
  return response.data;
};

export const deleteUser = async (userId: string) => {
  const response = await axiosInstance.delete(`${API_URL}/${userId}`);
  return response.data;
};

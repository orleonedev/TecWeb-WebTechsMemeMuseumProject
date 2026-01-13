
import axios from 'axios';
import { API_BASE_URL } from '../../../config';

const API_URL = `${API_BASE_URL}/auth`;

export const registerUser = async (userData: any) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

export const loginUser = async (credentials: any) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  return response.data;
};

export const getMe = async (token: string) => {
  const response = await axios.get(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteUser = async (userId: string, token: string) => {
  const response = await axios.delete(`${API_URL}/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

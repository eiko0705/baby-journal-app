import axios from 'axios';

const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:3000/api';

export interface ChildProfile {
  id: string;
  nickname: string;
  gender: string;
  birthday: string;
  createdAt: string;
  updatedAt: string;
}

export const fetchProfileAPI = async (): Promise<ChildProfile> => {
  const response = await axios.get<ChildProfile>(`${API_BASE_URL}/profile`);
  return response.data;
};

export const updateProfileAPI = async (profileData: Omit<ChildProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<ChildProfile> => {
  const response = await axios.put<ChildProfile>(`${API_BASE_URL}/profile`, profileData);
  return response.data;
};

import axios from 'axios';
import type { Achievement, NewAchievementPayload } from '../types';

const API_BASE_URL = import.meta.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

export const fetchAchievementsAPI = async (): Promise<Achievement[]> => {
  const response = await axios.get<Achievement[]>(`${API_BASE_URL}/achievements`);
  return response.data;
}

export const createAchievemntAPI = async (achievementData: NewAchievementPayload): Promise<Achievement> => {
  const response = await axios.post<Achievement>(`${API_BASE_URL}/achievements`, achievementData);
  return response.data;
}

export const deleteAchievementAPI = async (id: string): Promise<{ id: string }> => {
  const response = await axios.delete<{ message: string, id: string }>(`${API_BASE_URL}/achievements/${id}`)
  return { id: response.data.id };
}

export const updateAchievementAPI = async (id: string, achievementData: NewAchievementPayload): Promise<Achievement> => {
  const response = await axios.put<Achievement>(`${API_BASE_URL}/achievements/${id}`, achievementData);
  return response.data;
}
import axios from 'axios';
import { Message } from '../Types/message';
import{API_BASE_URL} from './baseUrls';



export const getChatHistory = async (exchangeId: number): Promise<Message[]> => {
  const token = localStorage.getItem('authToken');

  if (!token) {
    throw new Error('No token found');
  }


  const response = await axios.get(`${API_BASE_URL}/Chat/history/${exchangeId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

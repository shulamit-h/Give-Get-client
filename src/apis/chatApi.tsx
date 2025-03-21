import axios from 'axios';
import { Message } from '../Types/message';
import{API_BASE_URL} from './baseUrls';


// שליפת היסטוריה של צ'אט מה-API
export const getChatHistory = async (exchangeId: number): Promise<Message[]> => {
    const response = await axios.get(`${API_BASE_URL}/Chat/history/${exchangeId}`);
    return response.data;
};

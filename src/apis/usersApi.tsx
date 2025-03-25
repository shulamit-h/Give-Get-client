import axios from 'axios';
import{API_BASE_URL} from './baseUrls';

export const fetchTopUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/User/top`);
      console.log('Top users:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching top users:', error);
      throw error.response ? error.response.data : error.message;
    }
  };
import axios from "axios";
import { API_BASE_URL } from "./baseUrls";

export const fetchInspiration = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Inspiration`);
      return response.data;
    } catch (error) {
      console.error('Error fetching inspiration:', error);
      throw error;
    }
  };
  
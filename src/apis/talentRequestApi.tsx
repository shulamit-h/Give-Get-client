import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Function to add a new talent request
export const addTalentRequest = async (talentRequest: { UserId: number; TalentName: string; ParentCategory: number; RequestDate: Date; }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/TalentRequest`, talentRequest, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      return response.data;
    } catch (error: any) {
      throw error.response ? error.response.data : error.message;
    }
};

// Function to fetch talent requests
  export const fetchTalentRequests = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No token found');
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/TalentRequest`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      throw error.response ? error.response.data : error.message;
    }
};

// Function to delete a talent request
  export const deleteTalentRequest = async (id: number) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No token found');
    }
    try {
      await axios.delete(`${API_BASE_URL}/TalentRequest/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error: any) {
      throw error.response ? error.response.data : error.message;
    }
};

// Function to update a talent request
  export const updateTalentRequest = async (id: number, updatedTalent: any) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No token found');
    }
    try {
      await axios.put(`${API_BASE_URL}/TalentRequest/${id}`, updatedTalent, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error: any) {
      throw error.response ? error.response.data : error.message;
    }
};
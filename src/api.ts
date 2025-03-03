import axios from 'axios';

const API_BASE_URL = 'https://localhost:7160/api';

// פונקציה לביצוע בקשת POST לרישום משתמש חדש
export const registerUser = async (userData: any) => {
  const formData = new FormData();
  Object.keys(userData).forEach(key => {
    const value = userData[key];
    if (value !== null) {
      formData.append(key, value);
    }
  });
  formData.append('HashPwd', userData.password); // הוספת השדה HashPwd

  try {
    const response = await axios.post(`${API_BASE_URL}/User`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

// פונקציה לביצוע בקשת POST לכניסת משתמש
export const loginUser = async (userName: string, pwd: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/Login`, null, {
      params: {
        userName,
        pwd
      }
    });
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};
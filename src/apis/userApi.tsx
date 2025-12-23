import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const registerUser = async (userData: FormData) => {
    console.log('i am in api, let see the for loop- entries');
    
    for (const pair of userData.entries()) {
      console.log(pair[0], pair[1]);  // 🔹 check if data is sent correctly
    }
  
    try {
      const response = await axios.post(`${API_BASE_URL}/User`, userData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      return response.data;
    } catch (error) {
      console.error('Error in registerUser:', error);
      if (axios.isAxiosError(error)) {
        throw error.response?.data || error.message;
      } else {
        throw 'An unexpected error occurred';
      }
    }
  };
  
// Fetch user data from the server
export const fetchUserData = async () => {
    const token = localStorage.getItem('authToken');
  
    if (!token) {
      throw new Error('No token found');
    }
  
    try {
      const response = await axios.get(`${API_BASE_URL}/User/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Added image URL here
      const userData = response.data;
      userData.profileImageUrl = userData.profileImageUrl ? `${API_BASE_URL}/User/profile-image/${userData.id}` : '/path/to/default-image.jpg'; // Use a default image if none exists
  
      // console.log('User data from API:', userData); // Print the received data
      return userData;
    } catch (error: any) {
      throw error.response ? error.response.data : error.message;
    }
};

export const fetchUserById = async (userId: number) => {
    const token = localStorage.getItem('authToken');
  
    if (!token) {
      throw new Error('No token found');
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/User/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data; // Return the full user
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;  // Return null on error
    }
};

// Function to update user data
export const updateUserData = async (userId: number, userData: FormData) => {
    const token = localStorage.getItem('authToken');
  
    if (!token) {
      throw new Error('No token found');
    }
  
    for (const pair of userData.entries()) {
      console.log(pair[0], pair[1]);  // 🔹 check if data is sent correctly
    }
  
    console.log('FormData to send:', userData)
  
    try {
      const response = await axios.put(`${API_BASE_URL}/User/${userId}`, userData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
  
      return response.data;
    } catch (error: any) {
      throw error.response ? error.response.data : error.message;
    }
};

export const getProfileImage = async (userId: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/profile-image/${userId}`, {
      responseType: 'arraybuffer'
    });
    const imageBlob = new Blob([response.data], { type: 'image/jpeg' });
    return URL.createObjectURL(imageBlob);
  } catch (error) {
    // If there is an error (e.g., 404), return a local default image
    return require('../assets/images/default-user.png');
  }
};

export const updateUserScore = async (userId: number, action: number) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No token found');
    }
  
    try {
      const response = await axios.put(`${API_BASE_URL}/user/update-score/${userId}`,
        action, // Data sent to server
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      return response.data; // Return data from server
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update user score');
    }
};

export const getNotSecret = async (id: number) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No token found');
    }
  
    try {
      const response = await axios.get(`${API_BASE_URL}/User/not-secret/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      return response.data;
    } catch (error: any) {
      throw error.response ? error.response.data : error.message;
    }
};

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
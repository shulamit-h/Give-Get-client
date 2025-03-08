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

  // הוספת כישרונות מוצעים
  if (userData.offeredTalents && userData.offeredTalents.length > 0) {
    userData.offeredTalents.forEach((talentId: number) => {
      formData.append('Talents', JSON.stringify({ TalentId: talentId, IsOffered: true }));
    });
  }

  // הוספת כישרונות רצויים
  if (userData.wantedTalents && userData.wantedTalents.length > 0) {
    userData.wantedTalents.forEach((talentId: number) => {
      formData.append('Talents', JSON.stringify({ TalentId: talentId, IsOffered: false }));
    });
  }


  // הוספת קובץ התמונה אם קיים
  if (userData.profileImage) {
    formData.append('File', userData.profileImage);
  }
  console.log('FormData to send:', formData);

  try {
    const response = await axios.post(`${API_BASE_URL}/User`, formData, {
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

// פונקציה לביצוע בקשת POST לכניסת משתמש
export const loginUser = async (userName: string, pwd: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/Login`, null, {
      params: { userName, pwd }
    });

    console.log('Server response:', response.data); // נבדוק מה מחזיר השרת

    if (response.data) {
      localStorage.setItem('authToken', response.data); // שומר את הטוקן נכון
    } else {
      throw new Error('No token received from server'); // במידה ואין טוקן, תזרוק שגיאה ברורה
    }

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error.response ? error.response.data : error.message;
    } else {
      throw 'An unexpected error occurred';
    }
  }
};

// פונקציה להבאת נתוני המשתמש המחובר
export const fetchUserData = async () => {
  const token = localStorage.getItem('authToken');

  if (!token) {
    throw new Error('No token found');
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/User/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // הוספנו כאן את כתובת התמונה
    const userData = response.data;
    userData.profileImageUrl = userData.profileImageUrl ? `${API_BASE_URL}/User/profile-image/${userData.id}` : '/path/to/default-image.jpg'; // שים תמונה ברירת מחדל במקרה שאין תמונה

    console.log('User data from API:', userData); // הדפסת הנתונים שהתקבלו
    return userData;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

// פונקציה להבאת רשימת הכישורים לפי קטגורית האב
export const fetchTalentsByParent = async (parentId: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/Talent/byParent/${parentId}`);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

// פונקציה לעדכון נתוני המשתמש
export const updateUserData = async (userId: number, userData: any) => {
  const token = localStorage.getItem('authToken');

  if (!token) {
    throw new Error('No token found');
  }

  const formData = new FormData();
  Object.keys(userData).forEach(key => {
    const value = userData[key];
    if (value !== null) {
      formData.append(key, value);
    }
  });
  if (userData.password) {
    formData.append('HashPwd', userData.password);
  }

  // הוספת כישרונות מוצעים
  if (userData.offeredTalents && userData.offeredTalents.length > 0) {
    userData.offeredTalents.forEach((talentId: number) => {
      formData.append('Talents', JSON.stringify({ TalentId: talentId, IsOffered: true }));
    });
  }

  // הוספת כישרונות רצויים
  if (userData.wantedTalents && userData.wantedTalents.length > 0) {
    userData.wantedTalents.forEach((talentId: number) => {
      formData.append('Talents', JSON.stringify({ TalentId: talentId, IsOffered: false }));
    });
  }

  if (userData.profileImage) {
    formData.append('File', userData.profileImage);
  }
  console.log('FormData to send:', formData);

  try {
    const response = await axios.put(`${API_BASE_URL}/User/${userId}`, formData, {
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

// פונקציה לשליפת תגובות
export const fetchComments = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/Comment`);
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};
// פונקציה להוספת תגובה חדשה
export const addComment = async (content: string) => {
  const formData = new FormData();
  formData.append('content', content);
  const token = localStorage.getItem('authToken');

  if (!token) {
    throw new Error('No token found');
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/Comment`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`      },
        withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};
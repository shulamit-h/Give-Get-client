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
  // הוספת קובץ התמונה אם קיים
  if (userData.profileImage) {
    formData.append('profileImage', userData.profileImage);
  }
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

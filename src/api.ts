import axios from 'axios';

const API_BASE_URL = 'https://localhost:7160/api';

// פונקציה לביצוע בקשת POST לרישום משתמש חדש
export const registerUser = async (userData: FormData) => {
  console.log('i am in api, let see the for loop- entries');
  
  for (const pair of userData.entries()) {
    console.log(pair[0], pair[1]);  // 🔹 פה תראי אם הנתונים נשלחים כמו שצריך
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




// export const registerUser = async (userData: any) => {
//   console.log('i am in api, let see the for loop- entries');
//   for (const pair of userData.entries()) {
//     console.log(pair[0], pair[1]);
//   }

//   const formData = new FormData();

//   // הוספת פרטי המשתמש מהאובייקט userData
//   Object.keys(userData).forEach(key => {
//     const value = userData[key];
//     if (value !== null) {
//       formData.append(key, value);
//     }
//   })

//   console.log('after Object.keys loop');
//   for (const pair of formData.entries()) {
//     console.log(pair[0], pair[1]);
//   }
  
//   let password = formData.get('password');
//   console.log('password:', password);
  
//   // מחיקת הסיסמה מהטופס כדי לא לשלוח אותה בצורה רגילה
//   formData.delete('password');
  
//   // הוספת הסיסמה בתור HashPwd
//   formData.append('HashPwd', password ? password : ""); // הוספת השדה HashPwd

//   // יצירת סטרינג אחד שכולל את כל הכישרונות
//   let talentsString = '';

//   // הוספת כישרונות מוצעים
//   if (userData.offeredTalents && userData.offeredTalents.length > 0) {
//     talentsString += userData.offeredTalents.map((talentId: number) =>
//       JSON.stringify({ TalentId: talentId, IsOffered: true })
//     ).join(';'); // מחברים כל כישרון עם `;` כ-separator
//   }

//   // הוספת כישרונות רצויים
//   if (userData.wantedTalents && userData.wantedTalents.length > 0) {
//     if (talentsString) talentsString += ';'; // אם יש כבר כישרונות קודם, מוסיפים `;` לפני
//     talentsString += userData.wantedTalents.map((talentId: number) =>
//       JSON.stringify({ TalentId: talentId, IsOffered: false })
//     ).join(';');
//   }

//   // הוספת כל הכישרונות ל-FormData אם יש
//   if (talentsString) {
//     formData.append('Talents', talentsString);
//   }

//   // הוספת קובץ התמונה אם קיים
//   if (userData.profileImage) {
//     formData.append('File', userData.profileImage);
//   }

//   console.log('FormData to send');
//   let x = 0;
//   for (const pair of formData.entries()) {
//     x++;
//     console.log(pair[0], pair[1]);
//   }
//   console.log(x);

//   try {
//     // שליחת בקשה ל-API בצורת multipart/form-data
//     const response = await axios.post(`${API_BASE_URL}/User`, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data'
//       }
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error in registerUser:', error);
//     if (axios.isAxiosError(error)) {
//       throw error.response?.data || error.message;
//     } else {
//       throw 'An unexpected error occurred';
//     }
//   }
// };

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

// פונקציה להבאת כישורים לפי מזהה משתמש
export const fetchTalentsByUserId = async (userId: number) => {
  const token = localStorage.getItem('authToken');

  if (!token) {
    throw new Error('No token found');
  }
  try {
    const response = await axios.get(`${API_BASE_URL}/TalentUser/getTalents/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};


// פונקציה לעדכון נתוני המשתמש
export const updateUserData = async (userId: number, userData: FormData) => {
  const token = localStorage.getItem('authToken');

  if (!token) {
    throw new Error('No token found');
  }

  for (const pair of userData.entries()) {
    console.log(pair[0], pair[1]);  // 🔹 פה תראי אם הנתונים נשלחים כמו שצריך
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
// פונקציה להוספת בקשת כישרון חדשה
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
export const fetchTalentRequests = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/TalentRequest`);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const deleteTalentRequest = async (id: number) => {
  try {
    await axios.delete(`${API_BASE_URL}/TalentRequest/${id}`);
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const updateTalentRequest = async (id: number, updatedTalent: any) => {
  try {
    await axios.put(`${API_BASE_URL}/TalentRequest/${id}`, updatedTalent, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};


import { useEffect, useState } from 'react';
import { fetchUserData } from '../apis/userApi';

const useUserData = () => {
  const [user, setUser] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await fetchUserData();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setErrorMessage('Error fetching user data');
      }
    };

    getUserData();
  }, []);

  return { user, errorMessage };
};

export default useUserData;
import { useEffect, useState } from 'react';
import { fetchUserData, updateUserData } from '../apis/userApi';

const useUserData = () => {
  const [user, setUser] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      const data = await fetchUserData();
      // console.log('User data from API:', data); // Print to console
      if (JSON.stringify(data) !== JSON.stringify(user)) {  // If the data differs
        setUser(data);  // Update state only if data changed
      }
      setErrorMessage(null); // Reset error message on success
    } catch (error) {
      console.error('Error fetching user data:', error);
      setErrorMessage('Error fetching user data');
    }
  };

  const updateUserDataAndRefresh = async (updatedData: any) => {
    if (!user) {
      setErrorMessage('User not found');
      return;
    }
    try {
      const updatedUser = await updateUserData(user.id, updatedData); // Update with userId
      if (JSON.stringify(updatedUser) !== JSON.stringify(user)) {  // If the info changed
        setUser(updatedUser);  // Update state with the new data
      }
    } catch (error) {
      // console.error('Error updating user data:', error);
      setErrorMessage('Error updating user data');
    }
  };

  // Initial call to fetch user data
  useEffect(() => {
    if (!user) {
      fetchUser(); // Call only if there is no data
    }
  }, [user]); // This condition triggers the call only if `user` changes

  return { user, errorMessage, refreshUserData: fetchUser, updateUserData: updateUserDataAndRefresh };
};

export default useUserData;

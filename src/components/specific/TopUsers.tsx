import React, { useEffect, useState } from 'react';
import { fetchTopUsers,getProfileImage} from '../../apis/userApi';
import '../../styles/TopUsers.css';
import { TopUserType } from '../../Types/123types';
import defaultUserImage from '../../assets/images/default-user.png';

const TopUsers: React.FC = () => {
  const [topUsers, setTopUsers] = useState<(TopUserType & { profileImage: string })[]>([]); // Add dynamic profileImage
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getTopUsers = async () => {
      try {
        const users = await fetchTopUsers();
    
        // Fetch profile image for each user
        const usersWithImages = await Promise.all(
          users.map(async (user: TopUserType) => {
            // Extract the id from the profile image URL
            const userId = user.profileImageUrl.split('/').pop(); // Split the URL and obtain the id
            let profileImage = '';
    
            if (userId) {
              try {
                profileImage = await getProfileImage(Number(userId)); // Send the id to the function
              } catch (error) {
                console.error('Error fetching profile image for user:', userId, error);
                profileImage = defaultUserImage; // Default image in case of an error
              }
            }
    
            return { ...user, profileImage }; // Add the profile image to the user's info
          })
        );
    
        setTopUsers(usersWithImages);
      } catch (error) {
        console.error('Error fetching top users:', error);
      } finally {
        setLoading(false);
      }
    };
    

    getTopUsers();
  }, []);

  if (loading) {
    return <div className="loading">טוען משתמשים מובילים...</div>;
  }

  return (
    <div className="top-users-container">
      <h2>משתמשים מובילים</h2>
      <ul className="top-users-list">
        {topUsers.map((user, index) => (
          <li key={index} className="top-user-item">
            <img src={user.profileImage} alt={user.userName} className="user-image" />
            <div className="user-details">
              <h3>{user.userName}</h3>
              <p>ציון: {user.score}</p>
              <p>{user.desc}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopUsers;

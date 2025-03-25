import React, { useEffect, useState } from 'react';
import { fetchTopUsers } from '../apis/usersApi';
import '../styles/TopUsers.css';
import { TopUser } from '../Types/TopUser';

const TopUsers: React.FC = () => {
    const [topUsers, setTopUsers] = useState<TopUser[]>([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const getTopUsers = async () => {
        try {
          const users = await fetchTopUsers();
          setTopUsers(users);
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
              <img src={user.profileImageUrl} alt={user.username} className="user-image" />
              <div className="user-details">
                <h3>{user.username}</h3>
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
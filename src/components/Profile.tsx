import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserData } from '../api'; // ייבוא הפונקציה מה-API
import '../styles/Profile.css'; // הוסף את קובץ ה-CSS שלך

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Fetching profile...');

    const getUserData = async () => {
      try {
        const data = await fetchUserData();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/login');
      }
    };

    getUserData();
  }, [navigate]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>שלום, {user.userName}</h1>
        <div className="profile-image-container">
          <img src={user.profileImageUrl} alt="Profile" className="profile-image" />
        </div>
      </div>

      <div className="profile-details">
        <p><strong>שם משתמש:</strong> {user.userName}</p>
        <p><strong>אימייל:</strong> {user.email}</p>
        <p><strong>תפקיד:</strong> {user.isAdmin ? 'מנהל' : 'משתמש'}</p>
        {/* הוספת פרטי מידע נוספים */}
      </div>

      <div className="profile-actions">
        <button onClick={() => navigate('/update-profile')} className="profile-button">
          עדכון פרופיל
        </button>
        <button onClick={() => navigate('/matches')} className="profile-button">
          צפייה בהתאמות
        </button>
      </div>
    </div>
  );
};


export default Profile;

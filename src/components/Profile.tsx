import React, { useEffect, useState } from 'react';
import { useNavigate, Route, Routes } from 'react-router-dom';
import { fetchTalentsByUserId, } from '../apis/talentUserApi';
import { fetchTalentById } from '../apis/talentApi'; 
import { fetchUserData} from '../apis/userApi'; 
import '../styles/Profile.css'; // הוסף את קובץ ה-CSS שלך
import HomeIcon from '@mui/icons-material/Home'; // ייבוא של אייקון הבית
import { IconButton, Avatar, Typography, Button } from '@mui/material';
import UpdateProfile from './UpdateProfile'; 
import Exchange from './Exchange';
import TalentRequests from './TalentRequests'; // ייבוא הקומפוננטה החדשה

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [talents, setTalents] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const handleViewDetails = () => {
    setErrorMessage(null); // Reset error message
    navigate('/profile'); // Navigate to the profile details route
  };

  const handleViewTalents = async () => {
    if (user) {
      try {
        const talents = await fetchTalentsByUserId(user.id);
        const talentDetails = await Promise.all(
          talents.map(async (talent: any) => {
            const details = await fetchTalentById(talent.talentId);
            return { ...details, isOffered: talent.isOffered };
          })
        );
        setTalents(talentDetails);
        setErrorMessage(null); // Reset error message
        navigate('/profile/talents'); // Navigate to the talents route
      } catch (error) {
        console.error('Error fetching talents:', error);
        setErrorMessage('לא נמצאו כשרונות עבור המשתמש הנתון.');
      }
    }
  };

  const handleUpdateProfile = () => {
    setErrorMessage(null); // Reset error message
    navigate('/profile/update'); // Navigate to the update profile route
  };

  const handleViewMatches = () => {
    setErrorMessage(null); // Reset error message
    navigate(`/profile/exchange?userId=${user.id}`); // Navigate to the exchange route with user ID
  };

  const handleViewTalentRequests = () => {
    setErrorMessage(null); // Reset error message
    navigate('/profile/talent-requests'); // Navigate to the talent requests route
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      <div className="header-buttons">
        <button onClick={handleLogout} className="logout-button">
          התנתקות
        </button>
        <IconButton onClick={() => navigate('/')} className="home-button">
          <HomeIcon />
        </IconButton>
      </div>
      <div className="profile-content">
        <div className="sidebar">
          <Button onClick={handleViewDetails} className="menu-button">פרטים</Button>
          <Button onClick={handleViewTalents} className="menu-button">כשרונות</Button>
          <Button onClick={handleUpdateProfile} className="menu-button">עדכון פרופיל</Button>
          <Button onClick={handleViewMatches} className="menu-button">התאמות</Button>
          {user.isAdmin && (
            <Button onClick={handleViewTalentRequests} className="menu-button">
              ניהול בקשת הכשרונות
            </Button>
          )}
        </div>
        <div className="main-content">
          <div className="profile-header">
            <Avatar alt={user.userName} src={user.profileImageUrl} className="profile-image" />
            <Typography variant="h6" className="profile-title">שלום, {user.userName}</Typography>
          </div>

          {errorMessage && (
            <div className="error-message">{errorMessage}</div>
          )}

          <Routes>
            <Route path="/" element={
              <div className="profile-details">
                <p><strong>שם משתמש:</strong> {user.userName}</p>
                <p><strong>אימייל:</strong> {user.email}</p>
                <p><strong>מספר טלפון:</strong> {user.phoneNumber}</p>
                <p><strong>תפקיד:</strong> {user.isAdmin ? 'מנהל' : 'משתמש'}</p>
                <p><strong>גיל:</strong> {user.age}</p>
                <p><strong>מין:</strong> {user.gender === 'Male' ? 'זכר' : 'נקבה'}</p>
                <p><strong>ציון:</strong> {user.score}</p>
                <p><strong>פעיל:</strong> {user.isActive ? 'כן' : 'לא'}</p>
                <p><strong>תאור:</strong> {user.desc}</p>
              </div>
            } />
            <Route path="talents" element={
              <div className="profile-talents">
                <h2>הכשרונות שלי</h2>
                {talents.length === 0 ? (
                  <div className="no-talents-message">לא נמצאו לך כשרונות. נסה שוב מאוחר יותר.</div>
                ) : (
                  <div className="my-talents-container">
                    <div className="offered-talents">
                      <h3>כשרונות מוצעים</h3>
                      <ul>
                        {talents
                          .filter(talent => talent.isOffered)
                          .map(talent => (
                            <li key={talent.id}>{talent.talentName}</li>
                          ))}
                      </ul>
                    </div>
                    <div className="wanted-talents">
                      <h3>כשרונות רצויים</h3>
                      <ul>
                        {talents
                          .filter(talent => !talent.isOffered)
                          .map(talent => (
                            <li key={talent.id}>{talent.talentName}</li>
                          ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            } />
            <Route path="update" element={<UpdateProfile />} />
            <Route path="exchange" element={<Exchange />} />
            <Route path="talent-requests" element={<TalentRequests />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Profile;
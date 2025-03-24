import React, { useEffect, useState } from 'react';
import { ThumbUp, ThumbDown, NewReleases, HourglassEmpty, Cached, Done } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchDealsByUser, fetchUserById, fetchTalentById, updateUserScore, updateDealStatus } from '../apis/api';
import '../styles/Exchange.css';
import { Tabs, Tab, Box, Button } from '@mui/material'; // ייבוא נוסף לכרטיסיות ולכפתורים

const Exchange = () => {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedDeals, setLikedDeals] = useState<{ [key: string]: 'like' | 'dislike' | null }>({});
  const [tabIndex, setTabIndex] = useState(0); // ניהול הכרטיסיות
  const navigate = useNavigate();
  const location = useLocation();
  const userId = new URLSearchParams(location.search).get('userId');

  useEffect(() => {
    const getDeals = async () => {
      try {
        if (userId) {
          console.log(`Fetching deals for user ID: ${userId}`);
          const dealsData = await fetchDealsByUser(Number(userId));
          console.log('Deals data:', dealsData);

          // שליפת שמות המשתמשים ושמות הכישרונות
          const updatedDeals = await Promise.all(
            dealsData.map(async (deal: any) => {
              const user1 = await fetchUserById(deal.user1Id);
              const user2 = await fetchUserById(deal.user2Id);
              const talent1 = await fetchTalentById(deal.talent1Offered);
              const talent2 = await fetchTalentById(deal.talent2Offered);

              return {
                ...deal,
                user1Name: user1 ? user1.userName : 'משתמש לא נמצא',
                user2Name: user2 ? user2.userName : 'משתמש לא נמצא',
                talent1Name: talent1 ? talent1.talentName : 'כישרון לא נמצא',
                talent2Name: talent2 ? talent2.talentName : 'כישרון לא נמצא',
                status: deal.status.toString() // המרת הסטטוס למחרוזת
              };
            })
          );

          setDeals(updatedDeals);

          // שליפת מצבי הלייק/דיסלייק מ-Local Storage תוך שימוש במזהה משתמש
          const storedLikes = JSON.parse(localStorage.getItem(`likedDeals_${userId}`) || '{}');
          console.log('Stored likes:', storedLikes);
          setLikedDeals(storedLikes);
        }
      } catch (error) {
        console.error('Error fetching deals:', error);
      } finally {
        setLoading(false);
      }
    };

    getDeals();
  }, [userId]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(`Tab changed to index: ${newValue}`);
    setTabIndex(newValue);
  };

  const handleLikeDislike = async (dealId: number, action: number, deal: any) => {
    try {
      // זיהוי המשתמש השני בעסקה
      const targetUserId = deal.user1Id === Number(userId) ? deal.user2Id : deal.user1Id;

      // עדכון הניקוד בשרת
      await updateUserScore(targetUserId, action);
      console.log(`Updated score for user ID: ${targetUserId} with action: ${action}`);

      // יצירת מפתח ייחודי לכל עסקה ולכל משתמש
      const dealKey = `${userId}_${dealId}`;

      // עדכון מצב הלייק/דיסלייק ב-UI וב-Local Storage תוך שימוש במזהה משתמש
      setLikedDeals((prev) => {
        const current = prev[dealKey];
        const newLikedDeals = { ...prev };

        switch (action) {
          case 3: // ביטול לייק
            if (current === 'like') {
              newLikedDeals[dealKey] = null;
            }
            break;
          case 2: // ביטול דיסלייק
            if (current === 'dislike') {
              newLikedDeals[dealKey] = null;
            }
            break;
          case 1: // לייק
            newLikedDeals[dealKey] = 'like';
            break;
          case 0: // דיסלייק
            newLikedDeals[dealKey] = 'dislike';
            break;
          default:
            return prev;
        }

        console.log('Updated liked deals:', newLikedDeals);
        localStorage.setItem(`likedDeals_${userId}`, JSON.stringify(newLikedDeals));
        return newLikedDeals;
      });
    } catch (error) {
      console.error('Error updating like/dislike:', error);
      alert('שגיאה בעדכון הניקוד');
    }
  };

  const handleApproveDeal = async (deal: any) => {
    try {
      let newStatus: string = '1'; // בהמתנה

      if (deal.status === '0' && deal.user1Id === Number(userId)) {
        newStatus = '1'; // משתמש 1 אישר, מעביר לסטטוס בהמתנה
      } else if (deal.status === '1' && deal.user2Id === Number(userId)) {
        newStatus = '2'; // משתמש 2 אישר, מעביר לסטטוס באמצע
      } else if (deal.status === '2' && (deal.user1Id === Number(userId) || deal.user2Id === Number(userId))) {
        newStatus = '3'; // שניהם אישרו סיום, מעביר לסטטוס הסתיימה
      }

      await updateDealStatus(deal.id, Number(newStatus));
      setDeals((prevDeals) =>
        prevDeals.map((d) => (d.id === deal.id ? { ...d, status: newStatus } : d))
      );
    } catch (error) {
      console.error('Error updating deal status:', error);
    }
  };

  const renderDeals = (status: string) => {
    const filteredDeals = deals.filter(deal => deal.status === status);
    console.log(`Filtered deals for status ${status}:`, filteredDeals);
    if (filteredDeals.length === 0) {
      return <div className="no-deals-message">לא נמצאו עסקאות בקטגוריה זו.</div>;
    }

    return (
      <ul>
        {filteredDeals.map(deal => (
          <li key={deal.id} className="deal-item">
            <div className="user"><strong>משתמש 1:</strong> {deal.user1Name}</div>
            <div className="user"><strong>משתמש 2:</strong> {deal.user2Name}</div>
            <div className="status"><strong>סטטוס:</strong> {deal.status}</div>
            <div className="talent"><strong>כישרון משתמש 1:</strong> {deal.talent1Name}</div>
            <div className="talent"><strong>כישרון משתמש 2:</strong> {deal.talent2Name}</div>
            <div className="date"><strong>תאריך יצירת ההתאמה:</strong> {new Date(deal.dateCreated).toLocaleDateString()}</div>
            <div className="actions">
              {status === '0' && (
                <Button variant="contained" color="primary" onClick={() => handleApproveDeal(deal)}>
                  אשר עסקה
                </Button>
              )}
              {status === '1' && deal.user2Id === Number(userId) && (
                <Button variant="contained" color="primary" onClick={() => handleApproveDeal(deal)}>
                  אשר עסקה
                </Button>
              )}
              {status === '2' && (
                <Button variant="contained" color="primary" onClick={() => handleApproveDeal(deal)}>
                  סיים עסקה
                </Button>
              )}
              <button
                className={`like-button ${likedDeals[`${userId}_${deal.id}`] === 'like' ? 'active' : ''}`}
                onClick={() => handleLikeDislike(deal.id, likedDeals[`${userId}_${deal.id}`] === 'like' ? 3 : 1, deal)}
                disabled={likedDeals[`${userId}_${deal.id}`] === 'dislike'}
                title="לחץ כדי לתת לייק"
              >
                <ThumbUp />
              </button>
              <button
                className={`dislike-button ${likedDeals[`${userId}_${deal.id}`] === 'dislike' ? 'active' : ''}`}
                onClick={() => handleLikeDislike(deal.id, likedDeals[`${userId}_${deal.id}`] === 'dislike' ? 2 : 0, deal)}
                disabled={likedDeals[`${userId}_${deal.id}`] === 'like'}
                title="לחץ כדי לתת דיסלייק"
              >
                <ThumbDown />
              </button>
            </div>
            <button
              className="chat-button"
              onClick={() => navigate(`/chat/${deal.id}?userId=${userId}`)}
              >
              מעבר לצ'אט
            </button>
          </li>
        ))}
      </ul>
    );
  };

  if (loading) {
    return <div className="no-deals-message">טוען נתונים...</div>;
  }

  if (!deals.length) {
    return <div className="no-deals-message">לא נמצאו התאמות בשבילך. נסה שוב מאוחר יותר.</div>;
  }

  return (
    <div className="deals-container">
      <h2>התאמות</h2>
      <Tabs value={tabIndex} onChange={handleTabChange} aria-label="status tabs">
        <Tab label="עסקאות חדשות" icon={<NewReleases />} />
        <Tab label="עסקאות בהמתנה" icon={<HourglassEmpty />} />
        <Tab label="עסקאות באמצע" icon={<Cached />} />
        <Tab label="עסקאות שהסתימו" icon={<Done />} />
      </Tabs>
      <Box>
        {tabIndex === 0 && renderDeals('0')}
        {tabIndex === 1 && renderDeals('1')}
        {tabIndex === 2 && renderDeals('2')}
        {tabIndex === 3 && renderDeals('3')}
      </Box>
    </div>
  );
};

export default Exchange;
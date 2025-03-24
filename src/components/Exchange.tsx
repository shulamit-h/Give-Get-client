import React, { useEffect, useState } from 'react';
import { ThumbUp, ThumbDown } from '@mui/icons-material'; // ייבוא האייקונים
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchDealsByUser, fetchUserById, fetchTalentById, updateUserScore } from '../apis/api';
import '../styles/Exchange.css';

const Exchange = () => {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedDeals, setLikedDeals] = useState<{ [key: string]: 'like' | 'dislike' | null }>({});
  const navigate = useNavigate();
  const location = useLocation();
  const userId = new URLSearchParams(location.search).get('userId');

  useEffect(() => {
    const getDeals = async () => {
      try {
        if (userId) {
          const dealsData = await fetchDealsByUser(Number(userId));

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
              };
            })
          );

          setDeals(updatedDeals);

          // שליפת מצבי הלייק/דיסלייק מ-Local Storage תוך שימוש במזהה משתמש
          const storedLikes = JSON.parse(localStorage.getItem(`likedDeals_${userId}`) || '{}');
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

  const handleLikeDislike = async (dealId: number, action: number, deal: any) => {
    try {
      // זיהוי המשתמש השני בעסקה
      const targetUserId = deal.user1Id === Number(userId) ? deal.user2Id : deal.user1Id;

      // עדכון הניקוד בשרת
      await updateUserScore(targetUserId, action);

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

        localStorage.setItem(`likedDeals_${userId}`, JSON.stringify(newLikedDeals));
        return newLikedDeals;
      });
    } catch (error) {
      console.error('Error updating like/dislike:', error);
      alert('שגיאה בעדכון הניקוד');
    }
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
      <ul>
        {deals.map(deal => (
          <li key={deal.id} className="deal-item">
            <div className="user"><strong>משתמש 1:</strong> {deal.user1Name}</div>
            <div className="user"><strong>משתמש 2:</strong> {deal.user2Name}</div>
            <div className="status"><strong>סטטוס:</strong> {deal.status}</div>
            <div className="talent"><strong>כישרון משתמש 1:</strong> {deal.talent1Name}</div>
            <div className="talent"><strong>כישרון משתמש 2:</strong> {deal.talent2Name}</div>
            <div className="date"><strong>תאריך יצירת ההתאמה:</strong> {new Date(deal.dateCreated).toLocaleDateString()}</div>
            <div className="actions">
              <button
                className={`like-button ${likedDeals[`${userId}_${deal.id}`] === 'like' ? 'active' : ''}`}
                onClick={() => handleLikeDislike(deal.id, likedDeals[`${userId}_${deal.id}`] === 'like' ? 3 : 1, deal)} // מעבירים את כל האובייקט deal
                disabled={likedDeals[`${userId}_${deal.id}`] === 'dislike'}
                title="לחץ כדי לתת לייק"
              >
                <ThumbUp />
              </button>
              <button
                className={`dislike-button ${likedDeals[`${userId}_${deal.id}`] === 'dislike' ? 'active' : ''}`}
                onClick={() => handleLikeDislike(deal.id, likedDeals[`${userId}_${deal.id}`] === 'dislike' ? 2 : 0, deal)} // מעבירים את כל האובייקט deal
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
    </div>
  );
};

export default Exchange;
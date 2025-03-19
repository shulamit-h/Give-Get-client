import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchDealsByUser, fetchUserById, fetchTalentById } from '../api';
import '../styles/Exchange.css';

const Exchange = () => {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
        }
      } catch (error) {
        console.error('Error fetching deals:', error);
      } finally {
        setLoading(false);
      }
    };

    getDeals();
  }, [userId]);

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
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Exchange;
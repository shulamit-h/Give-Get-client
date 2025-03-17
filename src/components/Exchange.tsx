import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchDealsByUser } from '../api';
import '../styles/Exchange.css';

const Exchange = () => {
    const [deals, setDeals] = useState<any[]>([]);
    const navigate = useNavigate();
    const location = useLocation();
    const userId = new URLSearchParams(location.search).get('userId');
  
    useEffect(() => {
      const getDeals = async () => {
        try {
          if (userId) {
            const dealsData = await fetchDealsByUser(Number(userId));
            setDeals(dealsData);
          }
        } catch (error) {
          console.error('Error fetching deals:', error);
        }
      };
  
      getDeals();
    }, [userId]);
  
    if (!deals.length) {
      return <div className="no-deals-message">לא נמצאו התאמות בשבילך. נסה שוב מאוחר יותר.</div>;
    }
  
    return (
      <div className="deals-container">
        <h2>התאמות</h2>
        <ul>
          {deals.map(deal => (
            <li key={deal.id}>
              <div><strong>Id:</strong> {deal.id}</div>
              <div><strong>User 1 Id:</strong> {deal.user1Id}</div>
              <div><strong>User 2 Id:</strong> {deal.user2Id}</div>
              <div><strong>Status:</strong> {deal.status}</div>
              <div><strong>Talent 1 Offered:</strong> {deal.talent1Offered}</div>
              <div><strong>Talent 2 Offered:</strong> {deal.talent2Offered}</div>
              <div><strong>Date Created:</strong> {new Date(deal.dateCreated).toLocaleDateString()}</div>
              {deal.dateCompleted && (
                <div><strong>Date Completed:</strong> {new Date(deal.dateCompleted).toLocaleDateString()}</div>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
export default Exchange;
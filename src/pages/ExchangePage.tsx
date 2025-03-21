import React from 'react';
import ChatBox from '../components/ChatBox';

import { useParams } from 'react-router-dom';

const ExchangePage = () => {
  const { exchangeId } = useParams<{ exchangeId: string }>();
  const userId = Number(localStorage.getItem('authToken')); // קבלת מזהה המשתמש

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">צ'אט העסקה</h2>
      <ChatBox userId={userId} exchangeId={Number(exchangeId)} />
    </div>
  );
};

export default ExchangePage;
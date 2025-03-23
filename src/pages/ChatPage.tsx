import React from 'react';
import { useParams } from 'react-router-dom';
import ChatBox from '../components/ChatBox';

const ChatPage = () => {
  const { exchangeId } = useParams<{ exchangeId: string }>();
  const userId = Number(localStorage.getItem('authToken'));

  if (!exchangeId) {
    return <div>Exchange ID is missing</div>;
  }

  return (
    <div className="chat-page">
      <h2>צ'אט העסקה</h2>
      <ChatBox userId={userId} exchangeId={Number(exchangeId)} />
    </div>
  );
};

export default ChatPage;
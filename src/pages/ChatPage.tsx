import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDealsByUser } from '../apis/api';
import '../styles/ChatsPage.css';

const ChatsPage = () => {
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadChats = async () => {
      try {
        const userId = localStorage.getItem('authToken'); // קבלת מזהה המשתמש
        if (userId) {
          const response = await fetchDealsByUser(Number(userId));
          setChats(response);
        }
      } catch (error) {
        console.error('Error fetching chats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChats();
  }, []);

  if (loading) {
    return <div>טוען צ'אטים...</div>;
  }

  if (!chats.length) {
    return <div>אין צ'אטים זמינים.</div>;
  }

  return (
    <div className="chats-page">
      <h2>הצ'אטים שלי</h2>
      <ul>
        {chats.map((chat) => (
          <li key={chat.id} onClick={() => navigate(`/chat/${chat.id}`)}>
            <strong>משתמש:</strong> {chat.user2Name} | <strong>כישרון:</strong> {chat.talent1Name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatsPage;
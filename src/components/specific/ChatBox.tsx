import React, { useEffect, useState } from 'react';
import { startChatConnection, stopChatConnection, sendMessage } from '../../services/chatService';
import { getChatHistory } from '../../apis/chatApi';
import { MessageType, ChatBoxPropsType } from '../../Types/123types';
import '../../styles/ChatBox.css';


const ChatBox: React.FC<ChatBoxPropsType> = ({ userId, exchangeId }) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState<string>('');
  const [userImages, setUserImages] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const initChat = async () => {
      try {
        const history = await getChatHistory(exchangeId);
        setMessages(history);

        // דוגמה לטעינת תמונות משתמשים (ניתן להחליף ב-API אמיתי)
        const images = {
          [userId]: '/path/to/current-user.jpg', // תמונת המשתמש הנוכחי
          2: '/path/to/other-user.jpg', // תמונת משתמש אחר
        };
        setUserImages(images);

        await startChatConnection(userId, exchangeId, (msg) => {
          setMessages((prev) => [...prev, msg]);
        });
      } catch (error) {
        console.error('Error initializing chat:', error);
      }
    };

    initChat();

    return () => {
      stopChatConnection();
    };
  }, [userId, exchangeId]);

  const handleSend = async () => {
    if (!input.trim()) return;
    console.log('Sending message:', input);
    await sendMessage(exchangeId, userId, input);
    setInput('');
  };

  return (
    <div className="chat-box">
      <div className="messages">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message ${msg.fromUserId === userId ? 'sent' : 'received'}`}
          >
            <img
              src={userImages[msg.fromUserId] || '/path/to/default-user.jpg'}
              alt="User"
              className="user-image"
            />
            <div className="message-content">
              <p>{msg.text}</p>
              <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
            </div>
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="כתוב הודעה..."
        />
        <button onClick={handleSend}>שלח</button>
      </div>
    </div>
  );
};

export default ChatBox;
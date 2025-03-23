import React, { useEffect, useState } from 'react';
import { startChatConnection, stopChatConnection, sendMessage } from '../services/chatService';
import { getChatHistory } from '../apis/chatApi';
import { Message } from '../Types/message';

interface ChatBoxProps {
  userId: number;
  exchangeId: number;
}

const ChatBox: React.FC<ChatBoxProps> = ({ userId, exchangeId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');

  useEffect(() => {
    const initChat = async () => {
      try {
        const history = await getChatHistory(exchangeId);
        setMessages(history);

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
          <div key={idx} className={msg.fromUserId === userId ? 'message sent' : 'message received'}>
            <p>{msg.text}</p>
            <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
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
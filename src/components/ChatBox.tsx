import React, { useEffect, useState } from 'react';
import { startChatConnection, sendMessage, stopChatConnection } from '../services/chatService';
import { getChatHistory } from '../apis/chatApi';
import { Message } from '../Types/message';

interface ChatBoxProps {
  userId: number;
  exchangeId: number;
}

const ChatBox: React.FC<ChatBoxProps> = ({ userId, exchangeId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');

  // התחברות ל-SignalR וטעינת היסטוריה
  useEffect(() => {
    const initChat = async () => {
      const history = await getChatHistory(exchangeId);
      setMessages(history);

      await startChatConnection(userId, exchangeId, (msg) => {
        setMessages(prev => [...prev, msg]);
      });
    };

    initChat();

    return () => { stopChatConnection(); };
  }, [userId, exchangeId]);

  const handleSend = async () => {
    if (!input.trim()) return;
    await sendMessage(exchangeId, userId, input);
    setInput('');
  };

  return (
    <div className="border p-4 rounded w-full h-96 flex flex-col">
      <div className="flex-1 overflow-y-auto mb-2">
        {messages.map((msg, idx) => (
          <div key={idx} className={`p-2 ${msg.fromUserId === userId ? 'text-right bg-blue-100' : 'bg-gray-100'}`}>
            <span>{msg.text}</span>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          className="border flex-1 p-2 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="כתוב הודעה..."
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded ml-2" onClick={handleSend}>שלח</button>
      </div>
    </div>
  );
};

export default ChatBox;

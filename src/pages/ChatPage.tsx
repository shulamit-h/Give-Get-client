import { useParams, useLocation } from 'react-router-dom';
import ChatBox from '../components/ChatBox';

const ChatPage = () => {
  const { exchangeId } = useParams<{ exchangeId: string }>();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get('userId');  // שליפת ה-userId מה-URL

  if (!exchangeId || !userId) {
    return <div>Exchange ID or User ID is missing</div>;
  }

  return (
    <div className="chat-page">
      <h2>צ'אט העסקה</h2>
      <ChatBox userId={Number(userId)} exchangeId={Number(exchangeId)} />
    </div>
  );
};

export default ChatPage;
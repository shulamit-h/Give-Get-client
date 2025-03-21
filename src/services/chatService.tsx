import * as signalR from '@microsoft/signalr';
import { Message } from '../Types/message';
import { HUB_URL } from '../apis/baseUrls';

let connection: signalR.HubConnection | null = null;

// יצירת חיבור ל-SignalR עם Token
export const startChatConnection = async (
    userId: number,
    exchangeId: number,
    onReceive: (msg: Message) => void
) => {
        const token = localStorage.getItem('authToken'); // מקבל את ה-Token ששמרת בלוגין
        console.log('Token:', token);

        // יצירת החיבור עם ה-token
        connection = new signalR.HubConnectionBuilder()
            .withUrl(`${HUB_URL}?access_token=${token}`, { withCredentials: true }) // העברת ה-token ב-query
            .withAutomaticReconnect()  // חיבור אוטומטי מחדש אם יש בעיות חיבור
            .build();

        // מאזין להודעות חדשות מהשרת
        connection.on("ReceiveMessage", (fromUserId: number, text: string, time: string) => {
            onReceive({ fromUserId, text, time });
        });

        // טיפול בשגיאות חיבור
        connection.onclose(error => {
            console.error("SignalR connection closed:", error);
        });

        // התחלת החיבור
        await connection.start();
        // הצטרפות לחדר של העסקה
        await connection.invoke("Join", userId, exchangeId);
};

// שליחת הודעה
export const sendMessage = async (exchangeId: number, userId: number, text: string) => {
    if (connection) {
        await connection.invoke("SendMessage", exchangeId, userId, text);
    }
};

// ניתוק חיבור
export const stopChatConnection = async () => {
    if (connection) await connection.stop();
};

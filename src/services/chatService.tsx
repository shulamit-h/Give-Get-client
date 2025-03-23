import * as signalR from '@microsoft/signalr';
import { Message } from '../Types/message';
import { HUB_URL } from '../apis/baseUrls';

let connection: signalR.HubConnection | null = null;

// יצירת חיבור ל-SignalR
export const startChatConnection = async (
    userId: number,
    exchangeId: number,
    onReceive: (msg: Message) => void
) => {

    console.log(1, '\nStarting SignalR connection...');

    const token = localStorage.getItem('authToken');
    if (!token) {
        console.error('No auth token found in localStorage');
        alert('No authentication token found.');
        return;
    }
    console.log(2, '\ntoken:', token);


    const connectionUrl = `${HUB_URL}`;  // הוספת ה-token ל-URL
    console.log(2.5, 'connectionUrl:', connectionUrl);

    connection = new signalR.HubConnectionBuilder()
        .withUrl(connectionUrl, {
            accessTokenFactory: () => token,
            skipNegotiation: true,
            transport: signalR.HttpTransportType.WebSockets
        })
        .withAutomaticReconnect()
        .build();


    console.log(3, '\nconnection:', connection);


    connection.on('ReceiveMessage', (fromUserId: number, text: string, timestamp: string) => {
        onReceive({ fromUserId, text, timestamp });
    });

    console.log(4, '\nconnection.on(\'ReceiveMessage');

    connection.onclose((error) => {
        console.error('SignalR connection closed:', error);
    });

    console.log(5, '\nconnection.onclose');


    connection.onreconnected(() => {
        console.log('Reconnected to SignalR. Rejoining the chat...');
        if (connection?.state === signalR.HubConnectionState.Connected) {
            connection.invoke('Join', userId, exchangeId).catch(err =>
                console.error('Failed to re-Join after reconnect:', err)
            );
        }
    });

    console.log(6, '\nconnection.onreconnected');

    try {
        console.log('start real connection');

        console.log(11, 'Attempting to connect...');
        await connection.start();
        console.log(22, 'connection state:', connection.state);
        try {
            await connection.invoke('Join',Number(userId), Number(exchangeId));
            console.log(33, 'Joined chat');
        } catch (err: unknown) {
            console.error('Failed to join chat:', err);            
        }
        
    } catch (err: unknown) {
        console.error('Failed to connect to SignalR:', err);

        if (err instanceof Error) {
            // אם 'err' הוא instance של Error, גישה ל-message בטוחה
            console.error('Error details:', err.message);
            alert(`Failed to connect to the chat server. Please check your connection.\nError: ${err.message}`);
        } else {
            // אם 'err' לא אובייקט מסוג Error
            alert(`Failed to connect to the chat server. Please check your connection.\nError: ${String(err)}`);
        }
    }
};





// שליחת הודעה
export const sendMessage = async (exchangeId: number, userId: number, text: string) => {
    console.log('Sending message to server:', { exchangeId, userId, text });
    if (connection && connection.state === signalR.HubConnectionState.Connected) {
        try {
            await connection.invoke('SendMessage', exchangeId, userId, text);
        } catch (err) {
            console.error('Failed to send message:', err);
        }
    } else {
        console.warn('Cannot send message. Connection is not active.');
    }
};

// ניתוק חיבור
export const stopChatConnection = async () => {
    if (connection) {
        try {
            await connection.stop();
            console.log('SignalR connection stopped');
        } catch (err) {
            console.error('Failed to stop SignalR connection:', err);
        }
    }
};

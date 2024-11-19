import { useState, useEffect, useCallback } from 'react'
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import axios from 'axios';

//Typescript
export interface informDetail {
  Name: string;
  FirstName: number;
  LastName: string;
  Place: string;
}

interface MessageList {
  messageID: number;
  senderID: number;
  receiverID: number;
  message: string;
  date: string;
  time: string;
  chatID: number;
}

interface Message {
  user: string;
  text: string;
}

const App = () => {

  // //SignalR
  // const [connection, setConnection] = useState<any>();

  // const joinRoom = async (user: any, room: any) => {
  //   try {
  //     //Connect to backend
  //     const connection = new HubConnectionBuilder()
  //       // Url of Backend
  //       .withUrl("http://localhost:7121/chat")
  //       .configureLogging(LogLevel.Information)
  //       .build();

  //     //Setup handler
  //     connection.on("ReceiveMessage", (user, message) => {
  //       console.log('message receive: ', message);
  //       console.log(user);
  //     })

  //     //Strat the connection
  //     await connection.start();
  //     //Invoke into the JoinRoom method
  //     await connection.invoke("JoinRoom", { user, room });
  //     setConnection(connection);

  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

  // console.log(connection);

  // //API
  // const [data, setData] = useState<any>([])

  // function getInform() {
  //   axios.get(`http://localhost:7121/api/SuperHero/1`)
  //     .then((response) => {
  //       setData(response.data)
  //     });
  // }

  // useEffect(() => {
  //   getInform()
  // }, []);

  // console.log(data);


  // return <div>
  //   <form onSubmit={e => {
  //     e.preventDefault();
  //     joinRoom("Lee", "1");
  //   }}>
  //     <h2>MyChat</h2>
  //     <hr />
  //     <button type='submit'>Join</button>
  //   </form>
  // </div>



  const [connection, setConnection] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [user, setUser] = useState<string>('User'); // You can set the user from a login system
  const [room, setRoom] = useState<string>('general'); // Default room
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);

  // Establish SignalR connection and handlers
  useEffect(() => {
    const connectSignalR = async () => {
      const connection = new HubConnectionBuilder()
        .withUrl('http://localhost:7121/chat')  // Replace with your backend URL
        .build();

      connection.on('ReceiveMessage', (user: string, message: string) => {
        console.log('Received message:', { user, message });
        setMessages((prevMessages) => [
          ...prevMessages,
          { user, text: message }
        ]);
      });
      // connection.off('ReceiveMessage');

      try {
      //   if (!connection._connectionStarted) {
      //     await connection.start(); // Start connection only once
      //     setConnection(connection);
      // }
        await connection.start();
        setConnection(connection);
        // Join the room after connection is established
        // await connection.invoke('JoinRoom', room);
        setIsJoined(true);
        // Fetch historical messages for the room
        fetchHistoricalMessages();
      } catch (err) {
        console.error('Error while establishing connection: ', err);
      }
    };

    connectSignalR();

    // Cleanup the connection on unmount
    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, [room]);

  // Fetch historical messages from backend
  const fetchHistoricalMessages = useCallback(async () => {
    // if (connection && room) {
    //     try {
    //         const messages = await connection.invoke('GetHistoricalMessages', room);
    //         setMessages(messages);
    //     } catch (err) {
    //         console.error('Error fetching historical messages: ', err);
    //     }
    // }
  }, [connection, room]);

  // Send a new message to the selected room
  const sendMessage = async () => {
    if (connection && newMessage.trim() && !isSending) {
        try {
            await connection.invoke('SendMessageToRoom', room, user, newMessage);
            setNewMessage('');
        } catch (err) {
            console.error('Error sending message: ', err);
        }finally{
          setIsSending(false);
        }
    }
};

  // Change the room and rejoin
  const changeRoom = async (newRoom: string) => {
    if (connection) {
      // Leave the current room
      await connection.invoke('LeaveRoom', room);
      // Join the new room
      setRoom(newRoom);
      setMessages([]);
      await connection.invoke('JoinRoom', newRoom);
      setIsJoined(true);
      // Fetch new room's historical messages
      fetchHistoricalMessages();
    }
  };

  return (
    <div>
      <h1>Chat Room: {room}</h1>
      <div>
        <button onClick={() => changeRoom('general')}>General</button>
        <button onClick={() => changeRoom('tech')}>Tech</button>
        <button onClick={() => changeRoom('random')}>Random</button>
      </div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.user}</strong>: {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );

}

export default App
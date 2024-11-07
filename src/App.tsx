import { useState, useEffect } from 'react'
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import axios from 'axios';

//Typescript
export interface informDetail {
  Name: string;
  FirstName: number;
  LastName: string;
  Place: string;
}

const App = () => {

  //SignalR
  const [connection, setConnection] = useState<any>();

  const joinRoom = async (user: any, room: any) => {
    try {
      //Connect to backend
      const connection = new HubConnectionBuilder()
        // Url of Backend
        .withUrl("https://localhost:7121/chat")
        .configureLogging(LogLevel.Information)
        .build();

      //Setup handler
      connection.on("ReceiveMessage", (user, message) => {
        console.log('message receive: ', message);
      })

      //Strat the connection
      await connection.start();
      //Invoke into the JoinRoom method
      await connection.invoke("JoinRoom", { user, room });
      setConnection(connection);

    } catch (e) {
      console.log(e);
    }
  }

  //API
  const [data, setData] = useState<any>([])

  function getInform() {
    axios.get(`https://localhost:7121/api/SuperHero/1`)
      .then((response) => {
        setData(response.data)
      });
  }

  useEffect(() => {
    getInform()
  }, []);

  console.log(data);

  
  return <div>
    <form onSubmit={e => {
      e.preventDefault();
      joinRoom("Lee", "1");
    }}>
      <h2>MyChat</h2>
      <hr />
      <button type='submit'>Join</button>
    </form>
  </div>
}

export default App
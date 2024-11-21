import { useState, useEffect, useRef, useCallback } from 'react'
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import axios from 'axios';
import {
  CallControls,
  CallingState,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  useCallStateHooks,
  User,
} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import './CSS/VideoCall.css'




// //Typescript
// export interface informDetail {
//   Name: string;
//   FirstName: number;
//   LastName: string;
//   Place: string;
// }

// interface MessageList {
//   messageID: number;
//   senderID: number;
//   receiverID: number;
//   message: string;
//   date: string;
//   time: string;
//   chatID: number;
// }

// interface Message {
//   user: string;
//   text: string;
// }

// const App = () => {
  //   const [connection, setConnection] = useState<any>(null);
  //   const [messages, setMessages] = useState<Message[]>([]);
  //   const [newMessage, setNewMessage] = useState<string>('');
  //   const [user, setUser] = useState<string>('User'); // You can set the user from a login system
  //   const [room, setRoom] = useState<string>('general'); // Default room
  //   const [isJoined, setIsJoined] = useState<boolean>(false);
  //   const [isSending, setIsSending] = useState<boolean>(false);

  //   // Establish SignalR connection and handlers
  //   useEffect(() => {
  //     const connectSignalR = async () => {
  //       const connection = new HubConnectionBuilder()
  //         .withUrl('http://localhost:7121/chat')  // Replace with your backend URL
  //         .build();

  //       connection.on('ReceiveMessage', (user: string, message: string) => {
  //         console.log('Received message:', { user, message });
  //         setMessages((prevMessages) => [
  //           ...prevMessages,
  //           { user, text: message }
  //         ]);
  //       });
  //       // connection.off('ReceiveMessage');

  //       try {
  //       //   if (!connection._connectionStarted) {
  //       //     await connection.start(); // Start connection only once
  //       //     setConnection(connection);
  //       // }
  //         await connection.start();
  //         setConnection(connection);
  //         // Join the room after connection is established
  //         // await connection.invoke('JoinRoom', room);
  //         setIsJoined(true);
  //         // Fetch historical messages for the room
  //         fetchHistoricalMessages();
  //       } catch (err) {
  //         console.error('Error while establishing connection: ', err);
  //       }
  //     };

  //     connectSignalR();

  //     // Cleanup the connection on unmount
  //     return () => {
  //       if (connection) {
  //         connection.stop();
  //       }
  //     };
  //   }, [room]);

  //   // Fetch historical messages from backend
  //   const fetchHistoricalMessages = useCallback(async () => {
  //     // if (connection && room) {
  //     //     try {
  //     //         const messages = await connection.invoke('GetHistoricalMessages', room);
  //     //         setMessages(messages);
  //     //     } catch (err) {
  //     //         console.error('Error fetching historical messages: ', err);
  //     //     }
  //     // }
  //   }, [connection, room]);

  //   // Send a new message to the selected room
  //   const sendMessage = async () => {
  //     if (connection && newMessage.trim() && !isSending) {
  //         try {
  //             await connection.invoke('SendMessageToRoom', room, user, newMessage);
  //             setNewMessage('');
  //         } catch (err) {
  //             console.error('Error sending message: ', err);
  //         }finally{
  //           setIsSending(false);
  //         }
  //     }
  // };

  //   // Change the room and rejoin
  //   const changeRoom = async (newRoom: string) => {
  //     if (connection) {
  //       // Leave the current room
  //       await connection.invoke('LeaveRoom', room);
  //       // Join the new room
  //       setRoom(newRoom);
  //       setMessages([]);
  //       await connection.invoke('JoinRoom', newRoom);
  //       setIsJoined(true);
  //       // Fetch new room's historical messages
  //       fetchHistoricalMessages();
  //     }
  //   };

  //   return (
  //     <div>
  //       <h1>Chat Room: {room}</h1>
  //       <div>
  //         <button onClick={() => changeRoom('general')}>General</button>
  //         <button onClick={() => changeRoom('tech')}>Tech</button>
  //         <button onClick={() => changeRoom('random')}>Random</button>
  //       </div>
  //       <div>
  //         {messages.map((msg, index) => (
  //           <div key={index}>
  //             <strong>{msg.user}</strong>: {msg.text}
  //           </div>
  //         ))}
  //       </div>
  //       <input
  //         type="text"
  //         value={newMessage}
  //         onChange={(e) => setNewMessage(e.target.value)}
  //         placeholder="Type a message..."
  //       />
  //       <button onClick={sendMessage}>Send</button>
  //     </div>
  //   );

  // const [userId, setUserId] = useState<string>('user_' + Math.random().toString(36).substr(2, 9)); // Unique ID for each user
  // const [participants, setParticipants] = useState<string[]>(["1"]); // List of participant IDs
  // const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  // const [isCalling, setIsCalling] = useState(false);

  // const connectionRef = useRef<any>(null);
  // const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  // const remoteVideoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

  // const localVideoRef = useRef<HTMLVideoElement>(null);

  // // Get local media (audio and video)
  // const getLocalStream = async () => {
  //   try {
  //     const stream = await navigator.mediaDevices.getUserMedia({
  //       video: true,
  //       audio: true,
  //     });
  //     setLocalStream(stream);
  //     if (localVideoRef.current) {
  //       localVideoRef.current.srcObject = stream;
  //     }
  //   } catch (err) {
  //     console.error('Error accessing media devices:', err);
  //   }
  // };

  // // Initialize SignalR connection
  // const initializeSignalR = () => {
  //   connectionRef.current = new HubConnectionBuilder()
  //     .withUrl("http://localhost:5000/signalrHub")  // SignalR Hub URL
  //     .build();

  //   connectionRef.current.on("UserJoined", (userId: string, totalParticipants: number) => {
  //     setParticipants((prev) => [...prev, userId]);
  //   });

  //   connectionRef.current.on("UserLeft", (userId: string, totalParticipants: number) => {
  //     setParticipants((prev) => prev.filter(id => id !== userId));
  //   });

  //   connectionRef.current.on("ReceiveOffer", (offer: string, fromConnectionId: string) => {
  //     handleOffer(offer, fromConnectionId);
  //   });

  //   connectionRef.current.on("ReceiveAnswer", (answer: string, toConnectionId: string) => {
  //     handleAnswer(answer, toConnectionId);
  //   });

  //   connectionRef.current.on("ReceiveCandidate", (candidate: string, toConnectionId: string) => {
  //     handleCandidate(candidate, toConnectionId);
  //   });

  //   connectionRef.current.start()
  //     .then(() => {
  //       console.log("SignalR connected");
  //       connectionRef.current.send("JoinCall", userId); // Notify server that user has joined
  //     })
  //     .catch((err: any) => console.error("SignalR connection error:", err));
  // };

  // // Handle incoming offer and create peer connection
  // const handleOffer = async (offer: string, fromConnectionId: string) => {
  //   const peerConnection = createPeerConnection(fromConnectionId);
  //   await peerConnection.setRemoteDescription(new RTCSessionDescription(JSON.parse(offer)));

  //   // Create an answer and send it back
  //   const answer = await peerConnection.createAnswer();
  //   await peerConnection.setLocalDescription(answer);
  //   connectionRef.current.send("SendAnswer", fromConnectionId, JSON.stringify(answer));
  // };

  // // Handle incoming answer
  // const handleAnswer = (answer: string, toConnectionId: string) => {
  //   const peerConnection = peerConnectionsRef.current.get(toConnectionId);
  //   if (peerConnection) {
  //     peerConnection.setRemoteDescription(new RTCSessionDescription(JSON.parse(answer)));
  //   }
  // };

  // // Handle ICE candidate
  // const handleCandidate = (candidate: string, toConnectionId: string) => {
  //   const peerConnection = peerConnectionsRef.current.get(toConnectionId);
  //   if (peerConnection) {
  //     peerConnection.addIceCandidate(new RTCIceCandidate(JSON.parse(candidate)));
  //   }
  // };

  // // Set up peer connection for new participant
  // const createPeerConnection = (connectionId: string) => {
  //   const peerConnection = new RTCPeerConnection();

  //   // Add local stream to peer connection
  //   localStream?.getTracks().forEach((track) => {
  //     peerConnection.addTrack(track, localStream);
  //   });

  //   // Handle incoming track (remote user's video)
  //   peerConnection.ontrack = (event) => {
  //     if (remoteVideoRefs.current.has(connectionId)) {
  //       const remoteVideo = remoteVideoRefs.current.get(connectionId);
  //       if (remoteVideo) {
  //         remoteVideo.srcObject = event.streams[0];
  //       }
  //     }
  //   };

  //   // Handle ICE candidates
  //   peerConnection.onicecandidate = (event) => {
  //     if (event.candidate) {
  //       connectionRef.current.send("SendCandidate", connectionId, JSON.stringify(event.candidate));
  //     }
  //   };

  //   peerConnectionsRef.current.set(connectionId, peerConnection);
  //   return peerConnection;
  // };

  // // Start a call with all participants
  // const startCall = async () => {
  //   if (userId) {
  //     setIsCalling(true);
  //     participants.forEach(async (peerId) => {
  //       const peerConnection = createPeerConnection(peerId);
  //       const offer = await peerConnection.createOffer();
  //       await peerConnection.setLocalDescription(offer);
  //       connectionRef.current.send("SendOffer", peerId, JSON.stringify(offer));
  //     });
  //   }
  // };

  // // End the call
  // const endCall = () => {
  //   peerConnectionsRef.current.forEach((peerConnection) => {
  //     peerConnection.close();
  //   });
  //   setIsCalling(false);
  //   setParticipants([]);
  //   setLocalStream(null);
  // };

  // useEffect(() => {
  //   getLocalStream();
  //   initializeSignalR();

  //   return () => {
  //     if (connectionRef.current) {
  //       connectionRef.current.stop();
  //     }
  //     // Close all peer connections when component unmounts
  //     peerConnectionsRef.current.forEach((peerConnection) => peerConnection.close());
  //   };
  // }, []);

  // return (
  //   <div>
  //     <h2>Multi-Participant Video Call</h2>
  //     <div className="video-container" style={{ display: 'flex', flexWrap: 'wrap' }}>
  //       {/* Local Video */}
  //       <video ref={localVideoRef} autoPlay muted width="200" />
        
  //       {/* Remote Videos */}
  //       {participants.map((peerId) => (
  //         <video
  //           key={peerId}
  //           ref={(el) => remoteVideoRefs.current.set(peerId, el!)}
  //           autoPlay
  //           width="200"
  //           style={{ margin: '10px' }}
  //         />
  //       ))}
  //     </div>

  //     <div>
  //       {!isCalling ? (
  //         <button onClick={startCall}>Start Call</button>
  //       ) : (
  //         <button onClick={endCall}>End Call</button>
  //       )}
  //     </div>
  //   </div>
  // );
// }

// export default App

//Video Call
// const apiKey = 'mmhfdzb5evj2';
// const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3Byb250by5nZXRzdHJlYW0uaW8iLCJzdWIiOiJ1c2VyL0RhcnRoX01hdWwiLCJ1c2VyX2lkIjoiRGFydGhfTWF1bCIsInZhbGlkaXR5X2luX3NlY29uZHMiOjYwNDgwMCwiaWF0IjoxNzMyMTE1NDgyLCJleHAiOjE3MzI3MjAyODJ9.pyoqrsgoN67yZdCKeBGL9-m-u6Trgg85eQcuwUpzWUE';
// const userId = 'Darth_Maul';
// const callId = 'HrdUKYq6O6pw';

// // set up the user object
// const user: User = {
//   id: userId,
//   name: 'Oliver',
//   image: 'https://getstream.io/random_svg/?id=oliver&name=Oliver',
// };

// const client = new StreamVideoClient({ apiKey, user, token });
// const call = client.call('default', callId);
// call.join({ create: true });

// export const MyUILayout = () => {
//   const { useCallCallingState } = useCallStateHooks();
//   const callingState = useCallCallingState();

//   if (callingState !== CallingState.JOINED) {
//     return <div>Loading...</div>;
//   }

//   return (
//       <StreamTheme style={{ position:'relative' }}>
//         <SpeakerLayout participantsBarPosition="bottom" />
//         <CallControls />
//       </StreamTheme>
//   );
// };

// export default function App() {
//   return (
//     <StreamVideo client={client}>
//       <StreamCall call={call}>
//         <MyUILayout />
//       </StreamCall>
//     </StreamVideo>
//   );
// }

// export const MyParticipantList = (props: { participants: StreamVideoParticipant[] }) => {
//   const { participants } = props;
//   return (
//     <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', width:'100vw' }}>
//       {participants.map((participant) => (
//         <div style={{ width:'100%', aspectRatio:'3 / 2' }}>
//           <ParticipantView participant={participant} key={participant.sessionId} />
//         </div>
        
//       ))}
//     </div>
//   );
// };

// export const MyFloatingLocalParticipant = (props: { participant?: StreamVideoParticipant }) => {
//   const { participant } = props;
//   return (
//     <div
//       style={{
//         position: 'absolute',
//         top: '15px',
//         left: '15px',
//         width: '240px',
//         height: '135px',
//         boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 10px 3px',
//         borderRadius: '12px',
//       }}
//     >
//       {participant && <ParticipantView muteAudio participant={participant} />}
      
//     </div>
//   );
// };

const apiKey = 'mmhfdzb5evj2';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3Byb250by5nZXRzdHJlYW0uaW8iLCJzdWIiOiJ1c2VyL0RhcnRoX01hdWwiLCJ1c2VyX2lkIjoiRGFydGhfTWF1bCIsInZhbGlkaXR5X2luX3NlY29uZHMiOjYwNDgwMCwiaWF0IjoxNzMyMTE1NDgyLCJleHAiOjE3MzI3MjAyODJ9.pyoqrsgoN67yZdCKeBGL9-m-u6Trgg85eQcuwUpzWUE';
const userId = 'Darth_Maul';
const callId = '1231';

const user: User = {
  id: userId,
  name: 'Oliver',
  image: 'https://getstream.io/random_svg/?id=oliver&name=Oliver',
};

const client = new StreamVideoClient({ apiKey, user, token });
const call = client.call('default', callId);
call.join({ create: true });

export default function App() {
  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <MyUILayout />
      </StreamCall>
    </StreamVideo>
  );
}

export const MyUILayout = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  if (callingState !== CallingState.JOINED) {
    return <div>Loading...</div>;
  }

  return (
    <StreamTheme>
      <SpeakerLayout participantsBarPosition='bottom' />
      <CallControls />
    </StreamTheme>
  );
};
import '../CSS/Home.css'
import names from '../General/Component';
import { Avatar, Box, Button, List, ListItem, Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useLocation } from 'react-router-dom';
import BottomMenuBar from '../General/BottomMenuBar';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import ChatBox from './ChatBox';
import { HubConnectionBuilder } from '@microsoft/signalr';
import SendMessageForm from './SendMessageForm';

interface UserInformation {
  currentUserID: number;
  theme: string;
  themeID: number;
  chatID: number;
}

interface ThemeDetail {
  themeID: number;
  name: string;
  source: string;
}

interface ProfileDetail {
  profileID: number;
  name: string;
  photo: string;
  bio: string;
  onlineStatus: string;
  userID: number;
  themeID: number;
}

interface Message {
  user: string;
  text: string;
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

const Home = () => {
  //Catch The Data
  const location = useLocation();
  const state = location.state as UserInformation;
  const currentUserID = state.currentUserID;
  const theme = state.theme;
  const themeID = state.themeID;
  const chatID = state?.chatID;
  const userInformationList = { currentUserID, theme, themeID };
  const [userProfileData, setUserProfileData] = useState<any>([]);
  const [userChatListData, setUserChatListData] = useState<any>([]);
  const [selectedChatData, setSelectedChatData] = useState<any>([]);
  const [friendThemeDetail, setFriendThemeDetail] = useState<Map<number, ThemeDetail>>(new Map());
  const [friendProfileDetail, setFriendProfileDetail] = useState<Map<number, ProfileDetail>>(new Map());
  const [value, setValue] = useState(0);
  const [friendValue, setFriendValue] = useState(0);
  const [connection, setConnection] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [chatUserName, setChatUserName] = useState<any>();
  const [chatRoom, setChatRoom] = useState<any>("0");
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const [ownMessage, setOwnMessage] = useState<any>([]);
  const [friendMessage, setFriendMessage] = useState<any>([]);
  const [sender, setSender] = useState<any>();
  const [receiver, setReceiver] = useState<any>();
  const [senderName, setSenderName] = useState<any>();
  const [receiverName, setReceiverName] = useState<any>();
  const messagesEndRef = useRef<any>(null);
  const now = new Date();

  // Catch Data From DB
  function getUserData() {
    axios.get(names.getProfileByUserID + currentUserID).then((response) => {
      setUserProfileData(response.data);
      setChatUserName(response.data.name);
    });

    axios.get(names.getChatByUserID + currentUserID).then((response) => {
      setUserChatListData(response.data);
    });

    axios.get(names.getChatByID + chatID).then((response) => {
      setSelectedChatData(response.data);
    });
  }

  // Catch Friend Detail Information From Database
  function catchFriendDetail() {
    userChatListData.forEach((chat: any) => {
      let chatID: number = chat.chatID;
      axios.get(names.getProfileByUserName + chat.name).then((response) => {
        if (response.status === 200) {
          setFriendProfileDetail(prev => new Map(prev).set(chatID, response.data));

          axios.get(names.getThemeByID + response.data.themeID).then((response) => {
            setFriendThemeDetail(prev => new Map(prev).set(chatID, response.data));
          })
        }
      })
    });
  }

  // Catch The Specific Friend Online Status
  function checkOnlineStatus(onlineStatus: any) {
    if (onlineStatus === "Offline") {
      return 'gray'
    } else {
      return 'green'
    }
  }

  // Return The Specific Header Menu Option Information
  function CustomTabPanel(props: any) {
    const { children, value, index, ...other } = props;

    return (
      <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
        {value !== 0 && value === index && <Box sx={{ marginTop: '3%' }}>{children}</Box>}
        {value === 0 && <Box sx={{ marginTop: '3%', textAlign: 'center' }}>
          <Typography variant="h4"><strong>Welcome To FriendZone Collaboration System</strong></Typography>
        </Box>}
      </div>
    );
  }

  function CustomTabPanel2(props: any) {
    const { children, value, index, ...other } = props;

    return (
      <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
        {value !== 0 && value === index && <Box sx={{ marginTop: '3%' }}>{children}</Box>}
        {value === 0 && <Box sx={{ marginTop: '3%', textAlign: 'center' }}></Box>}
      </div>
    );
  }

  // Catch The Specific Friend
  function handleChat(chat: any) {
    setSelectedChatData(chat);
    setValue(chat.chatID);

    axios.get(names.getChatByID + chat.chatID).then((response) => {
      let adminID: number = parseInt(response.data.admin);
      axios.get(names.getChatByUserID + adminID).then((response) => {
        (response.data).forEach((element: any) => {
          if (element.admin === chat.admin && element.member === chat.member && element.chatRole === chat.chatRole) {
            let chatID = element.chatID.toString();
            changeRoom(chatID);
          }
        });
      })
    })

    axios.get(names.getProfileByUserName + chat.name).then((response) => {
      axios.get(names.getChatByUserID + response.data.userID).then((response) => {
        (response.data).forEach((element: any) => {
          if (element.name === userProfileData.name) {
            setFriendValue(element.chatID);
          }
        });
      })
    })
  }

  //Connect To The SignalR
  useEffect(() => {
    const connectSignalR = async () => {
      const connection = new HubConnectionBuilder()
        .withUrl('http://localhost:7121/chat')
        .build();

      connection.on('ReceiveMessage', (user: string, message: string) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { user, text: message },
        ]);
      });

      try {
        await connection.start();
        setConnection(connection);
        setIsJoined(true);
      } catch (err) {
        console.error('Error while establishing connection: ', err);
      }
    };

    connectSignalR();

    // Cleanup the connection on unmount
    return () => {
      if (connection) {
        connection.off('ReceiveMessage');
        connection.stop();
      }
    };
  }, [chatRoom]);

  // Send a new message to the selected room
  const sendMessage = async (message: any) => {
    if (connection && message.trim()) {
      try {
        await connection.invoke('SendMessageToRoom', chatRoom, chatUserName, message);
        setNewMessage('');
      } catch (err) {
        console.error('Error sending message: ', err);
      }
    }
  };

  // Change the room and rejoin
  const changeRoom = async (newRoom: string) => {
    if (connection) {
      // Leave the current room
      await connection.invoke('LeaveRoom', chatRoom);
      // Join the new room
      setChatRoom(newRoom);
      setMessages([]);
      await connection.invoke('JoinRoom', newRoom);
      setIsJoined(true);
    }
  };

  function getMessageData() {
    console.log(friendValue);
    console.log(value);

    axios.get(names.getMessageByChatID + value).then((response) => {
      setOwnMessage(response.data);
    })

    axios.get(names.getMessageByChatID + friendValue).then((response) => {
      setFriendMessage(response.data);
    })

    axios.get(names.getChatByID + value).then((response) => {
      setSender(response.data.userID);
      axios.get(names.getProfileByUserID + response.data.userID).then((response) => {
        setSenderName(response.data.name);
      })
    })

    axios.get(names.getChatByID + friendValue).then((response) => {
      setReceiver(response.data.userID);
      axios.get(names.getProfileByUserID + response.data.userID).then((response) => {
        setReceiverName(response.data.name);
      })
    })
  }


  const currentDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

  //Combine Two Data Set Into One Data Set
  const combineMessageList: MessageList[] = [...ownMessage, ...friendMessage];

  const toDateTime = (date: string, time: string): Date => {
    return new Date(`${date}T${time}Z`);
  };

  // Sort the combined data by dateTime (ascending)
  const sortedData = combineMessageList.sort((a, b) => {
    const dateTimeA = toDateTime(a.date, a.time);
    const dateTimeB = toDateTime(b.date, b.time);
    return dateTimeA.getTime() - dateTimeB.getTime();
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sortedData]);

  useEffect(() => {
    getMessageData()
  }, [friendValue]);

  useEffect(() => {
    getUserData()

    // Update the CSS variable dynamically
    document.documentElement.style.setProperty('--backgroundImage', `url('${state.theme}')`);
  }, []);

  useEffect(() => {
    catchFriendDetail();
  }, [userChatListData]);

  return <div>
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '97vh' }}>

      <Paper elevation={3} sx={{ padding: 3, width: 1100, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: names.BoxRadius, backgroundColor: names.BoxBackgroundColor }}>

        <Grid container spacing={1}>
          <Grid size={4}>
            <Paper sx={{ width: 400, maxHeight: '420px', overflowY: 'auto', padding: 2, backgroundColor: 'transparent', boxShadow: 'none', '&::-webkit-scrollbar': { width: '8px' }, '&::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1', borderRadius: '10px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: '10px', '&:hover': { backgroundColor: '#555' } } }}>

              {/* Display The User Selected Chat Room */}
              <List>
                {userChatListData.map((chat: any) => {
                  if (chat.status === "Pin" && chat.chatID === selectedChatData.chatID) {
                    return <div>
                      <ListItem key={chat.chatID} onClick={() => handleChat(chat)}>
                        <Paper sx={{ padding: 2, width: 1000, color: 'black', borderRadius: '40px', maxHeight: '40px', backgroundColor: 'rgba(105, 105, 105, 0.5)' }}>
                          <Grid container spacing={1} alignItems="center">
                            <Grid size={2} >
                              <Avatar alt={friendProfileDetail.get(chat.chatID)?.name} src={friendProfileDetail.get(chat.chatID)?.photo} sx={{ width: 35, height: 35, alignItems: 'center', border: '3px solid', borderColor: checkOnlineStatus(friendProfileDetail.get(chat.chatID)?.onlineStatus) }} />
                            </Grid>
                            <Grid size={3}>
                              <Typography variant="h4" sx={{ fontSize: '30px' }}><strong>{chat.name}</strong></Typography>
                            </Grid>
                            <Grid size={1}>
                            </Grid>
                            <Grid size={4}>
                              <Typography variant="h4" sx={{ fontSize: '15px', marginBottom: '5%' }}><strong>Messages</strong></Typography>
                              <Typography variant="h4" sx={{ fontSize: '10px' }}><strong>{chat.lastDateTime}</strong></Typography>
                            </Grid>
                            <Grid size={2}>
                              <Button>Hi</Button>
                            </Grid>
                          </Grid>
                        </Paper>
                      </ListItem>
                    </div>
                  }
                })}
              </List>

              {/* Display The User Pinned Chat Room */}
              <List>
                {userChatListData.map((chat: any) => {
                  if (chat.status === "Pin" && chat.chatID !== selectedChatData.chatID) {
                    return <div>
                      <ListItem key={chat.chatID} onClick={() => handleChat(chat)}>
                        <Paper sx={{ padding: 2, width: 1000, color: 'black', borderRadius: '40px', maxHeight: '40px' }}>
                          <Grid container spacing={1} alignItems="center">
                            <Grid size={2} >
                              <Avatar alt={friendProfileDetail.get(chat.chatID)?.name} src={friendProfileDetail.get(chat.chatID)?.photo} sx={{ width: 35, height: 35, alignItems: 'center', border: '3px solid', borderColor: checkOnlineStatus(friendProfileDetail.get(chat.chatID)?.onlineStatus) }} />
                            </Grid>
                            <Grid size={3}>
                              <Typography variant="h4" sx={{ fontSize: '30px' }}><strong>{chat.name}</strong></Typography>
                            </Grid>
                            <Grid size={1}>
                            </Grid>
                            <Grid size={4}>
                              <Typography variant="h4" sx={{ fontSize: '15px', marginBottom: '5%' }}><strong>Messages</strong></Typography>
                              <Typography variant="h4" sx={{ fontSize: '10px' }}><strong>{chat.lastDateTime}</strong></Typography>
                            </Grid>
                            <Grid size={2}>
                              <Button>Hi</Button>
                            </Grid>
                          </Grid>
                        </Paper>
                      </ListItem>
                    </div>
                  }
                })}
              </List>

              {/* Display The User Selected Chat Room */}
              <List>
                {userChatListData.map((chat: any) => {
                  if (chat.status !== "Pin" && chat.chatID === selectedChatData.chatID) {
                    return <div>
                      <ListItem key={chat.chatID} onClick={() => handleChat(chat)}>
                        <Paper sx={{ padding: 2, width: 1000, color: 'black', borderRadius: '40px', maxHeight: '40px', backgroundColor: 'rgba(105, 105, 105, 0.5)' }}>
                          <Grid container spacing={1} alignItems="center">
                            <Grid size={2} >
                              <Avatar alt={friendProfileDetail.get(chat.chatID)?.name} src={friendProfileDetail.get(chat.chatID)?.photo} sx={{ width: 35, height: 35, alignItems: 'center', border: '3px solid', borderColor: checkOnlineStatus(friendProfileDetail.get(chat.chatID)?.onlineStatus) }} />
                            </Grid>
                            <Grid size={3}>
                              <Typography variant="h4" sx={{ fontSize: '30px' }}><strong>{chat.name}</strong></Typography>
                            </Grid>
                            <Grid size={1}>
                            </Grid>
                            <Grid size={4}>
                              <Typography variant="h4" sx={{ fontSize: '15px', marginBottom: '5%' }}><strong>Messages</strong></Typography>
                              <Typography variant="h4" sx={{ fontSize: '10px' }}><strong>{chat.lastDateTime}</strong></Typography>
                            </Grid>
                            <Grid size={2}>
                              <Button>Hi</Button>
                            </Grid>
                          </Grid>
                        </Paper>
                      </ListItem>
                    </div>
                  }
                })}
              </List>

              {/* Display The User Reminding Chat Room */}
              <List>
                {userChatListData.map((chat: any) => {
                  if (chat.status !== "Pin" && chat.chatID !== selectedChatData.chatID) {
                    return <div>
                      <ListItem key={chat.chatID} onClick={() => handleChat(chat)}>
                        <Paper sx={{ padding: 2, width: 1000, color: 'black', borderRadius: '40px', maxHeight: '40px' }}>
                          <Grid container spacing={1} alignItems="center">
                            <Grid size={2} >
                              <Avatar alt={friendProfileDetail.get(chat.chatID)?.name} src={friendProfileDetail.get(chat.chatID)?.photo} sx={{ width: 35, height: 35, alignItems: 'center', border: '3px solid', borderColor: checkOnlineStatus(friendProfileDetail.get(chat.chatID)?.onlineStatus) }} />
                            </Grid>
                            <Grid size={3}>
                              <Typography variant="h4" sx={{ fontSize: '30px' }}><strong>{chat.name}</strong></Typography>
                            </Grid>
                            <Grid size={1}>
                            </Grid>
                            <Grid size={4}>
                              <Typography variant="h4" sx={{ fontSize: '15px', marginBottom: '5%' }}><strong>Messages</strong></Typography>
                              <Typography variant="h4" sx={{ fontSize: '10px' }}><strong>{chat.lastDateTime}</strong></Typography>
                            </Grid>
                            <Grid size={2}>
                              <Button>Hi</Button>
                            </Grid>
                          </Grid>
                        </Paper>
                      </ListItem>
                    </div>
                  }
                })}
              </List>
            </Paper>
          </Grid>

          <Grid size={8}>
            <Paper sx={{ width: 620, marginLeft: "8%", maxHeight: '420px', padding: 2, backgroundColor: 'transparent', border: "1px solid gray", boxShadow: 'none', '&::-webkit-scrollbar': { width: '8px' }, '&::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1', borderRadius: '10px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: '10px', '&:hover': { backgroundColor: '#555' } } }}>

              <CustomTabPanel value={value} index={value}>
                {/* <ChatBox ownerChatID={value} friendChatID={friendValue} currentUserID={currentUserID} selectedChatData={selectedChatData} chatRoom={chatRoom} chatUserName={chatUserName} messages={messages} isRefresh={isRefresh} /> */}
                <Paper sx={{ width: 600, marginBottom: '-2%', marginLeft: '-2%', marginTop: '-5%', height: '380px', overflowY: 'auto', padding: 2, backgroundColor: 'transparent', boxShadow: 'none', '&::-webkit-scrollbar': { width: '8px' }, '&::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1', borderRadius: '10px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: '10px', '&:hover': { backgroundColor: '#555' } } }}>
                  {sortedData.map((m: any) => {
                    if (m.senderID === currentUserID) {
                      return <div key={m.messageID}>
                        <Typography variant="subtitle1" gutterBottom sx={{ color: "black", textAlign: "right" }}>
                          <b>{senderName}</b>
                        </Typography>
                        <Paper sx={{
                          maxWidth: 300, padding: 1, backgroundColor: 'white', boxShadow: 'none', marginLeft: '47%', marginBottom: '3%',
                          '&::-webkit-scrollbar': { width: '8px' }, '&::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1', borderRadius: '10px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: '10px', '&:hover': { backgroundColor: '#555' } }
                        }}>
                          <Typography variant="body1" gutterBottom sx={{ color: "black", textAlign: "right", marginLeft: 2, maxWidth: 300 }}>
                            {m.message}
                          </Typography>
                          <Typography variant="body1" gutterBottom sx={{ color: "black", textAlign: "left", marginLeft: 2, maxWidth: 300, fontSize: '10px' }}>
                            <i>{m.date}_{m.time}</i>
                          </Typography>
                        </Paper>
                      </div>

                    } else if (m.senderID !== currentUserID) {
                      return <div key={m.messageID}>
                        <Typography variant="subtitle1" gutterBottom sx={{ color: "black" }}>
                          <b>{receiverName}</b>
                        </Typography>
                        <Paper sx={{
                          maxWidth: 300, padding: 1, backgroundColor: 'white', boxShadow: 'none', marginBottom: '3%',
                          '&::-webkit-scrollbar': { width: '8px' }, '&::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1', borderRadius: '10px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: '10px', '&:hover': { backgroundColor: '#555' } }
                        }}>
                          <Typography variant="body1" gutterBottom sx={{ color: "black", textAlign: "left", marginLeft: 2, maxWidth: 300 }}>
                            {m.message}
                          </Typography>
                          <Typography variant="body1" gutterBottom sx={{ color: "black", textAlign: "right", marginLeft: 2, maxWidth: 300, fontSize: '10px' }}>
                            <i>{m.date}_{m.time}</i>
                          </Typography>
                        </Paper>
                      </div>
                    }
                  }
                  )}
                  <ChatBox ownerChatID={value} friendChatID={friendValue} currentUserID={currentUserID} selectedChatData={selectedChatData} chatRoom={chatRoom} chatUserName={chatUserName} messages={messages}/>
                </Paper>
              </CustomTabPanel>
            </Paper>
          </Grid>

          <Grid size={5}>
          </Grid>

          <Grid size={7}>
            <CustomTabPanel2 value={value} index={value}>
              {parseInt(selectedChatData.admin) === currentUserID ? (<Button>Admin</Button>) : (<p>Not Admin</p>)}
              <SendMessageForm sendMessage={sendMessage} ownerChatID={value} friendChatID={friendValue} currentUserID={currentUserID} selectedChatData={selectedChatData} />
            </CustomTabPanel2>

          </Grid>

          <Grid size={12} sx={{ marginBottom: '-1.5%' }}>
            {BottomMenuBar(userInformationList, "home", userProfileData.photo, userProfileData.name)}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  </div>
}

export default Home
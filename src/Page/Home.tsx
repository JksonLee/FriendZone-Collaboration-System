import '../CSS/Home.css'
import names from '../General/Component';
import { Avatar, Box, Button, List, ListItem, Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useLocation } from 'react-router-dom';
import BottomMenuBar from '../General/BottomMenuBar';
import axios from 'axios';
import { useEffect, useState } from 'react';
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

  // Catch The Specific Friend Online Status
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
                <ChatBox ownerChatID={value} friendChatID={friendValue} currentUserID={currentUserID} selectedChatData={selectedChatData} chatRoom={chatRoom} chatUserName={chatUserName} messages={messages} />
              </CustomTabPanel>
            </Paper>
          </Grid>

          <Grid size={5}>
          </Grid>

          <Grid size={7}>
            <CustomTabPanel2 value={value} index={value}>
              {parseInt(selectedChatData.admin) === currentUserID ? (<Button>Admin</Button>) : (<p>Not Admin</p>)}
              <SendMessageForm sendMessage={sendMessage} ownerChatID={value} friendChatID={friendValue} currentUserID={currentUserID} selectedChatData={selectedChatData}/>
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
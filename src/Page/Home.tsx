import '../CSS/Home.css'
import names from '../General/Component';
import { Avatar, BottomNavigationAction, Box, List, ListItem, Modal, Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useLocation, useNavigate } from 'react-router-dom';
import BottomMenuBar from '../General/BottomMenuBar';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import ChatBox from './ChatBox';
import { HubConnectionBuilder } from '@microsoft/signalr';
import SendMessageForm from './SendMessageForm';
import VideocamIcon from '@mui/icons-material/Videocam';
import { refreshPage } from '../General/Functions';
import SettingsIcon from '@mui/icons-material/Settings';
import AddIcon from '@mui/icons-material/Add';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import EditChat from './EditChat';
import AddNewChat from './AddNewChat';

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
  const [friendListDetail, setFriendListDetail] = useState<Map<number, ProfileDetail>>(new Map());
  const [value, setValue] = useState(0);
  const [friendValue, setFriendValue] = useState<any>();
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
  const [replyOption, setReplyOption] = useState<any>('');
  const [chatAssistantList, setChatAssistantList] = useState<any>([]);
  const [openDelete, setOpenDelete] = useState(false);
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);
  const [openEdit, setOpenEdit] = useState(false);
  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => setOpenEdit(false);
  const messagesEndRef = useRef<any>(null);
  const now = new Date();
  const navigate = useNavigate();

  //Background Modal Design
  const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    borderRadius: '20px',
    boxShadow: 24,
    p: 4,
    maxHeight: '370px',
  };

  // Catch Data From DB
  function getUserData() {
    axios.get(names.getProfileByUserID + currentUserID).then((response) => {
      setUserProfileData(response.data);
      setChatUserName(response.data.name);
    });

    axios.get(names.getChatByUserID + currentUserID).then((response) => {
      setUserChatListData([...response.data].sort((a, b) => a.name.localeCompare(b.name)));
    });

    axios.get(names.getChatByID + chatID).then((response) => {
      setSelectedChatData(response.data);
    });

    axios.get(names.basicChatAssistantAPI).then((response) => {
      setChatAssistantList(response.data);
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

  // Return The Send Message Bar
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

    if (chat.chatRole === "Individual") {
      axios.get(names.getProfileByUserName + chat.name).then((response) => {
        axios.get(names.getChatByUserID + response.data.userID).then((response) => {
          (response.data).forEach((element: any) => {
            if (element.name === userProfileData.name) {
              setFriendValue(element.chatID);
            }
          });
        })
      })
    } else if (chat.chatRole === "Group") {
      axios.get(names.getChatByID + chat.chatID).then((response) => {
        setFriendValue(response.data.member);
      })
    }
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
      if (message !== "Video Call Request") {
        const currentDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;

        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;


        if (selectedChatData.chatRole === "Individual") {
          const messageInformation = { senderID: sender, receiverID: receiver, message: message, date: currentDate, time: currentTime, chatID: value };

          axios.post(names.basicMessageAPI, messageInformation);

          axios.get(names.getProfileByUserName + selectedChatData.name).then((response) => {
            axios.get(names.getChatByUserID + response.data.userID).then((response) => {
              (response.data).forEach((element: any) => {
                if (element.chatRole === "Individual" && element.admin.toString() === selectedChatData.admin && element.member.toString() === selectedChatData.member) {
                  const latestDateTime = `${currentDate}`

                  const chatUpdate = { chatID: selectedChatData.chatID, name: selectedChatData.name, chatRole: selectedChatData.chatRole, admin: selectedChatData.admin, member: selectedChatData.member, lastDateTime: latestDateTime, status: selectedChatData.status, userID: selectedChatData.userID }

                  axios.put(names.basicChatAPI, chatUpdate);

                  const chatUpdate2 = { chatID: element.chatID, name: element.name, chatRole: element.chatRole, admin: element.admin, member: element.member, lastDateTime: latestDateTime, status: element.status, userID: element.userID }

                  axios.put(names.basicChatAPI, chatUpdate2);
                }

              });
            })
          })
        } else if (selectedChatData.chatRole === "Group") {
          (friendValue.split(', ')).forEach((element: any) => {
            if (element === currentUserID) {
              const messageInformation = { senderID: sender, receiverID: parseInt(selectedChatData.admin), message: message, date: currentDate, time: currentTime, chatID: value };

              axios.post(names.basicMessageAPI, messageInformation);

              axios.get(names.getChatByUserID + parseInt(selectedChatData.admin)).then((response) => {
                (response.data).forEach((element: any) => {
                  if (element.chatRole === "Group" && element.admin === selectedChatData.admin && element.member === friendValue) {
                    const latestDateTime = `${currentDate}`

                    const chatUpdate = { chatID: selectedChatData.chatID, name: selectedChatData.name, chatRole: selectedChatData.chatRole, admin: selectedChatData.admin, member: selectedChatData.member, lastDateTime: latestDateTime, status: selectedChatData.status, userID: selectedChatData.userID }

                    axios.put(names.basicChatAPI, chatUpdate);

                    const chatUpdate2 = { chatID: element.chatID, name: element.name, chatRole: element.chatRole, admin: element.admin, member: element.member, lastDateTime: latestDateTime, status: element.status, userID: element.userID }

                    axios.put(names.basicChatAPI, chatUpdate2);
                  }
                })
              })
            } else if (element !== currentUserID) {
              const friendValueInInt = parseInt(element);
              axios.get(names.getProfileByID + friendValueInInt).then((response) => {
                const friendUserID = response.data.userID;
                const messageInformation = { senderID: sender, receiverID: friendUserID, message: message, date: currentDate, time: currentTime, chatID: value };

                axios.post(names.basicMessageAPI, messageInformation);

                axios.get(names.getChatByUserID + friendUserID).then((response) => {
                  (response.data).forEach((element: any) => {
                    if (element.chatRole === "Group" && element.admin === selectedChatData.admin && element.member === friendValue) {
                      const latestDateTime = `${currentDate}`

                      const chatUpdate = { chatID: selectedChatData.chatID, name: selectedChatData.name, chatRole: selectedChatData.chatRole, admin: selectedChatData.admin, member: selectedChatData.member, lastDateTime: latestDateTime, status: selectedChatData.status, userID: selectedChatData.userID }

                      axios.put(names.basicChatAPI, chatUpdate);

                      const chatUpdate2 = { chatID: element.chatID, name: element.name, chatRole: element.chatRole, admin: element.admin, member: element.member, lastDateTime: latestDateTime, status: element.status, userID: element.userID }

                      axios.put(names.basicChatAPI, chatUpdate2);
                    }
                  })
                })
              })
            }
          })
        }
        try {
          await connection.invoke('SendMessageToRoom', chatRoom, chatUserName, message);
          setNewMessage('');
          setReplyOption('');
        } catch (err) {
          console.error('Error sending message: ', err);
        }
      } else {
        try {
          await connection.invoke('SendMessageToRoom', chatRoom, chatUserName, message);
          setNewMessage('');
          setReplyOption('');
        } catch (err) {
          console.error('Error sending message: ', err);
        }
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
    if (typeof friendValue === 'number') {
      axios.get(names.getMessageByChatID + value).then((response) => {
        setOwnMessage(response.data);
      })
    } else if (typeof friendValue === 'string') {
      const newMessagesCombineOwn: MessageList[] = [];
      axios.get(names.getMessageByChatID + value).then((response) => {
        let previousMessage = "";
        (response.data).forEach((element: any) => {
          const currentMessage = element.message;
          if (previousMessage !== currentMessage) {
            newMessagesCombineOwn.push(element)
          }
          previousMessage = currentMessage
        });
        setOwnMessage(newMessagesCombineOwn);
      })
    }


    if (typeof friendValue === 'number') {
      axios.get(names.getMessageByChatID + friendValue).then((response) => {
        setFriendMessage(response.data);
      })
    } else if (typeof friendValue === 'string') {
      const newMessagesCombine: MessageList[] = [];

      (friendValue.split(', ')).forEach((element: any) => {
        if (parseInt(element) !== currentUserID) {
          axios.get(names.getProfileByUserID + parseInt(element)).then((response) => {
            axios.get(names.getChatByUserID + response.data.userID).then((response) => {
              (response.data).forEach((element: any) => {
                if (element.admin === selectedChatData.admin && element.member === selectedChatData.member && element.chatRole === "Group") {
                  axios.get(names.getMessageByChatID + element.chatID).then((response) => {
                    let previousMessage = "";
                    (response.data).forEach((element: any) => {
                      const currentMessage = element.message;
                      if (previousMessage !== currentMessage) {
                        newMessagesCombine.push(element)
                      }
                      previousMessage = currentMessage
                    });
                  })
                }
              });
            })
          })
        } else if (parseInt(element) === currentUserID) {
          axios.get(names.getChatByUserID + parseInt(selectedChatData.admin)).then((response) => {
            (response.data).forEach((element: any) => {
              if (element.admin === selectedChatData.admin && element.member === selectedChatData.member && element.chatRole === "Group") {
                axios.get(names.getMessageByChatID + element.chatID).then((response) => {
                  let previousMessage = "";
                  (response.data).forEach((element: any) => {
                    const currentMessage = element.message;
                    if (previousMessage !== currentMessage) {
                      newMessagesCombine.push(element)
                    }
                    previousMessage = currentMessage
                  });
                })
              }
            });
          })
        }
      });
      setFriendMessage(newMessagesCombine);
    }


    axios.get(names.getChatByID + value).then((response) => {
      setSender(response.data.userID);
      axios.get(names.getProfileByUserID + response.data.userID).then((response) => {
        setSenderName(response.data.name);
      })
    })

    if (typeof friendValue === 'number') {
      axios.get(names.getChatByID + friendValue).then((response) => {
        setReceiver(response.data.userID);
        axios.get(names.getProfileByUserID + response.data.userID).then((response) => {
          setReceiverName(response.data.name);
        })
      })
    } else if (typeof friendValue === 'string') {
      (friendValue.split(', ')).forEach((element: any) => {
        if (parseInt(element) !== currentUserID) {
          axios.get(names.getProfileByID + parseInt(element)).then((response) => {
            setFriendListDetail(prev => new Map(prev).set(parseInt(element), response.data));
          })
        } else if (parseInt(element) === currentUserID) {
          axios.get(names.getProfileByUserID + parseInt(selectedChatData.admin)).then((response) => {
            setFriendListDetail(prev => new Map(prev).set(parseInt(selectedChatData.admin), response.data));
          })
        }
      });
    }
  }

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

  function handleVideoCall() {
    sendMessage("Video Call Request");

    const userInformation = { chatID: chatRoom, userName: userProfileData.name, currentUserID: state.currentUserID, theme: state.theme, themeID: state.themeID, token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3Byb250by5nZXRzdHJlYW0uaW8iLCJzdWIiOiJ1c2VyL0RhcnRoX01hdWwiLCJ1c2VyX2lkIjoiRGFydGhfTWF1bCIsInZhbGlkaXR5X2luX3NlY29uZHMiOjYwNDgwMCwiaWF0IjoxNzMyMTE1NDgyLCJleHAiOjE3MzI3MjAyODJ9.pyoqrsgoN67yZdCKeBGL9-m-u6Trgg85eQcuwUpzWUE', userId: 'Darth_Maul' };
    navigate('/VideoCall', { state: userInformation });

  }

  function handleCallAnswer(answer: any) {
    if (answer === "join") {
      sendMessage("Accept Video Call");
      const userInformation = { chatID: chatRoom, userName: senderName, currentUserID: state.currentUserID, theme: state.theme, themeID: state.themeID, token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3Byb250by5nZXRzdHJlYW0uaW8iLCJzdWIiOiJ1c2VyL1dlZGdlX0FudGlsbGVzIiwidXNlcl9pZCI6IldlZGdlX0FudGlsbGVzIiwidmFsaWRpdHlfaW5fc2Vjb25kcyI6NjA0ODAwLCJpYXQiOjE3MzIyMDU2ODAsImV4cCI6MTczMjgxMDQ4MH0.5v6JVKjD4-nP0Fn71KkuIy_iqdz6lwWnDzopcLFjids', userId: 'Wedge_Antilles' };
      navigate('/VideoCall', { state: userInformation });

      // Third User
      const userInformation2 = { chatID: chatRoom, userName: userProfileData.name, currentUserID: state.currentUserID, theme: state.theme, themeID: state.themeID, token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3Byb250by5nZXRzdHJlYW0uaW8iLCJzdWIiOiJ1c2VyL0RhcnRoX1ZhZGVyIiwidXNlcl9pZCI6IkRhcnRoX1ZhZGVyIiwidmFsaWRpdHlfaW5fc2Vjb25kcyI6NjA0ODAwLCJpYXQiOjE3MzIyMDU2ODEsImV4cCI6MTczMjgxMDQ4MX0.RwN3woH0hi9KxfqP48TEiX3VrGoD85Hj2ZnpUFt4wBg', userId: 'Darth_Vader' };

    } else if (answer === "decline") {
      // console.log("call end")
      sendMessage("Decline Video Call");
      refreshPage(2);
    }
  }

  function checkChatAssistent() {
    const lastMessagesList = messages[messages?.length - 1];
    const lastMessagesSentence = lastMessagesList?.text;
    const lastMessagessenderName = lastMessagesList?.user;
    const lastSortMessageList = sortedData[sortedData?.length - 1];
    const lastSortMessageSentence = lastSortMessageList?.message;
    const lastSortMessageSenderID = lastSortMessageList?.senderID;


    if (lastMessagesSentence !== undefined) {
      if (lastMessagessenderName !== userProfileData.name) {
        chatAssistantList.forEach((element: any) => {
          if (lastMessagesSentence.toLowerCase().includes(element.keyWord.toLowerCase())) {
            setReplyOption(element.message);
          }
        });
      }
    } else if (lastSortMessageSentence !== undefined) {
      if (lastSortMessageSenderID !== currentUserID) {
        chatAssistantList.forEach((element: any) => {
          if (lastSortMessageSentence.toLowerCase().includes(element.keyWord.toLowerCase())) {
            setReplyOption(element.message);
          }
        });
      }
    } else {
      setReplyOption('');
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    checkChatAssistent()
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

              <Grid size={1}>
                <BottomNavigationAction label="Setting" value="setting" onClick={handleOpenDelete} icon={<AddIcon fontSize="small" />} sx={{ '&.Mui-selected': { color: 'rgba(245, 245, 245, 0.9)' }, marginBottom: '-25%', marginLeft: '1250%' }} />
                <Modal open={openDelete} onClose={handleCloseDelete} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                  <Box sx={modalStyle}>
                    <Typography id="modal-modal-title" variant="h4" component="h2" sx={{ textAlign: 'center', marginBottom: 4, color: 'black' }}>
                      Add New Chat
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                      <Grid size={12} sx={{ color: 'black' }}>
                        <Typography>
                          <AddNewChat currentUserID={currentUserID} userInformationList={userInformationList} />
                        </Typography>
                      </Grid>
                    </Typography>
                  </Box>
                </Modal>
              </Grid>

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
                            <Grid size={5}>
                              <Typography variant="h4" sx={{ fontSize: '20px' }}><strong>{chat.name.slice(0, 10)}{chat.name.length > 10 ? (<Typography>...</Typography>) : (<Typography></Typography>)}</strong></Typography>
                            </Grid>
                            <Grid size={4}>
                              <Typography variant="h4" sx={{ fontSize: '12px', marginBottom: '5%' }}>{chat.chatRole} Chatbox</Typography>
                              <Typography variant="h4" sx={{ fontSize: '12px' }}><strong><i>{chat.lastDateTime}</i></strong></Typography>
                            </Grid>
                            <Grid size={1}>
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
                            <Grid size={5}>
                              <Typography variant="h4" sx={{ fontSize: '20px' }}><strong>{chat.name.slice(0, 10)}{chat.name.length > 10 ? (<Typography>...</Typography>) : (<Typography></Typography>)}</strong></Typography>
                            </Grid>
                            <Grid size={4}>
                              <Typography variant="h4" sx={{ fontSize: '12px', marginBottom: '5%' }}>{chat.chatRole} Chatbox</Typography>
                              <Typography variant="h4" sx={{ fontSize: '12px' }}><strong><i>{chat.lastDateTime}</i></strong></Typography>
                            </Grid>
                            <Grid size={1}>
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
                            <Grid size={5}>
                              <Typography variant="h4" sx={{ fontSize: '20px' }}><strong>{chat.name.slice(0, 10)}{chat.name.length > 10 ? (<Typography>...</Typography>) : (<Typography></Typography>)}</strong></Typography>
                            </Grid>
                            <Grid size={4}>
                              <Typography variant="h4" sx={{ fontSize: '12px', marginBottom: '5%' }}>{chat.chatRole} Chatbox</Typography>
                              <Typography variant="h4" sx={{ fontSize: '12px' }}><strong><i>{chat.lastDateTime}</i></strong></Typography>
                            </Grid>
                            <Grid size={1}>
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
                            <Grid size={2}>
                              <Avatar alt={friendProfileDetail.get(chat.chatID)?.name} src={friendProfileDetail.get(chat.chatID)?.photo} sx={{ width: 35, height: 35, alignItems: 'center', border: '3px solid', borderColor: checkOnlineStatus(friendProfileDetail.get(chat.chatID)?.onlineStatus) }} />
                            </Grid>
                            <Grid size={5}>
                              <Typography variant="h4" sx={{ fontSize: '20px' }}><strong>{chat.name.slice(0, 10)}{chat.name.length > 10 ? (<Typography>...</Typography>) : (<Typography></Typography>)}</strong></Typography>
                            </Grid>
                            <Grid size={4}>
                              <Typography variant="h4" sx={{ fontSize: '12px', marginBottom: '5%' }}>{chat.chatRole} Chatbox</Typography>
                              <Typography variant="h4" sx={{ fontSize: '12px' }}><strong><i>{chat.lastDateTime}</i></strong></Typography>
                            </Grid>
                            <Grid size={1}>
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
                          <b>{receiverName !== undefined ? (receiverName) :
                            (m.senderID === currentUserID ? (<Typography><b>{friendListDetail.get(parseInt(selectedChatData.admin))?.name}</b></Typography>) : (<Typography><b>{friendListDetail.get(m.senderID)?.name}</b></Typography>))}</b>
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
                  <ChatBox ownerChatID={value} friendChatID={friendValue} currentUserID={currentUserID} selectedChatData={selectedChatData} chatRoom={chatRoom} chatUserName={chatUserName} messages={messages} handleCallAnswer={handleCallAnswer} />
                </Paper>
              </CustomTabPanel>
            </Paper>
          </Grid>

          <Grid size={5}>
          </Grid>

          <Grid size={7}>
            <CustomTabPanel2 value={value} index={value}>
              {parseInt(selectedChatData.admin) === currentUserID ?
                (<Grid container spacing={1}>
                  <Grid size={4}></Grid>
                  <Grid size={4}></Grid>
                  <Grid size={1}>
                    <BottomNavigationAction label="Setting" value="setting" onClick={handleOpenEdit} icon={<SettingsIcon fontSize="small" />} sx={{ '&.Mui-selected': { color: 'rgba(245, 245, 245, 0.9)' } }} />
                    <Modal open={openEdit} onClose={handleCloseEdit} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                      <Box sx={modalStyle}>
                        <Typography id="modal-modal-title" variant="h4" component="h2" sx={{ textAlign: 'center', marginBottom: 4, color: 'black' }}>
                          Edit Chat
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                          <Grid size={12} sx={{ color: 'black' }}>
                            <Typography>
                              <EditChat selectedChatData={selectedChatData} userInformationList={userInformationList} />
                            </Typography>
                          </Grid>
                        </Typography>
                      </Box>
                    </Modal>
                  </Grid>
                  <Grid size={1}><BottomNavigationAction label="Video Call" value="videoCall" onClick={() => handleVideoCall()} icon={<VideocamIcon fontSize="small" />} sx={{ '&.Mui-selected': { color: 'rgba(245, 245, 245, 0.9)' } }} /></Grid>
                </Grid>) :
                (<Grid container spacing={1}>
                  <Grid size={4}></Grid>
                  <Grid size={4}></Grid>
                  <Grid size={1}>
                    <BottomNavigationAction label="Setting" value="setting" onClick={handleOpenEdit} icon={<SettingsIcon fontSize="small" />} sx={{ '&.Mui-selected': { color: 'rgba(245, 245, 245, 0.9)' } }} />
                    <Modal open={openEdit} onClose={handleCloseEdit} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                      <Box sx={modalStyle}>
                        <Typography id="modal-modal-title" variant="h4" component="h2" sx={{ textAlign: 'center', marginBottom: 4, color: 'black' }}>
                          Edit Chat
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                          <Grid size={12} sx={{ color: 'black' }}>
                            <Typography>
                              <EditChat selectedChatData={selectedChatData} userInformationList={userInformationList} />
                            </Typography>
                          </Grid>
                        </Typography>
                      </Box>
                    </Modal>
                  </Grid>
                  <Grid size={1}><BottomNavigationAction label="Video Call" value="videoCall" onClick={() => handleVideoCall()} icon={<VideocamIcon fontSize="small" />} sx={{ '&.Mui-selected': { color: 'rgba(245, 245, 245, 0.9)' } }} /></Grid>
                </Grid>)}
              <SendMessageForm sendMessage={sendMessage} replyOption={replyOption} />
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
import '../CSS/Home.css'
import names from '../General/Component';
import { Avatar, Box, Button, List, ListItem, Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useLocation } from 'react-router-dom';
import BottomMenuBar from '../General/BottomMenuBar';
import axios from 'axios';
import { useEffect, useState } from 'react';
import ChatBox from './ChatBox';

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

  // Catch Data From DB
  function getUserData() {
    axios.get(names.getProfileByUserID + currentUserID).then((response) => {
      setUserProfileData(response.data);
    });

    axios.get(names.getChatByUserID + currentUserID).then((response) => {
      setUserChatListData(response.data);
    });

    axios.get(names.getChatByID + chatID).then((response) => {
      setSelectedChatData(response.data);
      setValue(response.data.chatID);
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

  // Handle Header Menu Onchange
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // Return The Specific Header Menu Option Information
  function CustomTabPanel(props: any) {
    const { children, value, index, ...other } = props;

    return (
      <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
        {value !== 0 && value === index && <Box sx={{ marginTop: '3%' }}>{children}</Box>}
        {value === 0 && <Box sx={{ marginTop: '3%', textAlign: 'center' }}>
          <Typography variant="h4"><strong>No Chat Yet</strong></Typography>
        </Box>}
      </div>
    );
  }

  // Catch The Specific Friend Online Status
  function handleChat(chat: any) {
    setSelectedChatData(chat);
    setValue(chat.chatID);

    axios.get(names.getProfileByUserName + chat.name).then((response) => {
      axios.get(names.getChatByUserID + response.data.userID).then((response) => {
        (response.data).forEach((element:any) => {
          if(element.name === userProfileData.name){
            setFriendValue(element.chatID);
          }
        });
      })
    })
  }

  useEffect(() => {
    getUserData()

    // Update the CSS variable dynamically
    document.documentElement.style.setProperty('--backgroundImage', `url('${state.theme}')`);
  }, []);

  useEffect(() => {
    catchFriendDetail();
  }, [userChatListData]);

  console.log(selectedChatData);

  return <div>
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '97vh' }}>

      <Paper elevation={3} sx={{ padding: 3, width: 1100, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: names.BoxRadius, backgroundColor: names.BoxBackgroundColor }}>

        <Grid container spacing={1}>
          <Grid size={4}>
            <Paper sx={{ width: 400, maxHeight: '420px', overflowY: 'auto', padding: 2, backgroundColor: 'transparent', boxShadow: 'none', '&::-webkit-scrollbar': { width: '8px' }, '&::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1', borderRadius: '10px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: '10px', '&:hover': { backgroundColor: '#555' } }}}>

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
            <Paper sx={{ width: 620, marginLeft: "8%", maxHeight: '320px', overflowY: 'auto', padding: 2, backgroundColor: 'transparent', border: "1px solid gray",boxShadow: 'none', '&::-webkit-scrollbar': { width: '8px' }, '&::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1', borderRadius: '10px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: '10px', '&:hover': { backgroundColor: '#555' } }}}>

              <CustomTabPanel value={value} index={value}>
                <ChatBox ownerChatID={value} friendChatID={friendValue} currentUserID={currentUserID} selectedChatData={selectedChatData} />
              </CustomTabPanel>
            </Paper>
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
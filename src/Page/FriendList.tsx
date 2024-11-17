import '../CSS/Home.css'
import names from '../General/Component';
import { Avatar, Box, Button, List, ListItem, Paper, Tab, Tabs, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useLocation, useNavigate } from 'react-router-dom';
import BottomMenuBar from '../General/BottomMenuBar';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { refreshPage } from '../General/Functions';

interface UserInformation {
  currentUserID: number;
  theme: string;
  themeID: number;
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

const FriendList = () => {
  //Catch The Data
  const location = useLocation();
  const state = location.state as UserInformation;
  const currentUserID = state.currentUserID;
  const theme = state.theme;
  const themeID = state.themeID;
  const userInformationList = { currentUserID, theme, themeID };
  const [currentUserName, setCurrentUserName] = useState<any>();
  const [userProfileData, setUserProfileData] = useState<any>([]);
  const [userFriendData, setUserFriendData] = useState<any>([]);
  const [friendThemeDetail, setFriendThemeDetail] = useState<Map<number, ThemeDetail>>(new Map());
  const [friendProfileDetail, setFriendProfileDetail] = useState<Map<number, ProfileDetail>>(new Map());
  const [waitingThemeDetail, setWaitingThemeDetail] = useState<Map<number, ThemeDetail>>(new Map());
  const [waitingProfileDetail, setWaitingProfileDetail] = useState<Map<number, ProfileDetail>>(new Map());
  const [pendingThemeDetail, setPendingThemeDetail] = useState<Map<number, ThemeDetail>>(new Map());
  const [pendingProfileDetail, setPendingProfileDetail] = useState<Map<number, ProfileDetail>>(new Map());
  const [value, setValue] = useState(1);
  const navigate = useNavigate();
  const currentDateTime = new Date();

  // Update the CSS variable dynamically
  document.documentElement.style.setProperty('--backgroundImage', `url('${state.theme}')`);

  // Catch User Profile and User Friend Data From Database
  function getUserData() {
    axios.get(names.getProfileByUserID + currentUserID).then((response) => {
      setUserProfileData(response.data);
      setCurrentUserName(response.data.name)
    });

    axios.get(names.getFriendByUserID + currentUserID).then((response) => {
      setUserFriendData(response.data);
    });
  }

  // Catch Friend Detail Information From Database
  function catchFriendDetail() {
    userFriendData.forEach((friend: any) => {
      if (friend.status === "Accept") {
        let friendID: number = friend.friendID;
        axios.get(names.getProfileByID + friend.profileID).then((response) => {
          if (response.status === 200) {
            setFriendProfileDetail(prev => new Map(prev).set(friendID, response.data));

            axios.get(names.getThemeByID + response.data.themeID).then((response) => {
              setFriendThemeDetail(prev => new Map(prev).set(friendID, response.data));
            })
          }
        });
      } else if (friend.status === "Waiting") {
        let friendID: number = friend.friendID;
        axios.get(names.getProfileByID + friend.profileID).then((response) => {
          if (response.status === 200) {
            setWaitingProfileDetail(prev => new Map(prev).set(friendID, response.data));

            axios.get(names.getThemeByID + response.data.themeID).then((response) => {
              setWaitingThemeDetail(prev => new Map(prev).set(friendID, response.data));
            })
          }
        });
      } else if (friend.status === "Pending") {
        let friendID: number = friend.friendID;
        axios.get(names.getProfileByID + friend.profileID).then((response) => {
          if (response.status === 200) {
            setPendingProfileDetail(prev => new Map(prev).set(friendID, response.data));

            axios.get(names.getThemeByID + response.data.themeID).then((response) => {
              setPendingThemeDetail(prev => new Map(prev).set(friendID, response.data));
            })
          }
        });
      }
    })
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
        {value === index && <Box sx={{ marginTop: '3%' }}>{children}</Box>}
      </div>
    );
  }
  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  // Handle Accept Friend
  const handleAcceptFriend = (friend: any) => {
    toast.success('Accept Friend Successful~', {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: true,
      style: {
        backgroundColor: names.BoxBackgroundColor,
        color: names.TextColor,
        borderRadius: '8px',
      },
    });

    axios.get(names.getProfileByID + friend.profileID).then((response) => {
      axios.get(names.getFriendByUserID + response.data.userID).then((response) => {
        (response.data).forEach((element: any) => {
          if (element.name === currentUserName) {
            if (element.status === "Waiting") {
              const updateFriendStatusOther = { friendID: element.friendID, name: element.name, position: element.position, status: "Accept", profileID: element.profileID, userID: element.userID };
              axios.put(names.basicFriendAPI, updateFriendStatusOther);
            }
          }
        });
      })
    })

    const updateFriendStatusOwner = { friendID: friend.friendID, name: friend.name, position: friend.position, status: "Accept", profileID: friend.profileID, userID: friend.userID };
    axios.put(names.basicFriendAPI, updateFriendStatusOwner);

    setTimeout(() => {
      refreshPage(20)
    }, 900);
  }

  // Handle Reject Friend
  const handleRejectFriend = (friend: any) => {
    toast.success('Reject Friend Successful~', {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: true,
      style: {
        backgroundColor: names.BoxBackgroundColor,
        color: names.TextColor,
        borderRadius: '8px',
      },
    });

    axios.get(names.getProfileByID + friend.profileID).then((response) => {
      axios.get(names.getFriendByUserID + response.data.userID).then((response) => {
        (response.data).forEach((element: any) => {
          if (element.name === currentUserName) {
            if (element.status === "Waiting") {
              axios.delete(names.getFriendByID + element.friendID);
            }
          }
        });
      })
    })

    axios.delete(names.getFriendByID + friend.friendID);

    setTimeout(() => {
      refreshPage(20)
    }, 900);
  }

  // Handle Chat Friend
  const handleChatFriend = (friend: any) => {
    axios.get(names.getProfileByID + friend.profileID).then((response) => {
      let friendUserID = response.data.userID.toString();
      let roleExist = "false";

      axios.get(names.getChatByUserID + currentUserID).then((response) => {
        if (response.status === 200) {
          (response.data).forEach((element: any) => {
            if (element.admin === currentUserID.toString() && element.member === friendUserID && element.chatRole === "Individual") {
              roleExist = "true";
            }
          });
          if (roleExist === "true") {
          } else if (roleExist === "false") {
            const formattedDate = currentDateTime.toLocaleString();
            const newChatRoom = { name: friend.name, chatRole: "Individual", admin: currentUserID.toString(), member: friendUserID, lastDateTime: formattedDate, status: "Not Pin", userID: currentUserID }
            axios.post(names.basicChatAPI, newChatRoom);
          }
        }
      })
    })

    navigate('/Home', { state: userInformationList });
    refreshPage(2)
  }

  // Handle Edit Friend
  const handleEditFriend = (friend: any) => {
    axios.get(names.getProfileByID + friend.profileID).then((response) => {
      axios.get(names.getThemeByID + response.data.themeID).then((response) => {
        const detailInformation = {
          currentUserID: currentUserID,
          theme: theme,
          themeID: themeID,
          friendID: friend.friendID,
          name: friend.name,
          position: friend.position,
          status: friend.status,
          profileID: friend.profileID,
          userID: friend.userID,
          friendThemeSource: response.data.source
        }
        navigate('/FriendProfile', { state: detailInformation });
        refreshPage(2)
      })
    })
  }

  // Trigger The Function Verytime When The Page Refresh
  useEffect(() => {
    getUserData();
  }, []);

  // Trigger The Function Verytime When The userFriendData have change
  useEffect(() => {
    catchFriendDetail();
  }, [userFriendData]);

  // Main UI Of This Page
  return <div>
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '97vh' }}>
      <Paper elevation={3} sx={{ padding: 3, width: 1100, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: names.BoxRadius, backgroundColor: names.BoxBackgroundColor }}>
        <Grid container spacing={2}>
          <Grid size={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Paper sx={{
              width: 1070, maxHeight: '320px', overflowY: 'auto', padding: 2, backgroundColor: 'transparent', boxShadow: 'none',
              '&::-webkit-scrollbar': { width: '8px' }, '&::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1', borderRadius: '10px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: '10px', '&:hover': { backgroundColor: '#555' } }
            }}>

              {/* Hearder Menu */}
              <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="Friend List" value={1} />
                <Tab label="Waiting Accept List" value={2} />
                <Tab label="Accept Pending List" value={3} />
              </Tabs>

              {/* Content Of Header Menu Option 1 */}
              <CustomTabPanel value={value} index={1}>
                <List>
                  {userFriendData.map((friend: any) => {
                    if (friend.status === "Accept") {
                      return <div>
                        <ListItem key={friend.friendID}>
                          <Paper sx={{ marginBottom: 2, padding: 2, width: 1000, backgroundImage: `url('${friendThemeDetail.get(friend.friendID)?.source}')`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center', color: 'black', borderRadius: '40px', maxHeight: '60px' }}>
                            <Grid container spacing={2} alignItems="center">
                              <Grid size={2} >
                                <Avatar alt={friendProfileDetail.get(friend.friendID)?.name} src={friendProfileDetail.get(friend.friendID)?.photo} sx={{ width: 55, height: 55, alignItems: 'center', border: '5px solid', borderColor: checkOnlineStatus(friendProfileDetail.get(friend.friendID)?.onlineStatus) }} />
                              </Grid>
                              <Grid size={3}>
                                <Typography variant="h4" sx={{ fontSize: '30px' }}><strong>{friend.name}</strong></Typography>
                                <Typography variant="h5" sx={{ fontSize: '20px' }}><i>{friend.position}</i></Typography>
                              </Grid>
                              <Grid size={4}>
                              </Grid>
                              <Grid size={1}>
                                <Button variant="contained" style={{ backgroundColor: "rgba(105, 105, 105, 0.5)", marginLeft: '35%' }} onClick={() => handleChatFriend(friend)}>
                                  Chat
                                </Button>
                              </Grid>
                              <Grid size={1}>
                                <Button variant="contained" style={{ backgroundColor: "rgba(105, 105, 105, 0.5)", marginLeft: '85%' }} onClick={() => handleEditFriend(friend)}>
                                  Edit
                                </Button>
                              </Grid>
                            </Grid>
                          </Paper>
                        </ListItem>
                      </div>
                    }
                  })}
                </List>
              </CustomTabPanel>

              {/* Content Of Header Menu Option 2 */}
              <CustomTabPanel value={value} index={2}>
                <List>
                  {userFriendData.map((friend: any) => {
                    if (friend.status === "Waiting") {
                      return <div>
                        <ListItem key={friend.friendID}>
                          <Paper sx={{ marginBottom: 2, padding: 2, width: 1000, backgroundImage: `url('${waitingThemeDetail.get(friend.friendID)?.source}')`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center', color: 'black', borderRadius: '40px', maxHeight: '60px' }}>
                            <Grid container spacing={2} alignItems="center">
                              <Grid size={2} >
                                <Avatar alt={waitingProfileDetail.get(friend.friendID)?.name} src={waitingProfileDetail.get(friend.friendID)?.photo} sx={{ width: 55, height: 55, alignItems: 'center', border: '5px solid', borderColor: checkOnlineStatus(waitingProfileDetail.get(friend.friendID)?.onlineStatus) }} />
                              </Grid>
                              <Grid size={4}>
                                <Typography variant="h4" sx={{ fontSize: '30px' }}><strong>{friend.name}</strong></Typography>
                                <Typography variant="h5" sx={{ fontSize: '20px', color: 'black' }}><i>Waiting To Accept</i></Typography>
                              </Grid>
                            </Grid>
                          </Paper>
                        </ListItem>
                      </div>
                    }
                  })}
                </List>
              </CustomTabPanel>

              {/* Content Of Header Menu Option 2 */}
              <CustomTabPanel value={value} index={3}>
                <List>
                  {userFriendData.map((friend: any) => {
                    if (friend.status === "Pending") {
                      return <div>
                        <ListItem key={friend.friendID}>
                          <Paper sx={{ marginBottom: 2, padding: 2, width: 1000, backgroundImage: `url('${pendingThemeDetail.get(friend.friendID)?.source}')`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center', color: 'black', borderRadius: '40px', maxHeight: '60px' }}>
                            <Grid container spacing={2} alignItems="center">
                              <Grid size={2} >
                                <Avatar alt={pendingProfileDetail.get(friend.friendID)?.name} src={pendingProfileDetail.get(friend.friendID)?.photo} sx={{ width: 55, height: 55, alignItems: 'center', border: '5px solid', borderColor: checkOnlineStatus(pendingProfileDetail.get(friend.friendID)?.onlineStatus) }} />
                              </Grid>
                              <Grid size={3}>
                                <Typography variant="h4" sx={{ fontSize: '30px' }}><strong>{pendingProfileDetail.get(friend.friendID)?.name}</strong></Typography>
                                <Typography variant="h5" sx={{ fontSize: '20px', color: 'black' }}><i>Pending To Accept</i></Typography>
                              </Grid>
                              <Grid size={4}>
                              </Grid>
                              <Grid size={1}>
                                <Button variant="contained" style={{ backgroundColor: "rgba(105, 105, 105, 0.5)", marginLeft: '35%' }} onClick={() => handleAcceptFriend(friend)}>
                                  Accept
                                </Button>
                              </Grid>
                              <Grid size={1}>
                                <Button variant="contained" style={{ backgroundColor: "rgba(105, 105, 105, 0.5)", marginLeft: '85%' }} onClick={() => handleRejectFriend(friend)}>
                                  Reject
                                </Button>
                              </Grid>
                            </Grid>
                          </Paper>
                        </ListItem>
                      </div>
                    }
                  })}
                </List>
              </CustomTabPanel>
              <ToastContainer />
            </Paper>
          </Grid>

          {/* Footer Menu */}
          <Grid size={12} sx={{ marginBottom: '-1.5%' }}>
            {BottomMenuBar(userInformationList, "friend", userProfileData.photo, userProfileData.name)}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  </div>
}

export default FriendList
import '../CSS/Home.css'
import names from '../General/Component';
import { Avatar, Box, List, ListItem, Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useLocation } from 'react-router-dom';
import BottomMenuBar from '../General/BottomMenuBar';
import { useEffect, useState } from 'react';
import axios from 'axios';

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
  const [userProfileData, setUserProfileData] = useState<any>([]);
  const [userFriendData, setUserFriendData] = useState<any>([]);
  const [friendThemeDetail, setFriendThemeDetail] = useState<Map<number, ThemeDetail>>(new Map());
  const [friendProfileDetail, setFriendProfileDetail] = useState<Map<number, ProfileDetail>>(new Map());

  // Update the CSS variable dynamically
  document.documentElement.style.setProperty('--backgroundImage', `url('${state.theme}')`);

  // Catch Data From DB
  function getUserData() {
    axios.get(names.getProfileByUserID + currentUserID).then((response) => {
      setUserProfileData(response.data);
    });

    axios.get(names.getFriendByUserID + currentUserID).then((response) => {
      setUserFriendData(response.data);
    });
  }

  function catchFriendDetail() {
    userFriendData.forEach((friend: any) => {
      if (friend.status !== "Pending") {
        let friendID: number = friend.friendID;
        axios.get(names.getProfileByID + friend.profileID).then((response) => {
          if (response.status === 200) {
            //Set All Record Friend Photo
            setFriendProfileDetail(prev => new Map(prev).set(friendID, response.data));

            axios.get(names.getThemeByID + response.data.themeID).then((response) => {
              //Set All Record Friend Photo
              setFriendThemeDetail(prev => new Map(prev).set(friendID, response.data));
            })
          }
        });
      }
    })
  }

  function checkOnlineStatus(onlineStatus:any) {
    if(onlineStatus === "Offline"){
      return 'gray'
    }else{
      return 'green'
    }
  }

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    catchFriendDetail();
  }, [userFriendData]);
  

  return <div>
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '97vh' }}>

      <Paper elevation={3} sx={{ padding: 3, width: 1100, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: names.BoxRadius, backgroundColor: names.BoxBackgroundColor }}>

        <Grid container spacing={2}>
          <Grid size={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Paper
              sx={{
                width: 1070, maxHeight: '320px', overflowY: 'auto', padding: 2, backgroundColor: 'transparent', boxShadow: 'none',
                '&::-webkit-scrollbar': { width: '8px' }, '&::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1', borderRadius: '10px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: '10px', '&:hover': { backgroundColor: '#555' } }
              }}>
              <List>
                {userFriendData.map((friend: any) => {
                  if (friend.status !== "Pending") {
                    return <div>
                      <ListItem key={friend.friendID}>
                        <Paper sx={{ marginBottom: 2, padding: 2, width: 1000, backgroundImage: `url('${friendThemeDetail.get(friend.friendID)?.source}')`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center', color: 'black', borderRadius: '40px' , maxHeight: '60px'}}>
                          <Grid container spacing={2} alignItems="center">
                            <Grid size={2} >
                              <Avatar alt={friendProfileDetail.get(friend.friendID)?.name} src={friendProfileDetail.get(friend.friendID)?.photo} sx={{ width: 55, height: 55, alignItems: 'center', border: '5px solid', borderColor: checkOnlineStatus(friendProfileDetail.get(friend.friendID)?.onlineStatus)}}/>
                            </Grid>
                            <Grid size={3}>
                              <Typography variant="h4" sx={{ fontSize: '30px' }}><strong>{friend.name}</strong></Typography>
                              <Typography variant="h5" sx={{ fontSize: '20px' }}><i>{friend.position}</i></Typography>
                            </Grid>
                            <Grid size={3}>
                              
                            </Grid>
                          </Grid>
                        </Paper>
                        {/* <ListItemText primary={friend.name} /> */}
                      </ListItem>
                    </div>
                  }
                })}
                {/* <Typography variant="body1" color="textSecondary">
                  No records found.
                </Typography> */}
              </List>
            </Paper>
          </Grid>

          <Grid size={12} sx={{ marginBottom: '-1.5%' }}>
            {BottomMenuBar(userInformationList, "friend", userProfileData.photo, userProfileData.name)}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  </div>
}

export default FriendList
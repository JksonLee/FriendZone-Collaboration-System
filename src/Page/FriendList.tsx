import '../CSS/Home.css'
import names from '../General/Component';
import { Box, List, ListItem, ListItemText, Paper, Typography } from '@mui/material';
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
  const [friendBackground, setFriendBackground] = useState<any>();

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

  useEffect(() => {
    getUserData()
  }, []);

  return <div>
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '97vh' }}>

      <Paper elevation={3} sx={{ padding: 3, width: 1100, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: names.BoxRadius, backgroundColor: names.BoxBackgroundColor }}>

        <Grid container spacing={2}>
          <Grid size={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Paper
              sx={{
                width: 1070, maxHeight: '300px', overflowY: 'auto', padding: 2, backgroundColor: 'transparent', boxShadow: 'none',
                '&::-webkit-scrollbar': { width: '8px' }, '&::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1', borderRadius: '10px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: '10px', '&:hover': { backgroundColor: '#555' } }
              }}>
              <Typography variant="h6" gutterBottom>
                Friend List
              </Typography>
              <List>
                {userFriendData.map((friend: any) => {
                  if (friend.status != "pending") {
                    axios.get(names.getProfileByUserName + friend.name).then((response) => {
                      axios.get(names.getThemeByID + response.data.themeID).then((response) => {
                        setFriendBackground(response.data.source);
                      })
                    });
                    return <div>
                      <ListItem key={friend.friendID}>
                        <Paper sx={{ marginBottom: 2, padding: 2, width:1000, backgroundImage: `url('${friendBackground}')`}}>
                          <Grid container spacing={2} alignItems="center">
                            {/* Each column represents an attribute of the item */}
                            <Grid size={3}>
                              <Typography variant="body1"><strong>Name:</strong> {friend.name}</Typography>
                            </Grid>
                            <Grid size={3}>
                              <Typography variant="body1"><strong>Name:</strong> {friend.name}</Typography>
                            </Grid>
                            <Grid size={3}>
                              <Typography variant="body1"><strong>Category:</strong> {friend.position}</Typography>
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
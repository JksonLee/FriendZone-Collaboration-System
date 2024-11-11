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
  const [items, setItems] = useState<any>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]);

  // Update the CSS variable dynamically
  document.documentElement.style.setProperty('--backgroundImage', `url('${state.theme}')`);

  // Catch Data From DB
  function getUserData() {
    axios.get(names.getProfileByUserID + currentUserID).then((response) => {
      setUserProfileData(response.data);
    });
  }

  useEffect(() => {
    getUserData()
  }, []);

  return <div>
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '97vh' }}>

      <Paper elevation={3} sx={{ padding: 3, width: 1100, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: names.BoxRadius, backgroundColor: names.BoxBackgroundColor }}>

        {/* <Typography variant="h4" gutterBottom sx={{ marginBottom: '5%' }}>
          <b>Friend List</b>
        </Typography> */}

        <Grid container spacing={2}>
          <Grid size={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Paper
              sx={{
                width: 1070, maxHeight: '300px', overflowY: 'auto', padding: 2, backgroundColor: 'transparent', boxShadow: 'none',
                '&::-webkit-scrollbar': { width: '8px' }, '&::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1', borderRadius: '10px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: '10px', '&:hover': { backgroundColor: '#555'}}}}>
              <Typography variant="h6" gutterBottom>
                Scrollable List
              </Typography>
              <List>
                {items.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
            </Paper>

          </Grid>

          <Grid size={12}>

          </Grid>

          <Grid size={12}>

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
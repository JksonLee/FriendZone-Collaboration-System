import '../CSS/Home.css'
import names from '../General/Component';
import { Box, Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useLocation } from 'react-router-dom';
import BottomMenuBar from '../General/BottomMenuBar';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface UserInformation {
  currentUserID: number;
  theme: string;
  themeID: number;
}

const Home = () => {
  //Catch The Data
  const location = useLocation();
  const state = location.state as UserInformation;
  const currentUserID = state.currentUserID;
  const theme = state.theme;
  const themeID = state.themeID;
  const userInformationList = { currentUserID, theme, themeID };
  const [userProfileData, setUserProfileData] = useState<any>([]);

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

        <Typography variant="h4" gutterBottom sx={{ marginBottom: '5%' }}>
          <b>Main Page</b>
        </Typography>

        <Grid container spacing={2}>
          <Grid size={4}>

          </Grid>

          <Grid size={8}>

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
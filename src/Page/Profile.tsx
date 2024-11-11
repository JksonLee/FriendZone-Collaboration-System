import '../CSS/Home.css'
import names from '../General/Component';
import { Avatar, Box, Paper } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useLocation } from 'react-router-dom';
import BottomMenuBar from '../General/BottomMenuBar';
import axios from 'axios';
import { useEffect, useState } from 'react';
import ProfileDisplayFormat from '../General/ProfileDisplayFormat';

interface UserInformation {
  currentUserID: number;
  theme: string;
  themeID: number;
}

const Profile = () => {
  //Catch The Data
  const location = useLocation();
  const state = location.state as UserInformation;
  const currentUserID = state.currentUserID;
  const theme = state.theme;
  const themeID = state.themeID;
  const userInformationList = { currentUserID, theme, themeID };
  const [userProfileData, setUserProfileData] = useState<any>([]);
  const [userData, setUserData] = useState<any>([]);

  // Update the CSS variable dynamically
  document.documentElement.style.setProperty('--backgroundImage', `url('${state.theme}')`);

  //Get User Profile Information
  function getUserData() {
    axios.get(names.getProfileByUserID + currentUserID).then((response) => {
      setUserProfileData(response.data);
    });

    axios.get(names.getUserByUserID + currentUserID).then((response) => {
      setUserData(response.data);
    });
  }

  useEffect(() => {
    getUserData()
  }, []);

  return <div>
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>

      <Paper elevation={3} sx={{ padding: 3, width: 1100, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: names.BoxRadius, backgroundColor: names.BoxBackgroundColor }}>

        <Grid container spacing={2}>
          {/* Icon */}
          <Grid size={5}></Grid>
          <Grid size={2}>
            <Avatar src={userProfileData.photo} sx={{ width: 170, height: 170, alignItems: 'center', marginTop: '-65%' }} />
          </Grid>
          <Grid size={5}></Grid>

          {/* Information */}
          <Grid size={6} sx={{ textAlign: 'center', marginTop: '2%' }}>
            <ProfileDisplayFormat title="Name" content={userProfileData.name} />
          </Grid>
          <Grid size={6} sx={{ textAlign: 'center', marginTop: '2%' }}>
            <ProfileDisplayFormat title="Email" content={userData.email} />
          </Grid>
          <Grid size={12} sx={{ textAlign: 'center', marginTop: '2%', marginBottom: 2 }}>
            <Box sx={{ maxWidth: '80%', marginLeft: '10%' }}>
              <ProfileDisplayFormat title="About Me" content={userProfileData.bio} />
            </Box>
          </Grid>

          <Grid size={12} sx={{ marginBottom: '-1.5%' }}>
            {BottomMenuBar(userInformationList, "profile")}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  </div>
}

export default Profile
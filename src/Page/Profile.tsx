import '../CSS/Home.css'
import names from '../General/Component';
import { Box, Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useLocation } from 'react-router-dom';
import BackButton from '../General/BackButton';
import BottomMenuBar from '../General/BottomMenuBar';

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

  // Update the CSS variable dynamically
  document.documentElement.style.setProperty('--backgroundImage', `url('${state.theme}')`);

  return <div>
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>

      <Paper elevation={3} sx={{ padding: 3, width: 1100, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: names.BoxRadius, backgroundColor: names.BoxBackgroundColor }}>

        <Typography variant="h4" gutterBottom sx={{ marginBottom: '5%' }}>
          <b>Profile</b>
        </Typography>

        <Grid container spacing={2}>
          <Grid size={12}>

          </Grid>

          <Grid size={12}>

          </Grid>

          <Grid size={12}>

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
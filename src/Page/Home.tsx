import '../CSS/Home.css'
import componentNames from '../General/Component';
import { Box, Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useLocation } from 'react-router-dom';

interface UserID {
  currentUserID: number;
  theme: string;
  themeID: number;
}

const Home = () => {
  //Catch The Data
  const location = useLocation();
  const state = location.state as UserID;

  // Update the CSS variable dynamically
  document.documentElement.style.setProperty('--backgroundImage', `url('${state.theme}')`);

  return <div >
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>

      <Paper elevation={3} sx={{ padding: 3, width: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: componentNames.BoxRadius, backgroundColor: componentNames.BoxBackgroundColor }}>

        <Typography variant="h4" gutterBottom sx={{ marginBottom: '5%' }}>
          <b>Login</b>
        </Typography>

        <Grid container spacing={2}>
          <Grid size={12}>

          </Grid>

          <Grid size={12}>

          </Grid>

          <Grid size={12}>

          </Grid>

          <Grid size={12}>

          </Grid>
        </Grid>
      </Paper>
    </Box>
  </div>
}

export default Home
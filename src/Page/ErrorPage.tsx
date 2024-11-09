import { Box, Button, CircularProgress, Paper, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import componentNames from '../General/Component';
import Grid from '@mui/material/Grid2';
import { useState } from 'react';

interface ErrorMessage {
  errorMessage: string;
  page: string;
}

const ErrorPage = () => {
  //Catch The Data
  const location = useLocation();
  const state = location.state as ErrorMessage;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  // Redirect Automatically
  setTimeout(() => {
    navigate(`/${state?.page}`);
  }, 5000);

  // Redirect Manually
  const onSubmit = async () => {
    setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 500);
      navigate(`/${state?.page}`);
  };

  return <div>
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '97vh' }}>

      <Paper elevation={3} sx={{ padding: 3, width: 800, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: componentNames.BoxRadius, backgroundColor: componentNames.BoxBackgroundColor }}>

        <Typography variant="h3" gutterBottom sx={{ marginBottom: '5%' }}>
          <b>There Have Some Error</b>
        </Typography>

        <form onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <Typography variant="h5" gutterBottom sx={{ marginBottom: '5%', textAlign: 'center' }}>
                <b>{state?.errorMessage}. The System Will Auto Redirect To The {state?.page} Page In 3 Seconds. If No Response Can Click The Below Button To Continue.</b>
              </Typography>
            </Grid>

            <Grid size={12}>
              <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ padding: '10px', backgroundColor: componentNames.ButtonColor }} >
                {loading ? <CircularProgress size={24} /> : `Back To ${state?.page}`}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  </div>
}

export default ErrorPage
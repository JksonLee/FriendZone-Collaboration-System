import { Box, Button, CircularProgress, colors, Paper, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import componentNames from '../General/Component';
import Grid from '@mui/material/Grid2';
import { useEffect, useState } from 'react';
import { refreshPage } from '../General/Functions';

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
  const [timeLeft, setTimeLeft] = useState<number>(5);
  const [isRunning, setIsRunning] = useState<boolean>(true);

  // Redirect Automatically
  setTimeout(() => {
    navigate(`/${state?.page}`);
  }, 5000);

  refreshPage(5002);

  // Effect to manage the countdown timer
  useEffect(() => {
    if (timeLeft === 0) {
      setIsRunning(false);
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [timeLeft]);

  // Format the remaining time as seconds
  const formatTime = (time: number): string => {
    const seconds = time % 60;
    return `${String(seconds).padStart(1)}`;
  };

  // Redirect Manually
  const onSubmit = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
    navigate(`/${state?.page}`);

    refreshPage(2);
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
                <b>{state?.errorMessage}.
                  <br />
                  <br />
                  <i style={{ color: 'dimgray', fontSize: '15px' }}>The System Will Auto Redirect To The {state?.page} Page In {isRunning ? `${formatTime(timeLeft)}` : 'Time is up!'} Seconds. If No Response Can Click The Below Button To Continue.</i>
                </b>
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
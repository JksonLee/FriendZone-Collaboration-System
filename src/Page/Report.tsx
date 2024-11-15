import '../CSS/Home.css'
import names from '../General/Component';
import { Box, List, ListItem, Paper, Typography } from '@mui/material';
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

const Report = () => {
  //Catch The Data
  const location = useLocation();
  const state = location.state as UserInformation;
  const currentUserID = state.currentUserID;
  const theme = state.theme;
  const themeID = state.themeID;
  const userInformationList = { currentUserID, theme, themeID };
  const [userProfileData, setUserProfileData] = useState<any>([]);
  const [userActionData, setUserActionData] = useState<any>([]);


  // Update the CSS variable dynamically
  document.documentElement.style.setProperty('--backgroundImage', `url('${state.theme}')`);

  // Catch Data From DB
  function getUserData() {
    axios.get(names.getProfileByUserID + currentUserID).then((response) => {
      setUserProfileData(response.data);
    });

    axios.get(names.getActionByUserID + currentUserID).then((response) => {
      setUserActionData(response.data);
    })
  }

  useEffect(() => {
    getUserData()
  }, []);

  const sortedRecords = [...userActionData].sort((a: any, b: any) => {
    const dateTimeA = new Date(`${a.date}T${a.time}`);
    const dateTimeB = new Date(`${b.date}T${b.time}`);
    return dateTimeB.getTime() - dateTimeA.getTime();
  });

  console.log(sortedRecords);
  console.log(userActionData);

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
              <ListItem sx={{ marginBottom: 1, padding: 4, width: 1070, color: 'black', maxHeight: '60px', backgroundColor: 'rgba(245, 245, 245, 0.7)', boxShadow: 'none' }}>
                <Grid size={4}>
                  <Typography variant="h4" sx={{ fontSize: '30px', textAlign: 'center' }}><strong>Name</strong></Typography>
                </Grid>
                <Grid size={4}>
                  <Typography variant="h4" sx={{ fontSize: '30px', textAlign: 'center', marginLeft: 2 }}><strong>Date</strong></Typography>
                </Grid>
                <Grid size={4}>
                  <Typography variant="h4" sx={{ fontSize: '30px', textAlign: 'center', marginLeft: 6 }}><strong>Time</strong></Typography>
                </Grid>
                </ListItem>
                {sortedRecords.map((action: any) => {
                  return <div>
                    <ListItem key={action.actionID}>
                      <Paper sx={{ marginBottom: -1, padding: 2, width: 1000, color: 'black', maxHeight: '60px', backgroundColor: 'transparent', boxShadow: 'none' }}>
                        <Grid container spacing={2} alignItems="center">
                          <Grid size={4}>
                            <Typography variant="h4" sx={{ fontSize: '22px', textAlign: 'center' }}>{action.name}</Typography>
                          </Grid>
                          <Grid size={4}>
                            <Typography variant="h4" sx={{ fontSize: '20px', textAlign: 'center' }}><i>{action.date}</i></Typography>
                          </Grid>
                          <Grid size={4}>
                            <Typography variant="h4" sx={{ fontSize: '20px', textAlign: 'center' }}><i>{action.time}</i></Typography>
                          </Grid>
                        </Grid>
                      </Paper>
                    </ListItem>
                    <hr/>
                  </div>
                })}
              </List>
            </Paper>
          </Grid>

          <Grid size={12} sx={{ marginBottom: '-1.5%' }}>
            {BottomMenuBar(userInformationList, "report", userProfileData.photo, userProfileData.name)}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  </div>
}

export default Report
import '../CSS/Home.css'
import names from '../General/Component';
import { Avatar, Box, Button, CircularProgress, List, ListItem, ListItemText, Paper, TextField, Typography } from '@mui/material';
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

interface ProfileList {
  profileID: number;
  name: string;
  photo: string;
  bio: string;
  onlineStatus: string;
  userID: number;
  themeID: number;
}

interface ThemeDetail {
  themeID: number;
  name: string;
  source: string;
}

const AddNewFriend = () => {
  //Catch The Data
  const location = useLocation();
  const state = location.state as UserInformation;
  const currentUserID = state.currentUserID;
  const theme = state.theme;
  const themeID = state.themeID;
  const userInformationList = { currentUserID, theme, themeID };
  const [userProfileData, setUserProfileData] = useState<any>([]);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [allProfileList, setAllProfileList] = useState<ProfileList[]>([]);
  const [filteredAllProfileList, setFilteredAllProfileList] = useState<ProfileList[]>([]);
  const [finalFilteredAllProfileList, setFinalFilteredAllProfileList] = useState<ProfileList[]>([]);
  const [friendThemeDetail, setFriendThemeDetail] = useState<Map<number, ThemeDetail>>(new Map());
  const [loading, setLoading] = useState<boolean>(false);

  // Update the CSS variable dynamically
  document.documentElement.style.setProperty('--backgroundImage', `url('${state.theme}')`);

  // Catch Data From DB
  function getUserData() {
    axios.get(names.getProfileByUserID + currentUserID).then((response) => {
      setUserProfileData(response.data);
    });

    axios.get(names.basicProfileAPI).then((response) => {
      setAllProfileList(response.data);
      setFilteredAllProfileList(response.data);
    })
  }

  function catchAllProfileListDetail() {
    filteredAllProfileList.forEach((profile: any) => {
      axios.get(names.getThemeByID + profile.themeID).then((response) => {
        setFriendThemeDetail(prev => new Map(prev).set(profile.profileID, response.data));
      })
    })
  }

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    catchAllProfileListDetail();
  }, [filteredAllProfileList]);

  function checkOnlineStatus(onlineStatus: any) {
    if (onlineStatus === "Offline") {
      return 'gray'
    } else {
      return 'green'
    }
  }

  console.log(friendThemeDetail);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);

    const filtered = allProfileList.filter((friend) =>
      friend.name.includes(query)
    );
    setFilteredAllProfileList(filtered);
  };

  const handleAddFriend = (friend: ProfileList) => {
    console.log('Add friend:', friend);
    // You could make an API request here to add a friend
  };

  return <div>
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '97vh' }}>

      <Paper elevation={3} sx={{ padding: 3, width: 1100, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: names.BoxRadius, backgroundColor: names.BoxBackgroundColor }}>

        <Grid container spacing={2}>
          <Grid size={12}>
            <TextField label="Search by Name" variant="outlined" fullWidth value={searchQuery} onChange={handleSearchChange} style={{ marginTop: '20px' }} />
          </Grid>

          {loading ? (<CircularProgress />) :
            (<Paper sx={{
              width: 1070, maxHeight: '220px', overflowY: 'auto', padding: 2, backgroundColor: 'transparent', boxShadow: 'none',
              '&::-webkit-scrollbar': { width: '8px' }, '&::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1', borderRadius: '10px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: '10px', '&:hover': { backgroundColor: '#555' } }
            }}>

              <List>
                {filteredAllProfileList.length === 0 ? (<Typography>No friends found.</Typography>) :
                  (filteredAllProfileList.map((friend) => (
                    <ListItem key={friend.profileID}>
                      <Paper sx={{ marginBottom: 2, padding: 2, width: 1000, backgroundImage: `url('${friendThemeDetail.get(friend.profileID)?.source}')`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center', color: 'black', borderRadius: '40px', maxHeight: '60px' }}>
                        <Grid container spacing={2} alignItems="center">
                          <Grid size={2} >
                            <Avatar alt={friend.name} src={friend.photo} sx={{ width: 55, height: 55, alignItems: 'center', border: '5px solid', borderColor: checkOnlineStatus(friend.onlineStatus) }} />
                          </Grid>
                          <Grid size={3}>
                            <Typography variant="h4" sx={{ fontSize: '30px' }}><strong>{friend.name}</strong></Typography>
                          </Grid>
                          <Grid size={5}>
                          </Grid>
                          <Grid size={1}>
                          </Grid>
                          <Grid size={1}>
                            <Button variant="contained" style={{ backgroundColor: "rgba(105, 105, 105, 0.5)" }} onClick={() => handleAddFriend(friend)}>
                              Add
                            </Button>
                          </Grid>
                        </Grid>
                      </Paper>
                    </ListItem>
                  ))
                  )}
              </List>
            </Paper>
            )}

          <Grid size={12} sx={{ marginBottom: '-1.5%' }}>
            {BottomMenuBar(userInformationList, "search", userProfileData.photo, userProfileData.name)}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  </div>
}

export default AddNewFriend
import '../CSS/Home.css'
import names from '../General/Component';
import { Avatar, Box, Button, Modal, Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useLocation, useNavigate } from 'react-router-dom';
import BottomMenuBar from '../General/BottomMenuBar';
import axios from 'axios';
import { useEffect, useState } from 'react';
import ProfileDisplayFormat from '../General/ProfileDisplayFormat';
import { refreshPage } from '../General/Functions';
import EditProfile from './EditProfile';

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
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [openEdit, setOpenEdit] = useState(false);
  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => setOpenEdit(false);
  const [openDelete, setOpenDelete] = useState(false);
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);
  const navigate = useNavigate();

  //Background Modal Design
  const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    borderRadius: '20px',
    boxShadow: 24,
    p: 4,
  };

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

  function checkOnlineStatus() {
    if (userProfileData.onlineStatus === "Offline") {
      setIsOnline(false);
    } else {
      setIsOnline(true);
    }
  }

  useEffect(() => {
    getUserData();
    checkOnlineStatus();
  }, []);

  function handleLogOut() {
    navigate('/');
    refreshPage(2);
  }

  function changeInform(profileUpdateInformation: any) {
    axios.put(names.basicProfileAPI, profileUpdateInformation)
      .then((response) => {
        setUserProfileData(response.data)
      })
  }

  return <div>
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '97vh' }}>

      <Paper elevation={3} sx={{ padding: 3, width: 1100, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: names.BoxRadius, backgroundColor: names.BoxBackgroundColor }}>

        <Grid container spacing={2}>
          {/* Icon */}
          <Grid size={5}></Grid>
          <Grid size={2}>
            <Avatar src={userProfileData.photo} sx={{
              width: 170, height: 170, alignItems: 'center', marginTop: '-68%',
              border: '8px solid', // Border width
              borderColor: isOnline ? 'green' : 'gray', // Border color (green if online, gray if offline)
            }} />
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

          <Grid size={4}>
            <Button onClick={handleOpenDelete} fullWidth sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: names.ButtonColor, color: 'whitesmoke' }}>Delete Account</Button>
            <Modal open={openDelete} onClose={handleCloseDelete} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={modalStyle}>
                  <Typography id="modal-modal-title" variant="h4" component="h2" sx={{ textAlign: 'center', marginBottom: 4, color: 'red' }}>
                    DELETE YOUR ACCOUNT?
                  </Typography>
                  <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    {/* <EditInform add={changeInform} /> */}
                  </Typography>
                </Box>
              </Modal>
          </Grid>

          <Grid size={4}>
              <Button onClick={handleOpenEdit} fullWidth sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: names.ButtonColor, color: 'whitesmoke' }}>Edit</Button>
              <Modal open={openEdit} onClose={handleCloseEdit} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={modalStyle}>
                  <Typography id="modal-modal-title" variant="h5" component="h2" sx={{ textAlign: 'center', marginBottom: 4, color: 'black' }}>
                    Edit Your Profile Detail
                  </Typography>
                  <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    <EditProfile add={changeInform} name={userProfileData.name} bio={userProfileData.bio} photo={userProfileData.photo} onlineStatus={userProfileData.onlineStatus} />
                  </Typography>
                </Box>
              </Modal>
          </Grid>

          <Grid size={4}>
            <Button onClick={handleLogOut} fullWidth sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: names.ButtonColor, color: 'whitesmoke' }}>Log Out</Button>
          </Grid>

          <Grid size={12} sx={{ marginBottom: '-1.5%' }}>
            {BottomMenuBar(userInformationList, "profile", userProfileData.photo, userProfileData.name)}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  </div>
}

export default Profile
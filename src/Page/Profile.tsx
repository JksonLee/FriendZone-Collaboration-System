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
import { toast, ToastContainer } from 'react-toastify';

interface UserInformation {
  currentUserID: number;
  theme: string;
  themeID: number;
}

interface ActionInformation {
  name: string;
  date: any;
  time: any;
  userID: number;
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
  let actionInformation: ActionInformation;
  const now = new Date();

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

    axios.get(names.getUserByID + currentUserID).then((response) => {
      setUserData(response.data);
    });
  }

  function checkOnlineStatus() {
    axios.get(names.getProfileByUserID + currentUserID).then((response) => {
      if (response.data.onlineStatus === "Offline") {
        setIsOnline(false);
      } else {
        setIsOnline(true);
      }
    });
  }

  useEffect(() => {
    getUserData();
    checkOnlineStatus();
  }, []);

  function handleLogOut() {
    const currentDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;

    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;


    actionInformation = { name: "Logout", date: currentDate, time: currentTime, userID: currentUserID };

    axios.post(names.basicActionAPI, actionInformation);

    navigate('/');
    refreshPage(2);
  }

  function handleDeleteAccount() {
    axios.delete(names.getReportByUserID + currentUserID);
    axios.delete(names.getMessageByUserID + currentUserID);
    axios.delete(names.getFriendByUserID + currentUserID);
    axios.delete(names.getCalendarByUserID + currentUserID);
    axios.delete(names.getActionByUserID + currentUserID);
    axios.delete(names.getChatByUserID + currentUserID);
    axios.delete(names.getProfileByUserID + currentUserID);
    axios.delete(names.getUserByID + currentUserID);

    //Success Alert
    toast.success('Delete Successful~', {
      position: 'top-center',
      autoClose: 2000,
      hideProgressBar: true,
      style: {
        backgroundColor: names.BoxBackgroundColor,
        color: names.TextColor,
        borderRadius: '8px',
      },
    });

    setTimeout(() => {
      navigate('/');
      refreshPage(2);
    }, 2000);
  }

  return <div>
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '97vh' }}>

      <Paper elevation={3} sx={{ padding: 3, width: 1100, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: names.BoxRadius, backgroundColor: names.BoxBackgroundColor }}>

        <Grid container spacing={2}>
          {/* Icon */}
          <Grid size={5}></Grid>
          <Grid size={2}>
            <Avatar src={userProfileData.photo} sx={{ width: 170, height: 170, alignItems: 'center', marginTop: '-68%', border: '8px solid', borderColor: isOnline ? 'green' : 'gray' }} />
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

                  <Grid size={12} sx={{ color: 'black' }}>
                    <Typography>
                      The Account Will Be <b>PERMENENTLY DELETE</b> And It Will Not Be Able To Recover Back, Are You Sure You Wanted To Delete Your Account.
                    </Typography>
                  </Grid>

                  <br />
                  <br />

                  <Grid size={6}>
                    <Button onClick={handleDeleteAccount} variant="contained" fullWidth sx={{ padding: '10px', backgroundColor: names.DeleteButton, marginBottom: '2%' }}>
                      Delete
                    </Button>
                  </Grid>
                  <Grid size={6}>
                    <Button onClick={handleCloseDelete} variant="contained" fullWidth sx={{ padding: '10px', backgroundColor: names.ButtonColor }}>
                      Cancel
                    </Button>
                  </Grid>

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
                  <EditProfile profileID={userProfileData.profileID} name={userProfileData.name} bio={userProfileData.bio} photo={userProfileData.photo} onlineStatus={userProfileData.onlineStatus} themeID={userProfileData.themeID} userID={userProfileData.userID} />
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
        <ToastContainer />
      </Paper>
    </Box>
  </div>
}

export default Profile
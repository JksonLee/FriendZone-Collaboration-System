import '../CSS/Home.css'
import names from '../General/Component';
import { Avatar, Box, Button, Modal, Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import ProfileDisplayFormat from '../General/ProfileDisplayFormat';
import { refreshPage } from '../General/Functions';
import { toast, ToastContainer } from 'react-toastify';
import EditFriendProfile from './EditFriendProfile';

interface DetailInformation {
    currentUserID: number;
    theme: string;
    themeID: number;
    friendID: number;
    name: string;
    position: string;
    status: string;
    profileID: number;
    userID: number;
    friendThemeSource: string;
}

const FriendProfile = () => {
    //Catch The Data
    const location = useLocation();
    const state = location.state as DetailInformation;
    const currentUserID = state.currentUserID;
    const theme = state.theme;
    const themeID = state.themeID;
    const friendID = state.friendID;
    const name = state.name;
    const position = state.position;
    const status = state.status;
    const profileID = state.profileID;
    const userID = state.userID;
    const friendThemeSource =  state.friendThemeSource;
    const detailInformationList = { currentUserID, theme, themeID, friendID, name, position, status, profileID, userID, friendThemeSource };
    const currentUserInformationList = { currentUserID, theme, themeID };
    const [currentUserName, setCurrentUserName] = useState<any>();
    const [friendProfileData, setFriendProfileData] = useState<any>([]); 
    const [friendData, setFriendData] = useState<any>([]);
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
    document.documentElement.style.setProperty('--backgroundImage', `url('${state.friendThemeSource}')`);

    //Get User Profile Information
    function getUserData() {
        axios.get(names.getProfileByID + profileID).then((response) => {
            setFriendProfileData(response.data);
            axios.get(names.getUserByID + response.data.userID).then((response) => {
                setFriendData(response.data);
            });
        });

        axios.get(names.getProfileByUserID + currentUserID).then((response) => {
            setCurrentUserName(response.data.name);
        })
    }

    function checkOnlineStatus() {
        axios.get(names.getProfileByID + profileID).then((response) => {
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

    function handleDeleteFriend() {
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

        axios.get(names.getProfileByID + profileID).then((response) => {
            axios.get(names.getFriendByUserID + response.data.userID).then((response) => {
              (response.data).forEach((element: any) => {
                if (element.name === currentUserName) {
                  if (element.status === "Accept") {
                    axios.delete(names.getFriendByID + element.friendID);
                  }
                }
              });
            })
          })
      
          axios.delete(names.getFriendByID + friendID);

        setTimeout(() => {
            navigate('/FriendList', { state: currentUserInformationList });
            refreshPage(2);
        }, 900);
    }

    function handleBackToFriendList() {
        navigate('/FriendList', { state: currentUserInformationList });
        refreshPage(2);
    }

    return <div>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '97vh' }}>

            <Paper elevation={3} sx={{ padding: 3, width: 1100, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: names.BoxRadius, backgroundColor: names.BoxBackgroundColor }}>

                <Grid container spacing={2}>
                    {/* Icon */}
                    <Grid size={5}></Grid>
                    <Grid size={2}>
                        <Avatar src={friendProfileData.photo} sx={{ width: 170, height: 170, alignItems: 'center', marginTop: '-68%', border: '8px solid', borderColor: isOnline ? 'green' : 'gray' }} />
                    </Grid>
                    <Grid size={5}></Grid>

                    {/* Information */}
                    <Grid size={6} sx={{ textAlign: 'center', marginTop: '2%' }}>
                        <ProfileDisplayFormat title="Name" content={friendProfileData.name} />
                    </Grid>
                    <Grid size={6} sx={{ textAlign: 'center', marginTop: '2%' }}>
                        <ProfileDisplayFormat title="Position" content={detailInformationList.position} />
                    </Grid>
                    <Grid size={12} sx={{ textAlign: 'center', marginTop: '2%', marginBottom: 2 }}>
                        <Box sx={{ maxWidth: '80%', marginLeft: '10%' }}>
                            <ProfileDisplayFormat title="About Me" content={friendProfileData.bio} />
                        </Box>
                    </Grid>

                    <Grid size={4}>
                        <Button onClick={handleOpenDelete} fullWidth sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: names.ButtonColor, color: 'whitesmoke' }}>Delete Friend</Button>
                        <Modal open={openDelete} onClose={handleCloseDelete} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                            <Box sx={modalStyle}>
                                <Typography id="modal-modal-title" variant="h4" component="h2" sx={{ textAlign: 'center', marginBottom: 4, color: 'red' }}>
                                    DELETE FRIEND?
                                </Typography>
                                <Typography id="modal-modal-description" sx={{ mt: 2 }}>

                                    <Grid size={12} sx={{ color: 'black' }}>
                                        <Typography>
                                            The Friend Will Be <b>PERMENENTLY DELETE</b> And It Will Remove From Your Friend List, Are You Sure You Wanted To Delete Your Account.
                                        </Typography>
                                    </Grid>

                                    <br />
                                    <br />

                                    <Grid size={6}>
                                        <Button onClick={handleDeleteFriend} variant="contained" fullWidth sx={{ padding: '10px', backgroundColor: names.DeleteButton, marginBottom: '2%' }}>
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
                                    Edit Friend Position
                                </Typography>
                                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                    <EditFriendProfile detailInformationList={detailInformationList} />
                                </Typography>
                            </Box>
                        </Modal>
                    </Grid>

                    <Grid size={4}>
                        <Button onClick={handleBackToFriendList} fullWidth sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: names.ButtonColor, color: 'whitesmoke' }}>Back</Button>
                    </Grid>
                </Grid>
                <ToastContainer />
            </Paper>
        </Box>
    </div>
}

export default FriendProfile
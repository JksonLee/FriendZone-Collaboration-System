import '../CSS/Home.css'
import names from '../General/Component';
import { Box, Button, List, ListItem, Modal, Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useLocation, useNavigate } from 'react-router-dom';
import BottomMenuBar from '../General/BottomMenuBar';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ScheduleXCalendar, useCalendarApp } from '@schedule-x/react';
import { createViewWeek, createViewMonthGrid, createViewDay, createViewMonthAgenda, } from '@schedule-x/calendar'
import '@schedule-x/theme-default/dist/calendar.css'
import { createEventModalPlugin } from '@schedule-x/event-modal'
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import '@schedule-x/theme-default/dist/index.css'
import AddIcon from '@mui/icons-material/Add';
import AddNewRemark from './AddNewRemark';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import ModifyRemark from './ModifyRemark';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

interface UserInformation {
  currentUserID: number;
  theme: string;
  themeID: number;
}

const Calendar = () => {
  // //Catch The Data
  const location = useLocation();
  const state = location.state as UserInformation;
  const currentUserID = state.currentUserID;
  const theme = state.theme;
  const themeID = state.themeID;
  const userInformationList = { currentUserID, theme, themeID };
  const [userProfileData, setUserProfileData] = useState<any>([]);
  const [userCalendarData, setUserCalendarData] = useState<any>([]);
  const [openAdd, setOpenAdd] = useState(false);
  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);
  const [openModify, setOpenModify] = useState(false);
  const handleOpenModify = () => setOpenModify(true);
  const handleCloseModify = () => setOpenModify(false);
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
    width: 700,
    bgcolor: 'background.paper',
    borderRadius: '20px',
    boxShadow: 24,
    p: 4,
  };

  // Update the CSS variable dynamically
  document.documentElement.style.setProperty('--backgroundImage', `url('${state.theme}')`);

  // Catch Data From DB
  function getUserData() {
    axios.get(names.getProfileByUserID + currentUserID).then((response) => {
      setUserProfileData(response.data);
    });

    axios.get(names.getCalendarByUserID + currentUserID).then(response => {
      setUserCalendarData(response.data);
    })
  }

  const plugins = [createEventsServicePlugin(), createEventModalPlugin()]

  const calendar = useCalendarApp({
    views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
    events: [],
  }, plugins)

  function catchEventFromDB() {
    userCalendarData.forEach((element: any) => {
      const combinedStart: string = `${element.startDate} ${element.startTime}`;
      const combinedEnd: string = `${element.endDate} ${element.endTime}`;
      calendar.eventsService.add({
        id: element.remarkID,
        title: element.inform,
        start: combinedStart,
        end: combinedEnd,
        description: element.inform,
      })
    });
  }

  function handleModify(remark: any) {
    const remarkDetail = { remarkID: remark.remarkID, inform: remark.inform, startDate: remark.startDate, startTime: remark.startTime, endDate: remark.endDate, endTime: remark.endTime, currentUserID: currentUserID, theme: theme, themeID: themeID }
    navigate('/ModifyRemark', { state: remarkDetail })

  }

  useEffect(() => {
    getUserData()
  }, []);

  useEffect(() => {
    catchEventFromDB()
    // get all events
    calendar.eventsService.getAll()
  }, [userCalendarData]);

  return <div>
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '97vh' }}>

      <Paper elevation={3} sx={{ padding: 3, width: 1100, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: names.BoxRadius, backgroundColor: names.BoxBackgroundColor }}>

        <Grid container spacing={2}>
          <Grid size={9}></Grid>

          <Grid size={1}>
            <Button onClick={handleOpenAdd} fullWidth sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: names.ButtonColor, color: 'whitesmoke' }}><AddIcon fontSize="small" /></Button>
            <Modal open={openAdd} onClose={handleCloseAdd} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
              <Box sx={modalStyle}>
                <Typography id="modal-modal-title" variant="h4" component="h2" sx={{ textAlign: 'center', marginBottom: 4, color: 'black' }}>
                  Add A New Remark To Your Calendar
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  <Grid size={12} sx={{ color: 'black' }}>
                    <Typography>
                      <AddNewRemark currentUserID={currentUserID} userInformationList={userInformationList} />
                    </Typography>
                  </Grid>
                </Typography>
              </Box>
            </Modal>
          </Grid>
          <Grid size={1}>
            <Button onClick={handleOpenModify} fullWidth sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: names.ButtonColor, color: 'whitesmoke' }}><ModeEditIcon fontSize="small" /></Button>
            <Modal open={openModify} onClose={handleCloseModify} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
              <Box sx={modalStyle}>
                <Typography id="modal-modal-title" variant="h4" component="h2" sx={{ textAlign: 'center', marginBottom: 4, color: 'black' }}>
                  Modify Remark
                </Typography>
                <Paper
                  sx={{
                    width: 550, maxHeight: '380px', overflowY: 'auto', padding: 2, backgroundColor: 'transparent', boxShadow: 'none',
                    '&::-webkit-scrollbar': { width: '8px' }, '&::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1', borderRadius: '10px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: '10px', '&:hover': { backgroundColor: '#555' } }
                  }}>
                  <List>
                    {userCalendarData.map((remark: any) => {
                      return <div>
                        <ListItem key={remark.remarkID} onClick={() => handleModify(remark)}>
                          <Paper sx={{ marginBottom: -1, padding: 2, width: 550, color: 'black', maxHeight: '60px', backgroundColor: 'transparent', boxShadow: 'none' }}>
                            <Grid container spacing={1} alignItems="center">
                              <Grid size={2}>
                                <Typography variant="h4" sx={{ fontSize: '18px', textAlign: 'center' }}>{remark.inform}</Typography>
                              </Grid>
                              <Grid size={4}>
                                <Typography variant="h4" sx={{ fontSize: '14px', textAlign: 'center', marginLeft: '5%' }}><i>{remark.startDate}_{remark.startTime}</i></Typography>
                              </Grid>
                              <Grid size={3}>
                                <Typography variant="h4" sx={{ fontSize: '14px', textAlign: 'center', marginLeft: '-10%' }}><i>{remark.endDate}_{remark.endTime}</i></Typography>
                              </Grid>
                              <Grid size={1}>
                                <Button onClick={handleOpenEdit} fullWidth sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: names.ButtonColor, color: 'whitesmoke' }}><EditNoteIcon fontSize="small" /></Button>
                                <Modal open={openEdit} onClose={handleCloseEdit} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                                  <Box sx={modalStyle}>
                                    <Typography id="modal-modal-title" variant="h4" component="h2" sx={{ textAlign: 'center', marginBottom: 4, color: 'red' }}>
                                      Edit Specific Remark
                                    </Typography>
                                    {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                      <Grid size={12} sx={{ color: 'black' }}>
                                      </Grid>
                                    </Typography> */}
                                  </Box>
                                </Modal>
                              </Grid>
                              {/* <Grid size={1}></Grid>
                              <Grid size={1}>
                                <Button onClick={handleOpenDelete} fullWidth sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: names.ButtonColor, color: 'whitesmoke' }}><DeleteForeverIcon fontSize="small" /></Button>
                                <Modal open={openDelete} onClose={handleCloseDelete} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                                  <Box sx={modalStyle}>
                                    <Typography id="modal-modal-title" variant="h4" component="h2" sx={{ textAlign: 'center', marginBottom: 4, color: 'red' }}>
                                      Delete Remark From Your Calendar
                                    </Typography>
                                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                      <Grid size={12} sx={{ color: 'black' }}>
                                        <Typography>
                                          The Remark Will Be <b>PERMENENTLY DELETE</b> And It Will Not Be Able To Recover Back, Are You Sure You Wanted To Delete Your Remark.
                                        </Typography>
                                      </Grid>

                                      <br />
                                      <br />

                                      <Grid size={6}>
                                        <Button onClick={deleteEvent} variant="contained" fullWidth sx={{ padding: '10px', backgroundColor: names.DeleteButton, marginBottom: '2%' }}>
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
                              </Grid> */}
                            </Grid>
                          </Paper>
                        </ListItem>
                        <hr />
                      </div>
                    })}
                  </List>
                </Paper>
              </Box>
            </Modal>
          </Grid>

          <Grid size={1}></Grid>

          <Grid size={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Paper
              sx={{
                width: 1060, maxHeight: '420px', overflowY: 'auto', padding: 2, backgroundColor: 'transparent', boxShadow: 'none',
                '&::-webkit-scrollbar': { width: '8px' }, '&::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1', borderRadius: '10px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: '10px', '&:hover': { backgroundColor: '#555' } }
              }}>

              <ScheduleXCalendar calendarApp={calendar} />

            </Paper>
          </Grid>

          <Grid size={12} sx={{ marginBottom: '-1.5%' }}>
            {BottomMenuBar(userInformationList, "calendar", userProfileData.photo, userProfileData.name)}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  </div>
}

export default Calendar
import { Button, TextField, CircularProgress, Box, Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import names from '../General/Component';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { refreshPage } from '../General/Functions';

interface RemarkForm {
    inform: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    userID: number;
}

interface UserAndRemarkInformation {
    remarkID: number;
    inform: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    currentUserID: number;
    theme: string;
    themeID: number;
}


const ModifyRemark = () => {
    //Catch The Data
    const { control, handleSubmit, formState: { errors }, getValues } = useForm<RemarkForm>();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as UserAndRemarkInformation;
    const remarkID = state.remarkID;
    const inform = state.inform;
    const startDate = state.startDate;
    const startTime = state.startTime;
    const endDate = state.endDate;
    const endTime = state.endTime;
    const currentUserID = state.currentUserID;
    const theme = state.theme;
    const themeID = state.themeID;
    const userInformationList = { currentUserID, theme, themeID };
    const [clickedButton, setClickedButton] = useState<string>("");

    // Update the CSS variable dynamically
    document.documentElement.style.setProperty('--backgroundImage', `url('${state.theme}')`);

    const handleButtonClick = (buttonName: string) => {
        setClickedButton(buttonName);
    };

    //Submit Form
    const onSubmit = async (data: RemarkForm) => {
        console.log(clickedButton);
        setLoading(true);
        if (clickedButton === "Submit") {
            const updateRemark = {remarkID: remarkID, inform: data.inform, startDate: data.startDate, startTime: data.startTime, endDate: data.endDate, endTime: data.endTime, userID: currentUserID}
            axios.put(names.basicCalendarAPI, updateRemark)
            navigate('/Calendar', { state: userInformationList })
            refreshPage(2);

        } else if (clickedButton === "Delete") {
            axios.delete(names.getCalendarByID + remarkID)
            navigate('/Calendar', { state: userInformationList })
            refreshPage(2);

        } else if (clickedButton === "Cancle") {
            navigate('/Calendar', { state: userInformationList })
            refreshPage(2);
        }
    };


    return <div>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '97vh' }}>
            <Paper elevation={3} sx={{ padding: 3, width: 500, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: names.BoxRadius, backgroundColor: names.BoxBackgroundColor }}>
                <Grid container spacing={1}>
                    <form onSubmit={handleSubmit(onSubmit)}>

                        <Typography id="modal-modal-title" variant="h4" component="h2" sx={{ textAlign: 'center', marginBottom: 4, color: 'black' }}>
                            Modify Remark {remarkID}
                        </Typography>

                        {/* Inform Field */}
                        <Grid size={12} sx={{ marginBottom: '6%' }}>
                            <Controller name="inform" control={control} defaultValue={inform} rules={{ required: 'Information is required', pattern: { value: /^[a-zA-Z0-9_]{2,}$/, message: 'Invalid information format, only accept alphabet, number and underscroll' } }}
                                render={({ field }) => (
                                    <TextField {...field} label="Information" fullWidth variant="outlined" error={!!errors.inform} helperText={errors.inform?.message} />)} />
                        </Grid>

                        {/* Strat Date Field */}
                        <Grid size={12} sx={{ marginBottom: '6%' }}>
                            <Controller name="startDate" control={control} defaultValue={startDate} rules={{ required: 'Start Date is required' }}
                                render={({ field }) => (
                                    <TextField {...field} label="Start Date" type="date" InputLabelProps={{ shrink: true }} fullWidth variant="outlined" error={!!errors.startDate} helperText={errors.startDate?.message} />)} />
                        </Grid>

                        {/* Strat Time Field */}
                        <Grid size={12} sx={{ marginBottom: '6%' }}>
                            <Controller name="startTime" control={control} defaultValue={startTime} rules={{ required: 'Start Time is required' }}
                                render={({ field }) => (
                                    <TextField {...field} label="Start Time" type="time" fullWidth variant="outlined" error={!!errors.startTime} helperText={errors.startTime?.message} />)} />
                        </Grid>

                        {/* end Date Field */}
                        <Grid size={12} sx={{ marginBottom: '6%' }}>
                            <Controller name="endDate" control={control} defaultValue={endDate} rules={{ required: 'End Date is required', validate: (value) => value >= getValues('startDate') || 'End Date Must Larger Than Start Time' }}
                                render={({ field }) => (
                                    <TextField {...field} label="End Date" type="date" InputLabelProps={{ shrink: true }} fullWidth variant="outlined" error={!!errors.endDate} helperText={errors.endDate?.message} />)} />
                        </Grid>

                        {/* End Time Field */}
                        <Grid size={12} sx={{ marginBottom: '6%' }}>
                            <Controller name="endTime" control={control} defaultValue={endTime} rules={{ required: 'End Time is required', validate: (value) => value >= getValues('startTime') || 'End Time Must Larger Than Start Time' }}
                                render={({ field }) => (
                                    <TextField {...field} label="End Time" type="time" fullWidth variant="outlined" error={!!errors.endTime} helperText={errors.endTime?.message} />)} />
                        </Grid>


                        {/* Submit Button */}
                        <Grid size={12} sx={{ marginBottom: '6%' }}>
                            <Button type="submit" onClick={() => handleButtonClick("Submit")} variant="contained" fullWidth disabled={loading} sx={{ padding: '10px', backgroundColor: names.EditButton }}>
                                {loading ? <CircularProgress size={24} /> : 'Edit'}
                            </Button>
                        </Grid>
                        <Grid size={12} sx={{ marginBottom: '6%' }}>
                            <Button type="submit" onClick={() => handleButtonClick("Delete")} variant="contained" fullWidth disabled={loading} sx={{ padding: '10px', backgroundColor: names.DeleteButton }}>
                                {loading ? <CircularProgress size={24} /> : 'Delete'}
                            </Button>
                        </Grid>
                        <Grid size={12}>
                            <Button type="submit" onClick={() => handleButtonClick("Cancle")} variant="contained" fullWidth disabled={loading} sx={{ padding: '10px', backgroundColor: names.ButtonColor }}>
                                {loading ? <CircularProgress size={24} /> : 'Cancle'}
                            </Button>
                        </Grid>
                    </form>
                    <ToastContainer />
                </Grid>
            </Paper>
        </Box>


    </div>
};

export default ModifyRemark;
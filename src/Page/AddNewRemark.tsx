import { Button, TextField, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import names from '../General/Component';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { refreshPage } from '../General/Functions';

interface RemarkForm {
    inform: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    userID: number;
}


const EditProfile: React.FC<any> = ({currentUserID, userInformationList}) => {
    //Catch The Data
    const { control, handleSubmit, formState: { errors }, getValues } = useForm<RemarkForm>();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    //Submit Form
    const onSubmit = async (data: RemarkForm) => {
        console.log(data);
        setLoading(true);

        const newRemark = { inform: data.inform, startDate: data.startDate, startTime: data.startTime, endDate: data.endDate, endTime: data.endTime, userID: currentUserID }

        axios.post(names.basicCalendarAPI, newRemark);
        navigate('/Calendar', { state: userInformationList });
        refreshPage(2);
    };


    return <div>
        <form onSubmit={handleSubmit(onSubmit)}>
            {/* Inform Field */}
            <Grid size={12} sx={{ marginBottom: '3%' }}>
                <Controller name="inform" control={control} rules={{ required: 'Information is required', pattern: { value: /^[a-zA-Z0-9_]{2,}$/, message: 'Invalid information format, only accept alphabet, number and underscroll' } }}
                    render={({ field }) => (
                        <TextField {...field} label="Information" fullWidth variant="outlined" error={!!errors.inform} helperText={errors.inform?.message} />)} />
            </Grid>

            {/* Strat Date Field */}
            <Grid size={12} sx={{ marginBottom: '3%' }}>
                <Controller name="startDate" control={control} rules={{ required: 'Start Date is required' }}
                    render={({ field }) => (
                        <TextField {...field}  label="Start Date" type="date" InputLabelProps={{ shrink: true }} fullWidth variant="outlined" error={!!errors.startDate} helperText={errors.startDate?.message} />)} />
            </Grid>

            {/* Strat Time Field */}
            <Grid size={12} sx={{ marginBottom: '3%' }}>
                <Controller name="startTime" control={control} rules={{ required: 'Start Time is required' }}
                    render={({ field }) => (
                        <TextField {...field}  label="Start Time" type="time" fullWidth variant="outlined" error={!!errors.startTime} helperText={errors.startTime?.message} />)} />
            </Grid>

            {/* end Date Field */}
            <Grid size={12} sx={{ marginBottom: '3%' }}>
                <Controller name="endDate" control={control} rules={{ required: 'End Date is required', validate: (value) => value >= getValues('startDate') || 'End Date Must Larger Than Start Time' }}
                    render={({ field }) => (
                        <TextField {...field} label="End Date" type="date" InputLabelProps={{ shrink: true }} fullWidth variant="outlined" error={!!errors.endDate} helperText={errors.endDate?.message} />)} />
            </Grid>

            {/* End Time Field */}
            <Grid size={12} sx={{ marginBottom: '3%' }}>
                <Controller name="endTime" control={control} rules={{ required: 'End Time is required', validate: (value) => value >= getValues('startTime') || 'End Time Must Larger Than Start Time' }}
                    render={({ field }) => (
                        <TextField {...field} label="End Time" type="time" fullWidth variant="outlined" error={!!errors.endTime} helperText={errors.endTime?.message} />)} />
            </Grid>
            

            {/* Submit Button */}
            <Grid size={12}>
                <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ padding: '10px', backgroundColor: names.ButtonColor }}>
                    {loading ? <CircularProgress size={24} /> : 'Add'}
                </Button>
            </Grid>
        </form>
        <ToastContainer />
    </div>
};

export default EditProfile;
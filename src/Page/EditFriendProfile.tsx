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


const EditFriendProfile: React.FC<any> = ({ detailInformationList }) => {
    //Catch The Data
    const { control, handleSubmit, formState: { errors } } = useForm<DetailInformation>();
    const detailInformation: DetailInformation = detailInformationList;
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    //Submit Form
    const onSubmit = async (data: DetailInformation) => {
        setLoading(true);

        const updateInformation = { friendID: detailInformation.friendID, name: detailInformation.name, position: data.position, status: detailInformation.status, profileID: detailInformation.profileID, userID: detailInformation.userID };

        axios.put(names.basicFriendAPI, updateInformation);

        const detailInformations = { currentUserID: detailInformation.currentUserID, theme: detailInformation.theme, themeID: detailInformation.themeID, friendID: detailInformation.friendID, name: detailInformation.name, position: updateInformation.position, status: detailInformation.status, profileID: detailInformation.profileID, userID: detailInformation.userID, friendThemeSource: detailInformation.friendThemeSource }

        navigate('/FriendProfile', { state: detailInformations });
        refreshPage(2);
    };


    return <div>
        <form onSubmit={handleSubmit(onSubmit)}>
            {/* Name Field */}
            <Grid size={12} sx={{ marginBottom: '3%' }}>
                <Controller name="position" control={control} defaultValue={detailInformation.position} rules={{ required: 'Position is required', pattern: { value: /^[a-zA-Z0-9_]{2,}$/, message: 'Invalid position format, only accept alphabet, number and underscroll' } }}
                    render={({ field }) => (
                        <TextField {...field} label="Position" fullWidth variant="outlined" error={!!errors.position} helperText={errors.position?.message} />)} />
            </Grid>

            {/* Submit Button */}
            <Grid size={12}>
                <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ padding: '10px', backgroundColor: names.EditButton }}>
                    {loading ? <CircularProgress size={24} /> : 'Done Edit'}
                </Button>
            </Grid>
        </form>
        <ToastContainer />
    </div>
};

export default EditFriendProfile;
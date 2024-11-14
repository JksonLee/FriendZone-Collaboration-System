import { Button, TextField, CircularProgress, Select, MenuItem } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import names from '../General/Component';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { refreshPage } from '../General/Functions';

interface ProfileRegisterForm {
    name: string;
    photo: string;
    bio: string;
    onlineStatus: string;
    themeID: number;
}

interface UserInformation2 {
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

interface ErrorMessage {
    errorMessage: string;
    page: string;
}


const EditProfile: React.FC<any> = ({ profileID, name, bio, photo, onlineStatus, themeID, userID }) => {
    //Catch The Data
    const { control, handleSubmit, formState: { errors } } = useForm<ProfileRegisterForm>();
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [theme, setTheme] = useState<any>([]);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    let errorMessage: ErrorMessage;
    let userInformation: UserInformation2;
    let actionInformation: ActionInformation;
    const now = new Date();

    // useEffect(() => {

    //     setValue('name', name);
    //     setValue('photo', bio);
    //     setValue('bio', photo);
    //     setValue('onlineStatus', onlineStatus);

    // }, []);

    //Catch Theme From DB
    function catchTheme() {
        axios.get(names.basicThemeAPI).then((response) => {
            setTheme(response.data);
        });
    }

    useEffect(() => {
        catchTheme();
    }, []);


    //Change Image Into Base64
    function handleChange(e: any) {
        const file = e.target.files?.[0];
        if (file) {
            // Check if the file is an image
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();

                reader.onloadend = () => {
                    // The base64 string will be available here
                    setImageBase64(reader.result as string);
                };

                //Convert file to base64
                reader.readAsDataURL(file);
            } else {
                setError('Please upload a valid image file');
            }
        }
    }

    //Submit Form
    const onSubmit = async (data: ProfileRegisterForm) => {
        setLoading(true);

        if (imageBase64 == null || imageBase64 == undefined) {
            const updateInformation = { profileID: profileID, name: data.name, photo: photo, bio: data.bio, onlineStatus: data.onlineStatus, userID: userID, themeID: data.themeID };

            axios.put(names.basicProfileAPI, updateInformation);

            axios.get(names.getFriendByUserName + name).then((response) => {
                let friendListByName:any = response.data;

                friendListByName.forEach((element:any) => {
                    let friendDetail = {friendID: element.friendID, name: updateInformation.name, position: element.position, status: element.status, profileID: element.profileID, userID: element.userID}

                    axios.put(names.basicFriendAPI, friendDetail);
                });
            })

            axios.get(names.getThemeByID + updateInformation.themeID).then((response) => {
                setTimeout(() => {
                    setLoading(false);
                }, 1500);

                userInformation = { currentUserID: updateInformation.userID, theme: response.data.source, themeID: updateInformation.themeID }
                navigate('/Profile', { state: userInformation });
                refreshPage(2);
            });


        } else if (imageBase64 !== null || imageBase64 !== undefined) {
            const updateInformation = { profileID: profileID, name: data.name, photo: imageBase64, bio: data.bio, onlineStatus: data.onlineStatus, userID: userID, themeID: data.themeID };

            axios.put(names.basicProfileAPI, updateInformation);

            axios.get(names.getThemeByID + updateInformation.themeID).then((response) => {
                setTimeout(() => {
                    setLoading(false);
                }, 1500);

                userInformation = { currentUserID: updateInformation.userID, theme: response.data.source, themeID: updateInformation.themeID }
                navigate('/Profile', { state: userInformation });
                refreshPage(2);
            });
        } else {
            setTimeout(() => {
                setLoading(false);
            }, 1500);

            //Redirect User To Error Page
            errorMessage = { errorMessage: "Edit Profile Have Error, Please Try Again~", page: "Profile" };
            navigate('/ErrorPage', { state: errorMessage });
        }
    };


    return <div>
        <form onSubmit={handleSubmit(onSubmit)}>
            {/* Name Field */}
            <Grid size={12} sx={{ marginBottom: '3%' }}>
                <Controller name="name" control={control} defaultValue={name} rules={{ required: 'Name is required', pattern: { value: /^[a-zA-Z0-9_]{2,}$/, message: 'Invalid name format, only accept alphabet, number and underscroll' } }}
                    render={({ field }) => (
                        <TextField {...field} label="Name" fullWidth variant="outlined" error={!!errors.name} helperText={errors.name?.message} />)} />
            </Grid>

            {/* Bio Field */}
            <Grid size={12} sx={{ marginBottom: '3%' }}>
                <Controller name="bio" control={control} defaultValue={bio} rules={{ required: 'Bio is required' }}
                    render={({ field }) => (
                        <TextField {...field} label="Bio (Maximum 100 Characters)" fullWidth multiline variant="outlined" inputProps={{ maxLength: 100 }} error={!!errors.bio} helperText={errors.bio?.message} />)} />
            </Grid>

            {/* Photo Field */}
            <Grid size={12} sx={{ marginBottom: '3%' }}>
                <TextField onChange={handleChange} type="file" fullWidth variant="outlined" />
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </Grid>

            {/* Online Status Field */}
            <Grid size={12} sx={{ marginBottom: '3%' }}>
                <Controller name="onlineStatus" control={control} defaultValue={onlineStatus} rules={{ required: 'Online Status is required' }}
                    render={({ field }) => (
                        <Select {...field} labelId="onlineStatus" id="onlineStatus" label="Select an Online Option" fullWidth >
                            <MenuItem value="Online">Online</MenuItem>
                            <MenuItem value="Offline">Offline</MenuItem>
                        </Select>)} />
            </Grid>

            {/* Theme Field */}
            <Grid size={12} sx={{ marginBottom: '3%' }}>
                <Controller name="themeID" control={control} defaultValue={themeID} rules={{ required: 'Online Status is required' }}
                    render={({ field }) => (
                        <Select {...field} labelId="themeID" id="themeID" label="Select an Theme Option" fullWidth >
                            {theme.map((record: any) => (
                                <MenuItem value={record.themeID}>
                                    {record.name}
                                </MenuItem>
                            ))}
                        </Select>)} />
            </Grid>

            {/* Submit Button */}
            <Grid size={12}>
                <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ padding: '10px', backgroundColor: names.ButtonColor }}>
                    {loading ? <CircularProgress size={24} /> : 'Done Edit'}
                </Button>
            </Grid>
        </form>
        <ToastContainer />
    </div>
};

export default EditProfile;
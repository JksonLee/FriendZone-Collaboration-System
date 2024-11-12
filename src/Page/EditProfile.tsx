import { Button, TextField, CircularProgress, Select, MenuItem } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import names from '../General/Component';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface ProfileRegisterForm {
    name: string;
    photo: string;
    bio: string;
    onlineStatus: string;
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


const EditProfile: React.FC<any> = ({ add, name, bio, photo, onlineStatus }) => {
    //Catch The Data
    const { control, handleSubmit, formState: { errors } } = useForm<ProfileRegisterForm>();
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    let errorMessage: ErrorMessage;
    let userInformation: UserInformation2;
    let actionInformation: ActionInformation;
    const now = new Date();

    console.log(name, bio, photo);

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

        if (!imageBase64) {
            setError('No image selected');
            return;
        }

        // axios.post(names.basicUserAPI, finalUserRegisterInform).then((response) => {
        //     if (response.status === 200) {
        //         setTimeout(() => {
        //             setLoading(false);
        //         }, 1500);

        //         //Success Alert
        //         toast.success('Registration Successful~', {
        //             position: 'top-center',
        //             autoClose: 5000,
        //             hideProgressBar: true,
        //             style: {
        //                 backgroundColor: names.BoxBackgroundColor,
        //                 color: names.TextColor,
        //                 borderRadius: '8px',
        //             },
        //         });

        //         const currentDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;

        //         const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;


        //         actionInformation = { name: "Edit Profile", date: currentDate, time: currentTime, userID: userInformation.currentUserID };

        //         axios.post(names.basicProfileAPI, actionInformation);

        //         // Redirect Automatically
        //         setTimeout(() => {
        //             navigate('/Home', { state: userInformation });
        //         }, 3000);

        //     } else {
        //         setTimeout(() => {
        //             setLoading(false);
        //         }, 1500);

        //         //Redirect User To Error Page
        //         errorMessage = { errorMessage: "Register Have Error, Please Try Again~", page: "Register" };
        //         navigate('/ErrorPage', { state: errorMessage });
        //     }
        // });
    };


    return <div>
        <form onSubmit={handleSubmit(onSubmit)}>
            {/* Name Field */}
            <Grid size={12} sx={{marginBottom: '3%'}}>
                <Controller name="name" control={control} rules={{ required: 'Name is required', pattern: { value: /^[a-zA-Z0-9_]{2,}$/, message: 'Invalid name format, only accept alphabet, number and underscroll' } }}
                    render={({ field }) => (
                        <TextField {...field} value={name} label="Name" fullWidth variant="outlined" error={!!errors.name} helperText={errors.name?.message} />)} />
            </Grid>

            {/* Bio Field */}
            <Grid size={12} sx={{marginBottom: '3%'}}>
                <Controller name="bio" control={control} rules={{ required: 'Bio is required' }}
                    render={({ field }) => (
                        <TextField {...field} value={bio} label="Bio (Maximum 100 Characters)" fullWidth multiline variant="outlined" inputProps={{ maxLength: 100 }} error={!!errors.bio} helperText={errors.bio?.message} />)} />
            </Grid>

            {/* Online Status Field */}
            <Grid size={12} sx={{marginBottom: '3%'}}>
                <Controller name="onlineStatus" control={control} defaultValue={onlineStatus} rules={{ required: 'Online Status is required' }}
                    render={({ field }) => (
                        <Select
                        {...field}
                            labelId="onlineStatus"
                            id="onlineStatus"
                            label="Select an Online Option"
                            fullWidth
                        >
                            <MenuItem value="Online">Online</MenuItem>
                            <MenuItem value="Offline">Offline</MenuItem>
                        </Select> )} />
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
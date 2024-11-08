import { Button, TextField, Paper, Typography, Box, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import componentNames from '../General/Component';
import axios from 'axios';
import { checkEmailExist } from '../General/Validation';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

interface ProfileRegisterForm {
  name: string;
  photo: string;
  bio: string;
  onlineStatus: number;
  userID: number;
  themeID: 1;
}

interface UserInformation {
  email: string;
  password: string;
  secretCode: number;
}

const RegisterProfile: React.FC = () => {
  //Catch The Data
  const location = useLocation();
  const state = location.state as UserInformation;
  const { control, handleSubmit, formState: { errors }, getValues } = useForm<ProfileRegisterForm>();
  const [loading, setLoading] = useState(false);
  const nevigate = useNavigate()

  const onSubmit = async (data: ProfileRegisterForm) => {
    setLoading(true);
    // Simulating an API call
    axios.get(`https://localhost:7121/api/User`).then((response) => {
      let result: string = checkEmailExist(response.data, data);

      //Decision Option
      if (result == "Not Existing") {
        setTimeout(() => {
          setLoading(false);
        }, 500);

        // const userInformation = { email: data.email, password: data.password, secretCode: data.secretCode };
        // nevigate('/RegisterProfile', { state: userInformation });

        // axios.post(`https://localhost:7121/api/User`, data).then((response) => {
        //     if (response.status === 200) {
        //         //Alert
        //         toast.success('Registration successful!', {
        //             position: 'top-center', // Position of the toast
        //             autoClose: 5000, // Toast will disappear after 5 seconds
        //             hideProgressBar: true, // Hide the progress bar
        //             style: {
        //                 backgroundColor: componentNames.BoxBackgroundColor, // Green background for success
        //                 color: componentNames.TextColor, // White text color
        //                 borderRadius: '8px', // Rounded corners
        //             },
        //         });
        //     } else {
        //         //Alert
        //         toast.error('Registration Fail!', {
        //             position: 'top-center', // Position of the toast
        //             autoClose: 5000, // Toast will disappear after 5 seconds
        //             hideProgressBar: true, // Hide the progress bar
        //             style: {
        //                 backgroundColor: componentNames.BoxBackgroundColor, // Green background for success
        //                 color: componentNames.TextColor, // White text color
        //                 borderRadius: '8px', // Rounded corners
        //             },
        //         });
        //     }
        // });

      } else if (result == "Existing") {
        setTimeout(() => {
          setLoading(false);
        }, 500);

        const errorMessage = { errorMessage: "The Email Already Been Registered, Please Try Agian", page: "Register" };
        nevigate('/ErrorPage', { state: errorMessage });

      } else {
        setTimeout(() => {
          setLoading(false);
        }, 500);

        const errorMessage = { errorMessage: "Something Is Wrong, Please Refresh The Page Again, Sorry~", page: "Welcome" };
        nevigate('/ErrorPage', { state: errorMessage });
      }
    });

    //Loading Animation
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '97vh' }}>
      <Paper elevation={3} sx={{ padding: 3, width: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: componentNames.BoxRadius, backgroundColor: componentNames.BoxBackgroundColor }}>
        <Typography variant="h5" gutterBottom>
          Profile
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            {/* Email Field */}
            <Grid size={12}>
              <Controller name="name" control={control} rules={{ required: 'Name is required', pattern: { value: /^[a-zA-Z0-9_]{2,}$/, message: 'Invalid name format, only accept alphabet, number and underscroll' } }}
                render={({ field }) => (
                  <TextField {...field} label="Name" fullWidth variant="outlined" error={!!errors.name} helperText={errors.name?.message} />)} />
            </Grid>

            {/* Password Field */}
            <Grid size={12}>
              <Controller name="photo" control={control} rules={{ required: 'Photo is required', pattern: { value: /^[a-zA-Z0-9_!@]{8,}$/, message: 'Photo Must Be 8 Digits above and only accept alphabet, number, underscroll, ! and @' } }}
                render={({ field }) => (
                  <TextField {...field} label="photo" type="file" fullWidth variant="outlined" error={!!errors.photo} helperText={errors.photo?.message} />)} />
            </Grid>

            {/* Confirm Password Field */}
            <Grid size={12}>
              <Controller name="bio" control={control} rules={{ required: 'Bio is required' }}
                render={({ field }) => (
                  <TextField {...field} label="Bio" fullWidth variant="outlined" error={!!errors.bio} helperText={errors.bio?.message} />)} />
            </Grid>

            {/* Secret Code Field */}
            <Grid size={12}>
              <Controller name="onlineStatus" control={control} rules={{ required: 'Online Status is required' }}
                render={({ field }) => (
                  <TextField {...field} label="Online Status" fullWidth variant="outlined" error={!!errors.onlineStatus} helperText={errors.onlineStatus?.message} />)} />
            </Grid>

            {/* Submit Button */}
            <Grid size={12}>
              <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ padding: '10px', backgroundColor: componentNames.ButtonColor }}>
                {loading ? <CircularProgress size={24} /> : 'Register'}
              </Button>
            </Grid>
          </Grid>
        </form>
        <ToastContainer />
      </Paper>
    </Box>
  );
};

export default RegisterProfile;
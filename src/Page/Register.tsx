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

interface RegisterFormData {
    email: string;
    password: string;
    confirmPassword: string;
    secretCode: number;
}

interface RegisterForm {
    email: string;
    password: string;
    secretCode: number;
}

const Register: React.FC = () => {
    const { control, handleSubmit, formState: { errors }, getValues } = useForm<RegisterFormData>();
    const [loading, setLoading] = useState(false);
    const nevigate = useNavigate()

    const onSubmit = async (data: RegisterForm) => {
        setLoading(true);
        // Simulating an API call
        axios.get(`https://localhost:7121/api/User`).then((response) => {
            let result: string = checkEmailExist(response.data, data);

            //Decision Option
            if (result == "Not Existing") {
                setTimeout(() => {
                    setLoading(false);
                }, 500);

                const userInformation = { email: data.email, password: data.password, secretCode: data.secretCode };
                nevigate('/RegisterProfile', { state: userInformation });

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
                    Register
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2}>
                        {/* Email Field */}
                        <Grid size={12}>
                            <Controller name="email" control={control} rules={{ required: 'Email is required', pattern: { value: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9.-]+\.com$/, message: 'Invalid email format' } }}
                                render={({ field }) => (
                                    <TextField {...field} label="Email" fullWidth variant="outlined" error={!!errors.email} helperText={errors.email?.message} />)} />
                        </Grid>

                        {/* Password Field */}
                        <Grid size={12}>
                            <Controller name="password" control={control} rules={{ required: 'Password is required', pattern: { value: /^[a-zA-Z0-9_!@]{8,}$/, message: 'Password Must Be 8 Digits above and only accept alphabet, number, underscroll, ! and @' } }}
                                render={({ field }) => (
                                    <TextField {...field} label="Password" type="password" fullWidth variant="outlined" error={!!errors.password} helperText={errors.password?.message} />)} />
                        </Grid>

                        {/* Confirm Password Field */}
                        <Grid size={12}>
                            <Controller name="confirmPassword" control={control} rules={{ required: 'Confirm Password is required', validate: (value) => value === getValues('password') || 'Passwords do not match' }}
                                render={({ field }) => (
                                    <TextField {...field} label="Confirm Password" type="password" fullWidth variant="outlined" error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message} />)} />
                        </Grid>

                        {/* Secret Code Field */}
                        <Grid size={12}>
                            <Controller name="secretCode" control={control} rules={{ required: 'Secret Code is required', pattern: { value: /^[0-9]{6}$/, message: 'Password Must Be 6 Digits and only accept number' } }}
                                render={({ field }) => (
                                    <TextField {...field} label="Secret Code" fullWidth variant="outlined" error={!!errors.secretCode} helperText={errors.secretCode?.message} />)} />
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

export default Register;
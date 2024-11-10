import { Button, TextField, Paper, Typography, Box, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import names from '../General/Component';
import axios from 'axios';
import { changePasswordChecking } from '../General/Functions';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import BackButton from '../General/BackButton';

interface ForgotPasswordFormData {
  email: string;
  secretCode: string;
  newPassword: string;
  confirmPassword: string;
}

interface ErrorMessage {
  errorMessage: string;
  page: string;
}

const ForgotPassword: React.FC = () => {
  const { control, handleSubmit, formState: { errors }, getValues } = useForm<ForgotPasswordFormData>();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  let errorMessage: ErrorMessage;

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true);
    // Simulating an API call for password reset with secret code
    axios.get(names.basicUserAPI).then((response) => {
      const userData = { email: data.email, password: data.newPassword, secretCode: data.secretCode };
      console.log(response.data)
      console.log(userData)
      let { result, userId }: any = changePasswordChecking(response.data, userData);

      //Decision Option
      switch (result) {
        case "Validated":
          setTimeout(() => {
            setLoading(false);
          }, 500);
          const LatestUserData = { userID: userId, email: data.email, password: data.newPassword, secretCode: data.secretCode };
          axios.put(names.basicUserAPI, LatestUserData).then((response) => {
            if (response.status === 200) {
              //Success Alert
              toast.success('Update Successful~ Redirecting...', {
                position: 'top-center',
                autoClose: 3000,
                hideProgressBar: true,
                style: {
                  backgroundColor: names.BoxBackgroundColor,
                  color: names.TextColor,
                  borderRadius: '8px',
                  width: '100%',
                },
              });

              // Redirect Automatically
              setTimeout(() => {
                navigate('/Login');
              }, 3000);

            } else {
              //Fail Alert
              toast.error('Update Fail', {
                position: 'top-center',
                autoClose: 5000,
                hideProgressBar: true,
                style: {
                  backgroundColor: names.BoxBackgroundColor,
                  color: names.TextColor,
                  borderRadius: '8px',
                },
              });

              // Redirect after the toast is shown (delay using setTimeout)
              setTimeout(() => {
                navigate('/Welcome');
              }, 5000);
            }
          });
          break;

        case "Invalidated":
          errorMessage = { errorMessage: "The Secret Code Is Incorrect, Please Try Agian", page: "ForgetPassword" };
          navigate('/ErrorPage', { state: errorMessage });
          break;

        case "Not Existing":
          errorMessage = { errorMessage: "The Email Is Incorrect, Please Try Agian", page: "ForgetPassword" };
          navigate('/ErrorPage', { state: errorMessage });
          break;

        default:
          errorMessage = { errorMessage: "Something Is Wrong, Please Refresh The Page Again, Sorry~", page: " " };
          navigate('/ErrorPage', { state: errorMessage });
          break;
      };
    });

    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  return <div>
    <BackButton />

    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ padding: 3, width: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: names.BoxRadius, backgroundColor: names.BoxBackgroundColor }}>
        <Typography variant="h4" gutterBottom sx={{ marginBottom: '5%' }}>
          <b>Forgot Password</b>
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            {/* Email Field */}
            <Grid size={12}>
              <Controller name="email" control={control} rules={{ required: 'Email is required', pattern: { value: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9.-]+\.com$/, message: 'Invalid email format' } }}
                render={({ field }) => (
                  <TextField {...field} label="Email" fullWidth variant="outlined" error={!!errors.email} helperText={errors.email?.message} />)} />
            </Grid>

            {/* Secret Code Field */}
            <Grid size={12}>
              <Controller name="secretCode" control={control} rules={{ required: 'Secret code is required', pattern: { value: /^[0-9]{6}$/, message: 'Secret Code Must Be 6 Digits and only accept number' } }}
                render={({ field }) => (
                  <TextField {...field} label="Secret Code" inputProps={{ maxLength: 6 }} fullWidth variant="outlined" error={!!errors.secretCode} helperText={errors.secretCode?.message} />)} />
            </Grid>

            {/* New Password Field */}
            <Grid size={12}>
              <Controller name="newPassword" control={control} rules={{ required: 'New Password is required', pattern: { value: /^[a-zA-Z0-9_!@]{8,}$/, message: 'Password Must Be 8 Digits above and only accept alphabet, number, underscroll, ! and @' } }}
                render={({ field }) => (
                  <TextField {...field} label="New Password" type="password" fullWidth variant="outlined" error={!!errors.newPassword} helperText={errors.newPassword?.message} />)} />
            </Grid>

            {/* Confirm New Password Field */}
            <Grid size={12}>
              <Controller name="confirmPassword" control={control} rules={{ required: 'Confirm Password is required', validate: (value) => value === getValues('newPassword') || 'Passwords do not match' }}
                render={({ field }) => (
                  <TextField {...field} label="Confirm New Password" type="password" fullWidth variant="outlined" error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message} />)} />
            </Grid>

            {/* Submit Button */}
            <Grid size={12}>
              <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ padding: '10px', backgroundColor: names.ButtonColor }}>
                {loading ? <CircularProgress size={24} /> : 'Reset Password'}
              </Button>
            </Grid>
          </Grid>
        </form>
        <ToastContainer />
      </Paper>
    </Box>

  </div>
};

export default ForgotPassword;

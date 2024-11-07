import { Button, TextField, Paper, Typography, Box, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

interface ForgotPasswordFormData {
  email: string;
  secretCode: string;
  newPassword: string;
  confirmPassword: string;
}

const ForgotPassword: React.FC = () => {
  const { control, handleSubmit, formState: { errors }, getValues } = useForm<ForgotPasswordFormData>();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true);
    // Simulating an API call for password reset with secret code
    setTimeout(() => {
      console.log('Password reset successful', data);
      setLoading(false);
    }, 1500);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ padding: 3, width: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '35px', backgroundColor: 'rgba(245, 245, 245, 0.7)' }}>
        <Typography variant="h5" gutterBottom>
          Forgot Password
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            {/* Email Field */}
            <Grid size={12}>
              <Controller name="email" control={control} rules={{ required: 'Email is required', pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, message: 'Invalid email format'}}}
                render={({ field }) => (
                  <TextField {...field} label="Email" fullWidth variant="outlined" error={!!errors.email} helperText={errors.email?.message}/>)}/>
            </Grid>

            {/* Secret Code Field */}
            <Grid size={12}>
              <Controller name="secretCode" control={control} rules={{ required: 'Secret code is required' }}
                render={({ field }) => (
                  <TextField {...field} label="Secret Code" fullWidth variant="outlined" error={!!errors.secretCode} helperText={errors.secretCode?.message}/>)}/>
            </Grid>

            {/* New Password Field */}
            <Grid size={12}>
              <Controller name="newPassword" control={control} rules={{ required: 'New Password is required' }}
                render={({ field }) => (
                  <TextField {...field} label="New Password" type="password" fullWidth variant="outlined" error={!!errors.newPassword} helperText={errors.newPassword?.message}/>)}/>
            </Grid>

            {/* Confirm New Password Field */}
            <Grid size={12}>
              <Controller name="confirmPassword" control={control} rules={{ required: 'Confirm Password is required', validate: (value) => value === getValues('newPassword') || 'Passwords do not match'}}
                render={({ field }) => (
                  <TextField {...field} label="Confirm New Password" type="password" fullWidth variant="outlined" error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message}/>)}/>
            </Grid>

            {/* Submit Button */}
            <Grid size={12}>
              <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ padding: '10px' }}>
                {loading ? <CircularProgress size={24} /> : 'Reset Password'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default ForgotPassword;

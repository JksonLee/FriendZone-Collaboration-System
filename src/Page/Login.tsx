import { sayHello } from '../General/Validation'
import componentNames from '../General/Component'
import { useState } from 'react';
import { Box, Button, CircularProgress, Paper, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useForm, Controller } from 'react-hook-form';

interface LoginFormData {
  email: string;
  password: string;
}


const Login: React.FC = () => {
  // const hello = sayHello('Lee');

  // return <div>
  //   {componentNames.Header}
  //   <br />
  //   {hello}
  // </div>
  const { control, handleSubmit, formState: { errors }, setValue } = useForm<LoginFormData>();
  const [loading, setLoading] = useState(false);

  //Loading UI and API when click submit button
  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    // Simulating API call
    setTimeout(() => {
      console.log('Login successful', data);
      setLoading(false);
    }, 1500);
  };

  return <div>
    <Box
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ padding: 3, width: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '35px', backgroundColor: 'rgba(245, 245, 245, 0.7)' }}>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <Controller name="email" control={control} rules={{ required: 'Email is required' }}
                render={({ field }) => (
                  <TextField {...field} label="Email" fullWidth variant="outlined" error={!!errors.email} helperText={errors.email?.message} />
                )} />
            </Grid>

            <Grid size={12}>
              <Controller name="password" control={control} rules={{ required: 'Password is required' }}
                render={({ field }) => (
                  <TextField {...field} label="Password" type="password" fullWidth variant="outlined" error={!!errors.password} helperText={errors.password?.message} />
                )} />
            </Grid>

            <Grid size={12}>
              <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ padding: '10px', backgroundColor: 'rgba(105,105,105, 0.5)' }} >
                {loading ? <CircularProgress size={24} /> : 'Login'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  </div>
}

export default Login
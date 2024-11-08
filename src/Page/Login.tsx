import componentNames from '../General/Component';
import { checkAuthorized } from '../General/Validation';
import { useState } from 'react';
import { Box, Button, CircularProgress, Paper, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';


//TypeScript
interface LoginFormData {
  email: string;
  password: string;
}


const Login: React.FC = () => {
  const { control, handleSubmit, formState: { errors }, setValue } = useForm<LoginFormData>();
  const [loading, setLoading] = useState(false);


  //Loading UI and API when click submit button
  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    // Simulating API call

    axios.get(`https://localhost:7121/api/User`).then((response) => {

      let result: string = checkAuthorized(response.data, data);
      if (result == "Authorized") {
        console.log("Welcome");
      } else if (result == "Password Incorrect") {
        console.log("Your Password Is Incorrect");
      } else if (result == "Unauthorized") {
        console.log("You Did Not Register Yet");
      } else {
        console.log("Something Wrong");
      }

    })


    setTimeout(() => {
      console.log('Login successful', data);
      setLoading(false);
    }, 1500);
  };


  //Main UI For Login Page
  return <div>
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>

      <Paper elevation={3} sx={{ padding: 3, width: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: componentNames.BoxRadius, backgroundColor: componentNames.BoxBackgroundColor }}>

        <Typography variant="h4" gutterBottom sx={{ marginBottom: '5%' }}>
          <b>Login</b>
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <Controller name="email" control={control} rules={{ required: 'Email is required', pattern: { value: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9.-]+\.com$/, message: 'Invalid email format' } }}
                render={({ field }) => (
                  <TextField {...field} label="Email" fullWidth variant="outlined" error={!!errors.email} helperText={errors.email?.message} />
                )} />
            </Grid>

            <Grid size={12}>
              <Controller name="password" control={control} rules={{ required: 'Password is required', pattern: { value: /^[a-zA-Z0-9_!@]{8,}$/, message: 'Password Must Be 8 Digits above and only accept alphabet, number, underscroll, ! and @' } }}
                render={({ field }) => (
                  <TextField {...field} label="Password" type="password" fullWidth variant="outlined" error={!!errors.password} helperText={errors.password?.message} />
                )} />
            </Grid>

            <Grid size={12}>
              <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ padding: '10px', backgroundColor: componentNames.ButtonColor }} >
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
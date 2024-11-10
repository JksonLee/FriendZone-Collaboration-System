import names from '../General/Component';
import { checkAuthorized } from '../General/Functions';
import { useState } from 'react';
import { Box, Button, CircularProgress, Paper, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import BackButton from '../General/BackButton';


//TypeScript
interface LoginFormData {
  email: string;
  password: string;
}

interface ErrorMessage {
  errorMessage: string;
  page: string;
}

interface userInformation {
  currentUserID: number;
  theme: string;
  themeID: number;
}


const Login: React.FC = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  let errorMessage: ErrorMessage;
  let userInformation: userInformation;

  //Loading UI and API when click submit button
  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);

    //Simulating API call
    axios.get(names.basicUserAPI).then((response) => {

      //Authorized User Information
      let { result, userID }: any = checkAuthorized(response.data, data);

      setTimeout(() => {
        setLoading(false);
      }, 500);

      //Decision Option
      switch (result) {
        case "Authorized":
          axios.get(names.getProfileByUserID + userID).then((response) => {

            axios.get(names.getThemeByID + response.data.themeID).then((response) => {

              userInformation = { currentUserID: userID, theme: response.data.source, themeID: response.data.themeID };
              navigate('/Home', { state: userInformation });
            });
          });
          break;

        case "Password Incorrect":
          errorMessage = { errorMessage: "Your Password Is Incorrect, Please Try Again", page: "Login" };
          navigate('/ErrorPage', { state: errorMessage });
          break;

        case "Unauthorized":
          errorMessage = { errorMessage: "Your Password Is Incorrect, Please Try Again", page: "Login" };
          navigate('/ErrorPage', { state: errorMessage });
          break;

        default:
          errorMessage = { errorMessage: "Something Is Wrong, Please Refresh The Page Again, Sorry~", page: " " };
          navigate('/ErrorPage', { state: errorMessage });
          break;
      }
    });
  };


  //Main UI For Login Page
  return <div>
    <BackButton />

    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>

      <Paper elevation={3} sx={{ padding: 3, width: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: names.BoxRadius, backgroundColor: names.BoxBackgroundColor }}>

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
              <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ padding: '10px', backgroundColor: names.ButtonColor }} >
                {loading ? <CircularProgress size={24} /> : 'Login'}
              </Button>
            </Grid>

            <Grid size={12}>
              <Link to="/ForgetPassword" style={{ color: 'whitesmoke', display: 'flex', justifyContent: 'flex-end' }}>Forget Password?</Link>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  </div>
}

export default Login
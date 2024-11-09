import { Button, TextField, Paper, Typography, Box, CircularProgress, Stepper, Step, StepLabel } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import componentNames from '../General/Component';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

interface ProfileRegisterForm {
  name: string;
  photo?: string;
  bio: string;
  onlineStatus: string;
  userID: number;
  users: {
    userID: number,
    email: string,
    password: string,
    secretCode: number
  };
  themeID: number;
  themes: {
    themeID: number,
    name: string,
    source: string
  };
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
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [themeSource, setThemeSource] = useState<string>('');
  const [themeId, setThemeId] = useState<number>();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const steps = [
    'Register An Account',
    'Design Your Profile',
  ];
  const userEmail = state.email;
  const userPassword = state.password;
  const userSecretCode = state.secretCode;

  // Nevigation Bar
  function HorizontalLinearAlternativeLabelStepper() {
    return (
      <Box sx={{ width: '100%', backgroundColor: 'transparent' }}>
        <Stepper activeStep={1} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel><p style={{ color: 'white' }}>{label}</p></StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
    );
  }

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
          // console.log(imageBase64)
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

    //Store The UserDate Into UserDB
    const finalUserRegisterInform = { email: userEmail, password: userPassword, secretCode: userSecretCode }
    console.log(finalUserRegisterInform);

    axios.post(`https://localhost:7121/api/User`, finalUserRegisterInform).then((response) => {
      if (response.status === 200) {
        //Get The UserID
        axios.get(`https://localhost:7121/api/User/userEmail/` + userEmail).then((response) => {
          let userId: number = response.data.userID;
          console.log(userId);

          axios.get(`https://localhost:7121/api/Theme/1`).then((response) => {
            //Store The UserData Into ProfileDB
            //Set The finalDataList Data
            const finalDataList = {
              name: data.name,
              photo: imageBase64,
              bio: data.bio,
              onlineStatus: "Online",
              userID: userId,
              themeID: response.data.themeID,
            }
            setThemeSource(response.data.themeSource.toString());
            setThemeId(response.data.themeID);

            axios.post(`https://localhost:7121/api/Profile`, finalDataList).then((response) => {
              if (response.status === 200) {
                //Success Alert
                toast.success('Registration Successful~', {
                  position: 'top-center',
                  autoClose: 5000,
                  hideProgressBar: true,
                  style: {
                    backgroundColor: componentNames.BoxBackgroundColor,
                    color: componentNames.TextColor,
                    borderRadius: '8px',
                  },
                });

                const userInform = { currentUserID: finalDataList.userID, theme: themeSource, themeID: themeId };

                // Redirect Automatically
                setTimeout(() => {
                  navigate('/Home', { state: userInform });
                }, 3000);

              } else {
                //Redirect User To Error Page
                const errorMessage = { errorMessage: "Register Have Error, Please Try Again~", page: "Register" };
                  navigate('/ErrorPage', { state: errorMessage });
              }

            });
          });
        });
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
        {HorizontalLinearAlternativeLabelStepper()}
        <hr style={{ border: '1px solid gray', width: '100%', marginBottom: '5%' }} />
        <Typography variant="h4" gutterBottom>
          <b>Profile</b>
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            {/* Email Field */}
            <Grid size={12}>
              <Controller name="name" control={control} rules={{ required: 'Name is required', pattern: { value: /^[a-zA-Z0-9_]{2,}$/, message: 'Invalid name format, only accept alphabet, number and underscroll' } }}
                render={({ field }) => (
                  <TextField {...field} label="Name" fullWidth variant="outlined" error={!!errors.name} helperText={errors.name?.message} />)} />
            </Grid>

            {/* Photo Field */}
            <Grid size={12}>
              <TextField onChange={handleChange} type="file" fullWidth variant="outlined" required />
              {error && <p style={{ color: 'red' }}>{error}</p>}
            </Grid>

            {/* Bio Field */}
            <Grid size={12}>
              <Controller name="bio" control={control} rules={{ required: 'Bio is required' }}
                render={({ field }) => (
                  <TextField {...field} label="Bio" fullWidth multiline variant="outlined" error={!!errors.bio} helperText={errors.bio?.message} />)} />
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
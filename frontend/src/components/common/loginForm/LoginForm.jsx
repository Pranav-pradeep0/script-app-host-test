import { FormLabel, Stack, Typography, useTheme } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { AuthInput, GradientBtn } from '@common';
import { setLogin } from '@/store/slices/userSlice';
import { useState } from 'react';
import { VITE_BASE_URL } from '@/constants';
import axios from 'axios';
import Swal from 'sweetalert2';

const LoginForm = () => {

  const { palette } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loginCreds, setLoginCreds] = useState({
    email: '',
    password: ''
  })

  const onLoginInputsChange = (e) => {
    const { value, name } = e.target
    const existingData = loginCreds
    setLoginCreds({ ...existingData, [name]: value })
  }

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${VITE_BASE_URL}/auth/login`, {
        email: loginCreds.email,
        password: loginCreds.password
      });

      if (response.status === 200) {
        const userId = response.data.user._id;
        const userName = response.data.user.firstname
        if (response.data.user.isadmin) {
          return (
            localStorage.setItem('Admin', true),
            localStorage.setItem('AdminId', userId),
            localStorage.setItem('userId', userId),
          localStorage.setItem('userName', userName),
          navigate('/adminpanel')
          )
        }
localStorage.setItem('userId', userId);
localStorage.setItem('userName', userName)
dispatch(setLogin(true));

Swal.fire({
  icon: 'success',
  title: 'Signed In Successfully',
  showConfirmButton: false,
  timer: 1000,
});

setTimeout(() => {
  navigate('/');
}, 1000);

      } else {
  console.error('Login failed');
  console.log(response.data.message);
}
    }
    catch (error) {
  console.error('An error occurred during login:', error);
  // Swal.fire({
  //   icon: 'error',
  //   title: error.response.data.error || error.response.data.error,
  //   text: 'Please check your email and password and try again.',
  // });
  if (error.response.data.error == "Subscription expired. Please renew your subscription.") {
    const userId = error.response.data.user._id
    const userName = error.response.data.user.firstname
    localStorage.setItem('userId', userId);
    localStorage.setItem('userName', userName)
    console.log(userId);
    navigate('/upgradeplan')
  }
}
  };

return (
  <Stack component="form" gap="0.94rem" width="100%">
    <Typography variant="h2">Sign In</Typography>
    <AuthInput placeholder="Email" value={loginCreds.email} name='email' onChange={onLoginInputsChange} />
    <AuthInput placeholder="Password" type="password" value={loginCreds.password} name='password' onChange={onLoginInputsChange} />
    <Link style={{ textDecoration: 'none' }} to="/login">
      <FormLabel
        sx={{
          fontSize: '1rem',
          color: palette.primary.lowContrastText,
          ':hover': { cursor: 'pointer' },
        }}
      >
        Forgot Password?
      </FormLabel>
    </Link>
    <GradientBtn
      size="extra-large"
      disableRipple
      sx={{ mt: { xs: '0.5rem', lg: '1.31rem' } }}
      onClick={handleLogin}
    >
      Login
    </GradientBtn>
  </Stack>
);
};

export default LoginForm;

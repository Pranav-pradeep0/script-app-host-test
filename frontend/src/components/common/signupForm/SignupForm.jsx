import { Stack, Typography, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AuthInput, GradientBtn } from '@common';
import { setLogin } from '@/store/slices/userSlice';
import { useState } from 'react';
import axios from 'axios';
import { VITE_BASE_URL } from '@/constants';
import Swal from 'sweetalert2';

const SignupForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [signUpCreds, setSignUpCreds] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPass: '',
  });

  const [errors, setErrors] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [error, SetError] = useState(null)

  const passwordStrength = (password) => {
    // You can implement your own logic to determine password strength
    // For simplicity, let's consider a strong password with at least 8 characters
    return password.length >= 8 ? 'Strong' : 'Weak';
  };

  const validateForm = () => {
    const newErrors = {};
    if (!signUpCreds.firstname.trim()) {
      newErrors.firstname = 'First name is required';
    }
    if (!signUpCreds.lastname.trim()) {
      newErrors.lastname = 'Last name is required';
    }
    if (!signUpCreds.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(signUpCreds.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!signUpCreds.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (signUpCreds.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (signUpCreds.password !== signUpCreds.confirmPass) {
      newErrors.confirmPass = 'Passwords does not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSignUpInputChange = (e) => {
    const { name, value } = e.target;
    const existingValues = { ...signUpCreds };
    setSignUpCreds({ ...existingValues, [name]: value });
    setErrors({ ...errors, [name]: null });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(signUpCreds);
    const isValid = validateForm();
    if (isValid) {
      try {
        const response = await axios.post(`${VITE_BASE_URL}/auth/register`, {
          firstname: signUpCreds.firstname,
          lastname: signUpCreds.lastname,
          email: signUpCreds.email,
          password: signUpCreds.password,

        });
        if (response.status === 201) {
          const userId = response.data.newUser._id;
          const userName = response.data.newUser.firstname
          localStorage.setItem('userId', userId);
          localStorage.setItem('userName', userName)
          dispatch(setLogin(true));
          Swal.fire({
            icon: 'success',
            title: 'Registered Successfully!',
            showConfirmButton: false,
            timer: 1000,
          });
          setTimeout(() => {
            navigate('/subscribe');
          }, 1000);
          // console.log(response);
          // console.log(userId);
        }
        else {
          console.log(response);
        }
      } catch (error) {
        console.error('API call error:', error);
        Swal.fire({
          icon: 'error',
          title: error.response.data.error,
          showConfirmButton: false,
          timer: 1000,
        });
        setOpenSnackbar(true);
        SetError(true);
      }
    } else {
      setOpenSnackbar(true);
      SetError(true);
    }
  };

  return (
    <Stack component="form" gap={"0.94rem"} width="100%" onSubmit={handleSubmit}>
      <Typography variant="h2">Create Account</Typography>
      <AuthInput
        placeholder="First Name"
        onChange={onSignUpInputChange}
        name="firstname"
        error={errors.firstname}
      />
      {errors.firstname && <Typography color="error">{errors.firstname}</Typography>}

      <AuthInput
        placeholder="Last Name"
        onChange={onSignUpInputChange}
        name="lastname"
        error={errors.lastname}
      />
      {errors.lastname && <Typography color="error">{errors.lastname}</Typography>}

      <AuthInput
        placeholder="Email"
        onChange={onSignUpInputChange}
        name="email"
        error={errors.email}
      />
      {errors.email && <Typography color="error">{errors.email}</Typography>}

      <AuthInput
        placeholder="Create Password"
        onChange={onSignUpInputChange}
        name="password"
        type="password"
        error={errors.password}
      />
      {signUpCreds.password && (
        <Typography color={passwordStrength(signUpCreds.password) === 'Weak' ? 'error' : 'green'}>
          Password Strength: {passwordStrength(signUpCreds.password)}
        </Typography>
      )}
      {errors.password && <Typography color="error">{errors.password}</Typography>}

      <AuthInput
        placeholder="Repeat Password"
        onChange={onSignUpInputChange}
        name="confirmPass"
        type="password"
        error={errors.confirmPass}
      />
      {errors.confirmPass && <Typography color="error">{errors.confirmPass}</Typography>}

      <GradientBtn
        type="submit"
        size="extra-large"
        disableRipple
        sx={{ mt: { xs: '1.5rem', lg: '3.5rem' } }}
      >
        Sign Up
      </GradientBtn>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert severity="error" onClose={handleCloseSnackbar}>
          Please fill out all required fields correctly.
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default SignupForm;

import { Box, Link, Typography } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const AuthLinks = () => {
  const { pathname } = useLocation();
  const isLoginPage = pathname === '/login';
  const linkText = isLoginPage ? 'Create Account' : 'Sign In';
  const linkTo = isLoginPage ? '/signup' : '/login';

  return (
    <Box alignSelf="flex-start">
      <Typography>
        {isLoginPage ? "Don't have an account?" : 'Already have an account?'}
      </Typography>
      <Link
        component={RouterLink}
        to={linkTo}
        sx={{
          textDecoration: 'none',
          color: 'inherit',
          ':hover': { cursor: 'pointer' },
        }}
      >
        <Typography fontWeight="700">{linkText}</Typography>
      </Link>
    </Box>
  );
};

export default AuthLinks;

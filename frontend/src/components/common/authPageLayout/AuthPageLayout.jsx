import { useTheme } from '@emotion/react';
import { Box, Hidden, Stack } from '@mui/material';
import PropTypes from 'prop-types';
import { AuthLinks } from '@common';
import full_logo_image from '@assets/images/complete_logo.svg';
import auth_bg_image from '@assets/images/auth_bg_image.jpeg';

const AuthPageLayout = ({ children }) => {
  const {
    palette: { primary },
  } = useTheme();

  return (
    <Stack
      component="main"
      direction="row"
      height="100vh"
      bgcolor={primary.main}
      color={primary.contrastText}
    >
      <Stack
        width={{ lg: '34.625%', xs: '100%' }}
        p={{ xs: '0 4rem', lg: '0 4.88rem' }}
        gap={{ xs: '1.5rem', lg: '2.5rem' }}
        alignItems="center"
        justifyContent="center"
      >
        <Box width="9.4rem" height="3.3rem" ml="-0.8rem" alignSelf="flex-start">
          <Box
            width="100%"
            height="100%"
            component="img"
            src={full_logo_image}
          />
        </Box>
        {children}
        <AuthLinks />
      </Stack>
      <Hidden lgDown>
        <Box
          flexGrow={1}
          sx={{
            backgroundImage: `url(${auth_bg_image})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPositionX: '100%',
          }}
          alt="script writing"
        />
      </Hidden>
    </Stack>
  );
};

AuthPageLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
export default AuthPageLayout;

import { Box, Icon, Paper, Typography } from '@mui/material';
import { Plus } from '@phosphor-icons/react';
import { useTheme } from '@emotion/react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { VITE_BASE_URL } from '@/constants';
import axios from 'axios';
import Swal from 'sweetalert2';

const TemplateCard = () => {
  const { palette } = useTheme();
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');

  // const handleClick = (e) => {
  //   if (isLoading) return e.stopPropagation();
  //   setLoading(true);
  //   fetch(`${VITE_BASE_URL}/api/scripts/create`)
  //     .then(async (response) => {
  //       const { id } = await response.json();
  //       navigate(`/document/${id}`);
  //     })
  //     .catch((err) => console.log(err))
  //     .finally(() => setLoading(false));
  // };

  const handleClick = async (e) => {
    if (isLoading) return e.stopPropagation();
    setLoading(true);
    try {
      const response = await axios.post(`${VITE_BASE_URL}/api/scripts/create`, { userId });
      console.log(response);
      const { id } = response.data;
      console.log('Script created successfully:', id);
      navigate(`/document/${id}`);
    }
    catch (err) {
      console.error('Error creating script:', err);
      if (err.response.data.error == "Subscription expired. Please renew your subscription.") {
        navigate('/upgradeplan')
        // navigate(`/document/${id}`);
      }
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    // console.log(userId);
  }, [])

  return (
    <Box color={palette.primary.contrastText}>
      <Paper
        component="a"
        sx={{
          width: '7.875rem',
          height: '9rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '4px 4px 11px 0px #000',
          ':hover': {
            cursor: 'pointer',
          },
        }}
        onClick={handleClick}
      >
        <Icon fontSize="large">
          <Plus />
        </Icon>
      </Paper>
      <Typography
        variant="h6"
        fontSize="0.935rem"
        fontWeight={500}
        marginTop="0.38rem"
      >
        Blank Page
      </Typography>
    </Box>
  );
};

TemplateCard.propTypes = {};

export default TemplateCard;

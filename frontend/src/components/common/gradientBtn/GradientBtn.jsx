import { Button, styled } from '@mui/material';

/**
 * @size :{xl,large,medium,small,xs}
 *
 */
const GradientBtn = styled(Button)(({ theme: { palette }, size }) => ({
  background: palette.tertiary.main,
  textTransform: 'none',
  ...(size === 'extra-large'
    ? {
        height: '2.875rem',
        fontSize: '1rem',
        padding: '0.56rem auto',
      }
    : size === 'large'
    ? {
        height: '2.25rem',
        fontSize: '0.875rem',
        padding: '0.5rem auto',
      }
    : size === 'medium'
    ? {
        height: '1.8125rem',
        fontSize: '0.75rem',
        padding: '0.31rem auto',
      }
    : size === 'small'
    ? {
        height: '1.75rem',
        fontSize: '0.75rem',
        padding: '0.25rem auto',
      }
    : size === 'extra-small'
    ? {
        height: '1.68338rem',
        fontSize: '0.625rem',
        padding: '0 auto',
      }
    : ''),
  position: 'relative',
  overflow: 'hidden',
  color: '#000',
}));

export default GradientBtn;

import { TextField, styled } from '@mui/material';

const AuthInput = styled(TextField)(() => ({
  margin: '0',
  width: '100%',
  '& input': {
    height: '3.125rem',
    fontSize: '1rem',
    color: 'white',
    paddingTop: '0',
    paddingBottom: '0',
    borderRadius: '0.25rem',
    background: 'rgba(244,244,244,0.10)',
  },
  '& fieldset': { border: 'none' },
}));

export default AuthInput;

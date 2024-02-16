import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#242424',
      light: '#2D2D2D',
      dark: '#1C1C1C',
      contrastText: '#FFF',
      lowContrastText: 'rgba(255, 255, 255, 0.50)',
    },
    secondary: {
      main: '#FFF',
      light: '#F7F7F7',
      lighter: '#F2F2F2',
      contrastText: '#000',
      lowContrastText: 'rgba(0, 0, 0, 0.60)',
      lowContrastIcons: 'rgba(0, 0, 0, 0.3)',
    },
    tertiary: {
      main: 'linear-gradient(94deg, #C5AC57 10.11%, #C5AC57 46.89%, #E1D5AB 85.01%)',
    },
  },
  typography: {
    fontFamily: 'Roboto',
    fontSize: 12,
    h2: {
      fontSize: '1.625rem',
      fontWeight: 700,
    },
    button: {
      textTransform: 'none',
    },
  },
});

export default theme;

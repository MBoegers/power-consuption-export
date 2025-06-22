import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#428487',
      contrastText: '#fff',
    },
    secondary: {
      main: '#D47860',
      contrastText: '#fff',
    },
    text: {
      primary: '#404040',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          '&:hover': {
            backgroundColor: '#D47860',
            color: '#fff',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: '#428487',
          color: '#fff',
        },
      },
    },
  },
});

export default theme;


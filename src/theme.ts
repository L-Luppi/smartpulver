import { createTheme } from '@mui/material/styles';

// Tema claro
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#007BFF',
      light: '#6CCFFF',
    },
    secondary: {
      main: '#28A745',
      light: '#82E0AA',
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#101010',
      secondary: '#6CCFFF',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  components: {
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: '0.9rem',
        },
      },
    },
  },
});


// Tema escuro
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#007BFF',
      light: '#6CCFFF',
    },
    secondary: {
      main: '#28A745',
      light: '#82E0AA',
    },
    background: {
      default: '#101010',
      paper: '#1C1C1C',
    },
    text: {
      primary: '#F5F5F5',
      secondary: '#82E0AA',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  components: {
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: '0.9rem',
        },
      },
    },
  },
});

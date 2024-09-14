"use client"

import { useEffect, useState } from "react";
import Dashboard from "./components/Dashboard";
import LogIn from "./components/LogIn";
import { auth, User, UserContext } from "./firebase";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import 'dayjs/locale/pl';

const theme = createTheme({
  cssVariables: true,
  colorSchemes: {
    dark: {
      palette: {
        primary: {
          main: '#008148',
        },
        secondary: {
          main: '#ff9100',
        },
      },
    },
    light: {
      palette: {
        primary: {
          main: '#034732',
        },
        secondary: {
          main: '#ff9100',
        },
      },
    },
  },
})

export default function Home() {
  const [user, setUser] = useState<User | null>(auth.currentUser)

  useEffect(() => {
    auth.onAuthStateChanged(setUser)
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pl">
          <CssBaseline />
          {user ? <Dashboard /> : <LogIn />}
        </LocalizationProvider>
      </ThemeProvider>
    </UserContext.Provider>
  );
}

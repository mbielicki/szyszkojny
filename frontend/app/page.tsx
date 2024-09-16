"use client"

import { useContext } from "react";
import Dashboard from "./components/Dashboard";
import LogIn from "./components/LogIn";
import { UserContext } from "./firebase";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import 'dayjs/locale/pl';
import PageLoading from "./components/PageLoading";

export default function Home() {
  const { user, loading } = useContext(UserContext)

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pl">
      {loading ? <PageLoading /> : user ? <Dashboard /> : <LogIn />}
    </LocalizationProvider>
  );
}

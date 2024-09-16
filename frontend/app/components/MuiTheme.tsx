"use client"
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
                    main: '#00db79',
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
export default function MuiTheme({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pl">
                <CssBaseline />
                {children}
            </LocalizationProvider>
        </ThemeProvider >
    )
}
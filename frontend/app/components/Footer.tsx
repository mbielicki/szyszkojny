"use client"
import { usePathname } from "next/navigation";
import Link from "next/link";
import { BottomNavigation, BottomNavigationAction, Fab, Paper } from "@mui/material";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const navItems = [
    { label: "Kody", href: "/my-codes", icon: <QrCodeScannerIcon /> },
    { label: "Saldo", href: "/", icon: <AccountBalanceWalletIcon /> },
    { label: "Nowy", href: "/new-code", icon: <AddCircleIcon /> },
];

export default function Footer() {
    const pathname = usePathname();
    const currentIndex = navItems.findIndex(item => item.href === pathname);

    return (
        <Paper
            component="footer"
            elevation={3}
            className="h-[--footer-h]"
            sx={{ position: 'relative', zIndex: 1 }}
        >
            <BottomNavigation
                value={currentIndex}
                showLabels
                sx={{ height: '100%', backgroundColor: 'transparent' }}
            >
                {navItems.map((item, i) =>
                    i === 1 ? (
                        <BottomNavigationAction
                            key={item.href}
                            label={item.label}
                            icon={
                                <Fab
                                    color="secondary"
                                    size="medium"
                                    component={Link}
                                    href={item.href}
                                    sx={{ mt: -4, mb: 0.5, boxShadow: 3 }}
                                >
                                    {item.icon}
                                </Fab>
                            }
                        />
                    ) : (
                        <BottomNavigationAction
                            key={item.href}
                            label={item.label}
                            icon={item.icon}
                            component={Link}
                            href={item.href}
                        />
                    )
                )}
            </BottomNavigation>
        </Paper>
    );
}

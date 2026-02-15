"use client"
import { usePathname } from "next/navigation";
import Link from "next/link";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ListAltIcon from "@mui/icons-material/ListAlt";

const navItems = [
    { label: "Kody", href: "/my-codes", icon: <ListAltIcon /> },
    { label: "Skanuj", href: "/scan", icon: <QrCodeScannerIcon /> },
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
                {navItems.map((item) => (
                    <BottomNavigationAction
                        key={item.href}
                        label={item.label}
                        icon={item.icon}
                        component={Link}
                        href={item.href}
                    />
                ))}
            </BottomNavigation>
        </Paper>
    );
}

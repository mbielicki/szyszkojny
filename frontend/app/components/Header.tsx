"use client"
import { useContext, useState } from "react";
import { auth, UserContext } from "../firebase";
import ProfilePicture from "./ProfilePicture";
import { IconButton, Menu, MenuItem } from "@mui/material";

export default function Header() {
    const { user, setUser } = useContext(UserContext)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

    const handleLogout = () => {
        setAnchorEl(null)
        auth.signOut().then(() => setUser(null))
    }

    return <header className="h-[--header-h] flex justify-between items-center">
        <span className="text-xl p-3">{user?.displayName}</span>
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0, height: '100%' }}>
            <ProfilePicture />
        </IconButton>
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            <MenuItem onClick={handleLogout}>Wyloguj</MenuItem>
        </Menu>
    </header>;
}

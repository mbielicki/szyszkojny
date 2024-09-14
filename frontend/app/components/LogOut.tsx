import { useContext } from "react";
import { auth, UserContext } from "../firebase";

export default function LogOut({ className, text = "wyloguj" }: { className?: string, text?: string }) {
    const { user, setUser } = useContext(UserContext)

    return user && (
        <button className={className} onClick={() => auth.signOut().then(() => setUser(null))}>{text}</button>
    )
}


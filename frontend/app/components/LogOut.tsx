import { auth, useAuth } from "../hooks/firebase";

export default function LogOut({ className, text = "wyloguj" }: { className?: string, text?: string }) {
    const [user, setUser] = useAuth()
    return user && (
        <button className={className} onClick={() => auth.signOut().then(() => setUser(null))}>{text}</button>
    )
}


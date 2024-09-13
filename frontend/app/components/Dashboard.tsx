import { useAuth } from "../firebase";
import { useEffect } from "react";
import ProfilePicture from "./ProfilePicture";
import axios from "axios";
import { backend } from "../../config.js"
import LogOut from "./LogOut";

export default function Dashboard() {
    const [user, setUser] = useAuth()
    useEffect(() => {
        const authenticate = async () => {
            if (!user) throw new Error('No user to authenticate')
            axios.post(backend + 'authenticate/', { id_token: await user.getIdToken() })
        }
        authenticate()
    }, [user])
    return (
        <div className="flex h-full flex-col">
            <header className="p-2 flex justify-between">
                <span>{user?.displayName}</span>
                <ProfilePicture user={user} />
            </header>
            <main className="flex-1 flex flex-col items-center justify-center gap-2">
                <h1 className="text-4xl">Czuwaj!</h1>
                <div>Twoje szyszkojny:</div>
                <h2 className="text-3xl">50 🪙</h2>
            </main>
            <footer className="p-2 flex gap-6 flex-wrap items-center justify-center text-4xl">
                <LogOut className="text-xl" />
                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                >
                    🏠
                </a>
                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                >
                    🌲
                </a>
                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                >
                    🪙
                </a>
            </footer>
        </div>
    );
}
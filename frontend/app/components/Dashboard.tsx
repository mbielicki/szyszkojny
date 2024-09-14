import { useAuth } from "../hooks/firebase";
import { useEffect, useState } from "react";
import axios from "axios";
import { backend } from "../../config.js"
import Header from "./Header";
import Footer from "./Footer";
import MyBalance from "./MyBalance";

export default function Dashboard() {
    const [money, setMoney] = useState<number | null>(null)
    const [user, setUser] = useAuth()

    useEffect(() => {
        const logIn = async () => {
            if (!user) return
            const res = await axios.post(backend + 'log-in/', { id_token: await user.getIdToken() })
            if ([200, 201].includes(res.status))
                setMoney(res.data['money'])
        }
        logIn()
    }, [user])

    return (
        <div className="flex h-full flex-col">
            <Header user={user} />
            <MyBalance money={money} />
            <Footer />
        </div>
    );
}

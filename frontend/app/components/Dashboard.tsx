import { UserContext } from "../firebase";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { backend } from "../../config.js"
import Header from "./Header";
import Footer from "./Footer";
import MyBalance from "./MyBalance";
import { Navigation, useNav } from "../hooks/useNav";
import MyCodes from "./MyCodes";

export default function Dashboard() {
    const [money, setMoney] = useState<number | null>(null)
    const [nav, setNav] = useNav()
    const { user } = useContext(UserContext)

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
            <Header />
            {nav === Navigation.balance && <MyBalance money={money} />}
            {nav === Navigation.codes && <MyCodes />}
            <Footer nav={nav} setNav={setNav} />
        </div>
    );
}

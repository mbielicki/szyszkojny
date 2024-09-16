import { backend } from "@/config"
import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../firebase"


export default function MyBalance() {
    const [money, setMoney] = useState<number | null>(null)
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
        <main className="flex-1 flex flex-col items-center justify-center gap-2">
            <h1 className="text-4xl">Czuwaj!</h1>
            <div>Twoje szyszkojny:</div>
            <h2 className="text-3xl">{money ?? "..."} 🪙</h2>
        </main>
    )
}
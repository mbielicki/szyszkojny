import { backend } from "@/config"
import axios from "axios"
import { UserContext } from "../firebase"
import { useContext, useEffect, useState } from "react"
import Code, { QrCode } from "./Code"

export default function MyCodes() {
    const { user } = useContext(UserContext)
    const [codes, setCodes] = useState<Array<QrCode>>([])

    useEffect(() => {
        if (!user) return
        const fetchMyCodes = async () => {
            const res = await axios.post(backend + 'my-codes/', { id_token: await user.getIdToken() })
            if (res.status === 200)
                setCodes(res.data.results)
        }
        fetchMyCodes()
    }, [])

    return (
        <main className="flex-1 flex flex-col gap-5 px-5 overflow-auto">
            {codes.map((code) => <Code key={code.code} code={code} />)}
        </main>
    )
}
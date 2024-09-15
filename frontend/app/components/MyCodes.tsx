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
                setCodes(res.data)
        }
        fetchMyCodes()
    })

    return (
        <main className="flex-1 flex flex-col items-center justify-center gap-2">
            {codes.map((code) => <Code key={code.code} code={code} />)}
        </main>
    )
}
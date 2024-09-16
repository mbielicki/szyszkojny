import { api } from "@/config"
import axios from "axios"
import { UserContext } from "@/app/firebase"
import { useContext, useEffect, useState } from "react"
import { CodeInfo } from "../../components/CodeCardContent"
import MyCode from "./MyCode"

export default function MyCodes() {
    const { user } = useContext(UserContext)
    const [codes, setCodes] = useState<Array<CodeInfo>>([])

    useEffect(() => {
        if (!user) return
        const fetchMyCodes = async () => {
            const res = await axios.post(api + 'my-codes/', { id_token: await user.getIdToken() })
            if (res.status === 200)
                setCodes(res.data.results)
        }
        fetchMyCodes()
    }, [])

    return (
        <main className="flex-1 flex flex-col gap-5 px-5 overflow-auto">
            {codes.map((code) => <MyCode key={code.code} code={code} />)}
        </main>
    )
}
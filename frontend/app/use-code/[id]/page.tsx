"use client"
import { UserContext } from "@/app/firebase";
import Code, { QrCode } from "@/app/my-codes/components/Code";
import { backend } from "@/config";
import Button from "@mui/material/Button/Button";
import CircularProgress from "@mui/material/CircularProgress/CircularProgress";
import axios from "axios";
import { useContext, useEffect, useState } from "react";

export default function Page({ params: { id } }: { params: { id: string } }) {
    const { user } = useContext(UserContext)
    const [code, setCode] = useState<QrCode | null>(null)

    useEffect(() => {
        if (!user) return
        const fetchMyCodes = async () => {
            const res = await axios.post(backend + 'get-code/', { id_token: await user.getIdToken() })
            if (res.status === 200)
                setCode(res.data)
        }
        fetchMyCodes()
    }, [code])
    return (
        <main className="flex-1 flex flex-col gap-5 px-5 overflow-auto">
            Use code: {id}
            {code ? <Code code={code} /> : <CircularProgress />}
            <Button>Accept</Button>
        </main>
    )
}
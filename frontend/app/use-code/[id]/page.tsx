"use client"
import { api } from "@/config";
import CircularProgress from "@mui/material/CircularProgress/CircularProgress";
import axios from "axios";
import { useEffect, useState } from "react";
import CodeToScan from "./components/CodeToScan";
import { CodeInfo } from "@/app/components/CodeCardContent";

export default function Page({ params: { id } }: { params: { id: string } }) {
    const [code, setCode] = useState<CodeInfo | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axios.get(api + 'get-code/' + id)
            .then(res => setCode(res.data))
            .catch(alert)
            .finally(() => setLoading(false))
    }, [id])

    return (
        <main className="flex-1 flex flex-col gap-5 px-5 overflow-auto">
            {loading ? <CircularProgress /> :
                code ? <CodeToScan code={code} /> : "Kod nie istnieje"}
        </main>
    )
}
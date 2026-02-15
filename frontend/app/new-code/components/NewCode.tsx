import axios from "axios"
import { NoUserError, UserContext } from "../../firebase"
import { api } from "@/config"
import { useContext, useState } from "react"
import TextField from '@mui/material/TextField';
import { Alert, Button } from "@mui/material";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

// TODO: check if user has permissions to select use limit and activates etc
export default function NewCode() {
    const { user } = useContext(UserContext)
    const router = useRouter()

    const [description, setDescription] = useState('Przelew')
    const [money, setMoney] = useState(0)
    const [perPersonLimit, setPerPersonLimit] = useState(1)
    const [useLimit, setUseLimit] = useState(1)
    const [activates, setActivates] = useState(dayjs())
    const [expires, setExpires] = useState(dayjs().add(5, 'minute'))
    const [error, setError] = useState<string | null>(null)

    const makeQr = async () => {
        if (!user) throw new NoUserError('Failed to generate QR code')
        setError(null)
        try {
            const res = await axios.post(api + 'make-qr/', {
                id_token: await user.getIdToken(),
                code_params: {
                    'money': money,
                    'description': description,
                    'per_person_limit': perPersonLimit,
                    'use_limit': useLimit,
                    'activates': activates.toISOString(),
                    'expires': expires.toISOString(),
                }
            })
            console.log(res.data)
            router.push('/my-codes')
        } catch (e) {
            if (axios.isAxiosError(e) && e.response?.status === 403) {
                setError('Nie masz uprawnień do tworzenia kodów.')
            } else if (axios.isAxiosError(e) && e.response?.status === 400) {
                setError('Nieprawidłowe parametry kodu.')
            } else {
                setError('Wystąpił błąd. Spróbuj ponownie.')
            }
        }
    }

    return user && (
        <main className="flex-1 flex flex-col items-center justify-center gap-5">
            <h1 className="text-4xl">Wygeneruj kod QR</h1>
            {error && <Alert severity="error">{error}</Alert>}
            <form action={makeQr} className="flex flex-col gap-2">
                <TextField
                    label="Opis"
                    variant="outlined"
                    placeholder="Przelew"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <TextField
                    label="Kwota"
                    variant="outlined"
                    type="number"
                    value={money}
                    onChange={(e) => setMoney(Number(e.target.value))}
                />
                <TextField
                    label="Limit użyć"
                    variant="outlined"
                    type="number"
                    value={useLimit}
                    onChange={(e) => setUseLimit(Number(e.target.value))}
                />
                <TextField
                    label="Limit na osobę"
                    variant="outlined"
                    type="number"
                    value={perPersonLimit}
                    onChange={(e) => setPerPersonLimit(Number(e.target.value))}
                />
                <DateTimePicker
                    label="Aktywny od"
                    value={activates}
                    onChange={d => d !== null && setActivates(d)} />
                <DateTimePicker
                    label="Aktywny do"
                    value={expires}
                    onChange={d => d !== null && setExpires(d)} />
                <Button
                    variant="outlined"
                    type="submit">
                    Wygeneruj kod
                </Button>
            </form>
        </main>
    )
}
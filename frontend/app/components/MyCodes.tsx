import axios from "axios"
import { NoUserError, UserContext } from "../firebase"
import { backend } from "@/config"
import { useContext } from "react"

export default function MyCodes() {
    const { user } = useContext(UserContext)
    const makeQr = async () => {
        if (!user) throw new NoUserError('Failed to generate QR code')
        const res = await axios.post(backend + 'make-qr/', {
            id_token: await user.getIdToken(),
            code_params: {
                'money': 10,
                'description': 'test_description',
                'people_limit': 10,
                'use_limit': 1
            }
        })
        console.log(res.data)
        // display qr code
    }
    return user && (
        <main className="flex-1 flex flex-col items-center justify-center gap-2">
            <h1 className="text-4xl">Wygeneruj kod QR</h1>
            <form action={makeQr}>
                <button type="submit" >Wygeneruj</button>
            </form>
        </main>
    )
}
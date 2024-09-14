import axios from "axios"
import { NoUserError, useAuth } from "../hooks/firebase"
import { backend } from "@/config"

export default function MakeQr({ className, text = "🌲" }: { className?: string, text?: string }) {
    const [user, setUser] = useAuth()
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
        <button className={className} onClick={makeQr}>{text}</button>
    )
}
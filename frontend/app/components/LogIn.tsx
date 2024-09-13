import { auth, provider, useAuth } from "../firebase";

export class SignInError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "SignInError";
    }
}

export default function LogIn() {
    const [user, setUser] = useAuth()
    const signInWithGoogle = async () => {
        const userCredential = await auth.signInWithPopup(provider)
        const user = userCredential.user
        if (!user)
            throw new SignInError('Failed to sign in')
        setUser(user)
    }
    return (
        <div className="flex h-full flex-col items-center justify-center">
            <button onClick={signInWithGoogle}>Zaloguj się</button>
        </div>
    )
}


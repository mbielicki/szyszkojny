import { useContext } from "react";
import { auth, provider, UserContext } from "../firebase";
import { Button } from "@mui/material";

export class SignInError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "SignInError";
    }
}

export default function LogIn() {
    const { setUser } = useContext(UserContext)

    const signInWithGoogle = async () => {
        const userCredential = await auth.signInWithPopup(provider)
        const user = userCredential.user
        if (!user)
            throw new SignInError('Failed to sign in')
        setUser(user)
    }

    return (
        <div className="flex h-full flex-col items-center justify-center">
            <Button
                variant="outlined"
                onClick={signInWithGoogle}>
                Zaloguj się
            </Button>
        </div>
    )
}


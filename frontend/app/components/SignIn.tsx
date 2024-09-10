import { auth, provider } from "../page";

import firebase from "firebase/compat/app";
import 'firebase/compat/auth'

export default function SignIn({ setUser }: { setUser: (user: firebase.User | null) => void }) {
    const signInWithGoogle = () => {
        auth
            .signInWithPopup(provider)
            .then((result) => {
                const credential = result.credential;
                // The signed-in user info.
                const user = result.user
                setUser(user)
            })
            .catch(console.error);
    }
    return (
        <div className="flex h-full flex-col items-center justify-center">
            <button onClick={signInWithGoogle}>Zaloguj się</button>
        </div>
    )
}


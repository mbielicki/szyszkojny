import { auth } from "../page";

import firebase from "firebase/compat/app";
import 'firebase/compat/auth'

export default function SignOut({ setUser }: { setUser: (user: firebase.User | null) => void }) {
    return auth.currentUser && (
        <button onClick={() => auth.signOut().then(() => setUser(null))}>Wyloguj</button>
    )
}


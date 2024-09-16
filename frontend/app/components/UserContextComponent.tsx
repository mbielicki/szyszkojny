"use client"

import { useEffect, useState } from "react"
import { UserContext, User, auth } from "../firebase"

export default function UserContextComponent({ children }: { children: React.ReactNode }) {

    const [user, setUser] = useState<User | null>(auth.currentUser)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);


    return (
        <UserContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </UserContext.Provider>
    )
}
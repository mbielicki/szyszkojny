"use client"

import { useEffect, useState } from "react"
import { UserContext, User, auth } from "../firebase"

export default function UserContextComponent({ children }: { children: React.ReactNode }) {

    const [user, setUser] = useState<User | null>(auth.currentUser)

    useEffect(() => {
        auth.onAuthStateChanged(setUser)
    }, [])


    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    )
}
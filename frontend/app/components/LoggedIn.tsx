"use client"
import { useContext } from "react";
import LogIn from "./LogIn";
import { UserContext } from "../firebase";
import PageLoading from "./PageLoading";

export default function Home({ children }: { children: React.ReactNode }) {
    const { user, loading } = useContext(UserContext)

    return (
        <>
            {loading ? <PageLoading /> :
                user ? children : <LogIn />}
        </>
    );
}

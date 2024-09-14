"use client"

import { useEffect, useState } from "react";
import Dashboard from "./components/Dashboard";
import LogIn from "./components/LogIn";
import { auth, User, UserContext } from "./firebase";

export default function Home() {
  const [user, setUser] = useState<User | null>(auth.currentUser)

  useEffect(() => {
    auth.onAuthStateChanged(setUser)
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {user ? <Dashboard /> : <LogIn />}
    </UserContext.Provider>
  );
}

"use client"

import Dashboard from "./components/Dashboard";
import LogIn from "./components/LogIn";
import { useAuth } from "./hooks/firebase";
import { useEffect, useState } from "react";

export default function Home() {
  const [user, setUser] = useAuth()
  return (
    <>
      {user ? <Dashboard /> : <LogIn />}
    </>
  );
}

"use client"

import Dashboard from "./components/Dashboard";
import firebase from "firebase/compat/app";
import 'firebase/compat/firestore'
import 'firebase/compat/auth'

import { useState } from "react";
import SignIn from "./components/SignIn";

firebase.initializeApp({
  apiKey: "AIzaSyCAFTW9lZZs_Rov1vIo-HuXVI-QaCrHsm8",
  authDomain: "szyszkojny.firebaseapp.com",
  projectId: "szyszkojny",
  storageBucket: "szyszkojny.appspot.com",
  messagingSenderId: "821014673117",
  appId: "1:821014673117:web:f33a64b45c55a6491fcd34",
  measurementId: "G-X57PD7DW2G"
})

export const auth = firebase.auth()
export const firestore = firebase.firestore()

export const provider = new firebase.auth.GoogleAuthProvider();
auth.useDeviceLanguage();


export default function Home() {
  const [user, setUser] = useState<firebase.User | null>(null)
  return (
    <>
      {user ? <Dashboard user={user} /> : <SignIn setUser={setUser} />}
    </>
  );
}

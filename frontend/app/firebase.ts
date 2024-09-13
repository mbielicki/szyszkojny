import firebase from "firebase/compat/app";
import 'firebase/compat/firestore'
import 'firebase/compat/auth'
import { Dispatch, SetStateAction, useEffect, useState } from "react";

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
auth.useDeviceLanguage();
export const firestore = firebase.firestore()

export const provider = new firebase.auth.GoogleAuthProvider();

export type User = firebase.User
export const persistence = firebase.auth.Auth.Persistence
export const useAuth: () => [User | null, Dispatch<SetStateAction<User | null>>] = () => {
    const [user, setUser] = useState<User | null>(auth.currentUser)
    useEffect(() => {
        auth.onAuthStateChanged(setUser)
    }, [])
    return [user, setUser]
}


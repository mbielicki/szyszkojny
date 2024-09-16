import firebase from "firebase/compat/app";
import 'firebase/compat/firestore'
import 'firebase/compat/auth'
import { createContext, Dispatch, SetStateAction } from "react";

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


type UserState = {user: User | null, setUser: Dispatch<SetStateAction<User | null>>}
export const UserContext = createContext<UserState>({user: null, setUser: () => {}})


export class NoUserError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "NoUserError";
    }
}

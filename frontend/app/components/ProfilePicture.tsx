import firebase from "firebase/compat/app";
import "firebase/compat/auth"
import { useEffect } from "react";
import Image from "next/image";

export default function ProfilePicture({ user }: { user: firebase.User }) {
    return (
        <Image className="rounded-full" src={user.photoURL ? user.photoURL : "./src/blank-profile-picture.webp"}
            width={32} height={32} alt="profile picture" />
    )
}
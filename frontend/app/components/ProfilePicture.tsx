import { useContext } from "react";
import { UserContext } from "../firebase"
import Image from "next/image";

export default function ProfilePicture() {
    const { user } = useContext(UserContext)

    // TODO: Add onError to show blank profile picture
    return (
        <Image className="rounded-full" src={user?.photoURL ?? "/blank-profile-picture.webp"}
            width={32} height={32} alt="profile picture" />
    )
}
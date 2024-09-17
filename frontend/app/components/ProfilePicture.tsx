import { useContext } from "react";
import { UserContext } from "../firebase"
import Image from "next/image";

export default function ProfilePicture() {
    const { user } = useContext(UserContext)

    // TODO: Add onError to show blank profile picture
    return (
        <div className="h-full p-2 aspect-square">
            <div className="relative size-full ">
                <Image className="rounded-full" src={user?.photoURL ?? "/blank-profile-picture.webp"}
                    fill alt="profile picture" />
            </div>
        </div>
    )
}
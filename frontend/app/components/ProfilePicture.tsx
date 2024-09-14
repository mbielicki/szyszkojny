import { User } from "../hooks/firebase"
import Image from "next/image";

export default function ProfilePicture({ user }: { user: User | null }) {
    // TODO: Add onError to show blank profile picture
    return (
        <Image className="rounded-full" src={user?.photoURL ?? "/blank-profile-picture.webp"}
            width={32} height={32} alt="profile picture" />
    )
}
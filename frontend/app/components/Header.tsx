import { useContext } from "react";
import { UserContext } from "../firebase";
import ProfilePicture from "./ProfilePicture";

export default function Header() {
    const { user } = useContext(UserContext)

    return <header className="h-[--header-h] flex justify-between items-center">
        <span className="text-xl p-3">{user?.displayName}</span>
        <ProfilePicture />
    </header>;
}
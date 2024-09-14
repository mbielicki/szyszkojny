import { useContext } from "react";
import { UserContext } from "../firebase";
import ProfilePicture from "./ProfilePicture";

export default function Header() {
    const { user } = useContext(UserContext)

    return <header className="p-2 flex justify-between">
        <span>{user?.displayName}</span>
        <ProfilePicture />
    </header>;
}
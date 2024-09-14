import { User } from "../hooks/firebase";
import ProfilePicture from "./ProfilePicture";

export default function Header({ user }: { user: User | null }) {
    return <header className="p-2 flex justify-between">
        <span>{user?.displayName}</span>
        <ProfilePicture user={user} />
    </header>;
}
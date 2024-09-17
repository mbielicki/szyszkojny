import LogOut from "./LogOut";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="h-[--footer-h] flex gap-6 flex-wrap items-center justify-center text-4xl">
            <LogOut className="text-4xl hover:opacity-10" text="🏠" />
            <Link
                className="text-4xl"
                href="/my-codes">
                Q
            </Link>
            <Link
                className="text-4xl"
                href="/">
                🪙
            </Link>
            <Link
                className="text-4xl"
                href="/new-code">
                🌲
            </Link>
        </footer>
    )
}

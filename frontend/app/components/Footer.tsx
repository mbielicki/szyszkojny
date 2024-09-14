import LogOut from "./LogOut";
import MakeQr from "./MakeQr";

export default function Footer() {
    return (
        <footer className="p-2 flex gap-6 flex-wrap items-center justify-center text-4xl">
            <LogOut className="text-4xl hover:opacity-10" text="🏠" />
            <a
                className="text-4xl hover:opacity-10"
                href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            >
                🪙
            </a>
            <MakeQr className="text-4xl hover:opacity-10" />
        </footer>
    )
}

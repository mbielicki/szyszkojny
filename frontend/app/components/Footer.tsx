import { Dispatch, SetStateAction } from "react";
import { Navigation } from "../hooks/useNav";
import LogOut from "./LogOut";

export default function Footer({ nav, setNav }: { nav: Navigation, setNav: Dispatch<SetStateAction<Navigation>> }) {
    return (
        <footer className="p-2 flex gap-6 flex-wrap items-center justify-center text-4xl">
            <LogOut className="text-4xl hover:opacity-10" text="🏠" />
            <button
                className={nav === Navigation.codes ? "text-3xl opacity-50" : "text-4xl"}
                onClick={() => setNav(Navigation.codes)}>
                Q
            </button>
            <button
                className={nav === Navigation.balance ? "text-3xl opacity-50" : "text-4xl"}
                onClick={() => setNav(Navigation.balance)}>
                🪙
            </button>
            <button
                className={nav === Navigation.newCode ? "text-3xl opacity-50" : "text-4xl"}
                onClick={() => setNav(Navigation.newCode)}>
                🌲
            </button>
        </footer>
    )
}

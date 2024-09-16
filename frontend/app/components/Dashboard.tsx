"use client"
import Header from "./Header";
import Footer from "./Footer";


export default function Dashboard({ children }: { children: React.ReactNode }) {

    return (
        <div className="flex h-full flex-col">
            <Header />
            {children}
            <Footer />
        </div>
    );
}

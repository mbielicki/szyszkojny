export default function MyBalance({ money }: { money: number | null }) {
    return (
        <main className="flex-1 flex flex-col items-center justify-center gap-2">
            <h1 className="text-4xl">Czuwaj!</h1>
            <div>Twoje szyszkojny:</div>
            <h2 className="text-3xl">{money ?? "..."} 🪙</h2>
        </main>
    )
}
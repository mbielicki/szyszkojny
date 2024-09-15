export type QrCode = {
    code: string,
    issuer: string,
    money: number,
    description: string,
    per_person_limit: number,
    use_limit: number,
    activates: string,
    expires: string,
}

export default function Code({ code }: { code: QrCode }) {

    return (
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
            <h1>{code.code}</h1>
            <h1>{code.issuer}</h1>
            <h1>{code.money}</h1>
            <h1>{code.description}</h1>
            <h1>{code.per_person_limit}</h1>
            <h1>{code.use_limit}</h1>
            <h1>{code.activates}</h1>
            <h1>{code.expires}</h1>
        </div>
    )
}
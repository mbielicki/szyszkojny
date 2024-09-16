import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';

import localizedFormat from "dayjs/plugin/localizedFormat";
import 'dayjs/locale/pl';
dayjs.locale('pl');

export type CodeInfo = {
    code: string,
    issuer: string,
    money: number,
    description: string,
    per_person_limit: number,
    use_limit: number,
    activates: string,
    expires: string,
}
dayjs.extend(localizedFormat)

function styleMoney(money: number) {
    const positive = money >= 0

    return <span className={positive ? 'text-green-500' : 'text-red-500'}>
        {positive ? '+' : ''}{money}
    </span>
}

export default function CodeCardContent({ code }: { code: CodeInfo }) {
    return (
        <CardContent>
            <Typography gutterBottom variant="h5">
                {code.description}
            </Typography>
            <Typography variant="h4">
                {styleMoney(code.money)}
            </Typography>
            <Typography>
                <p className='mt-1'>
                    <b className='mr-3'>Limit użyć:</b> {code.use_limit ?? "bez limitu"}
                </p>
                <p className='mt-1'>
                    <b className='mr-3'>Limit na osobę:</b> {code.per_person_limit ?? "bez limitu"}
                </p>
                <p className='mt-1'>
                    <b className='mr-3'>Ważny od:</b> {dayjs(code.activates).format("lll")}
                </p>
                <p className='mt-1'>
                    <b className='mr-3'>Do:</b> {dayjs(code.expires).format("lll")}
                </p>
            </Typography>
        </CardContent>
    )
}
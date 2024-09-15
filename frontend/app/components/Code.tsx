import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField/DateTimeField';

import localizedFormat from "dayjs/plugin/localizedFormat";
import 'dayjs/locale/pl';
dayjs.locale('pl');

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
dayjs.extend(localizedFormat)
export default function Code({ code }: { code: QrCode }) {
    return (
        <Card className='flex-shrink-0'>
            <CardMedia className='aspect-square'
                image="/some-qr.svg"
            />
            <CardContent>
                <Typography gutterBottom variant="h5" >
                    {code.description}
                </Typography>
                <Typography variant="h4">
                    {code.money}
                </Typography>
                <Typography >
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
            <CardActions>
                <Button size="small">Usuń</Button>
                <Button size="small">Edytuj</Button>
            </CardActions>
        </Card>
    )
}
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import CodeCardContent, { CodeInfo } from '../../components/CodeCardContent';
import QRCode from 'react-qr-code';

export default function MyCode({ code }: { code: CodeInfo }) {
    return (
        <Card className='flex-shrink-0'>
            <QRCode
                className='bg-white p-2 w-full h-fit'
                value={window.location.origin + '/use-code/' + code.code} />
            <CodeCardContent code={code} />
            <CardActions>
                <Button size="small">Usuń</Button>
                <Button size="small">Edytuj</Button>
            </CardActions>
        </Card>
    )
}
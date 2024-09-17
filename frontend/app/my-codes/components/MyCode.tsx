import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import CodeCardContent, { CodeInfo } from '../../components/CodeCardContent';
import QRCode from 'react-qr-code';

export default function MyCode({ code }: { code: CodeInfo }) {
    return (
        <Card className='flex-shrink-0 flex flex-col justify-center md:flex-row
                        w-full max-w-[30rem] md:w-auto md:max-w-full '>
            <div className='aspect-square md:h-[--main-h] md:max-h-[calc(100vw-25rem)]'>
                <QRCode
                    className='bg-white p-2 w-full h-full'
                    value={window.location.origin + '/use-code/' + code.code} />
            </div>
            <div className=''>
                <CodeCardContent code={code} />
                <CardActions>
                    <Button size="small">Usuń</Button>
                    <Button size="small">Edytuj</Button>
                </CardActions>
            </div>
        </Card>
    )
}
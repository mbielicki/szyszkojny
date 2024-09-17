import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import CodeCardContent, { CodeInfo } from '../../components/CodeCardContent';
import QRCode from 'react-qr-code';

export default function MyCode({ code }: { code: CodeInfo }) {
    return (
        <Card className='flex-shrink-0 flex flex-col justify-center md:flex-row
                        w-full max-w-[30rem] md:max-w-full md:w-auto
                        '>
            <div className='aspect-square flex-shrink md:max-h-[--main-h] md:max-w-[--main-h]
                            '>
                <QRCode
                    className='bg-white p-2 w-full h-full'
                    size={1024}
                    value={window.location.origin + '/use-code/' + code.code} />
            </div>
            <div className='md:flex-shrink-0'>
                <CodeCardContent code={code} />
                <CardActions>
                    <Button size="small">Usuń</Button>
                    <Button size="small">Edytuj</Button>
                </CardActions>
            </div>
        </Card>
    )
}
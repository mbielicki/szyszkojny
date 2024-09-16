import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import CodeCardContent, { CodeInfo } from "@/app/components/CodeCardContent";

export default function MyCode({ code }: { code: CodeInfo }) {
    return (
        <Card className='flex-shrink-0'>
            <CodeCardContent code={code} />
            <CardActions>
                <Button size="small">Akceptuj</Button>
            </CardActions>
        </Card>
    )
}
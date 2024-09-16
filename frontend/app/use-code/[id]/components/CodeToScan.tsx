import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import CodeCardContent, { CodeInfo } from "@/app/components/CodeCardContent";
import { UserContext } from '@/app/firebase';
import { useContext } from 'react';
import axios from 'axios';
import { api } from '@/config';
import { useRouter } from 'next/navigation';

export default function MyCode({ code }: { code: CodeInfo }) {
    const { user } = useContext(UserContext)
    const router = useRouter()

    const useCode = async () => {
        if (!user) return
        const data = {
            id_token: await user.getIdToken(),
            code: code.code
        }

        axios.post(api + 'use-code/', data).then(res => {
            if (res.status === 200) router.push("/")
        }).catch(e => alert(JSON.stringify(e.response.data)))
    }

    return (
        <Card className='flex-shrink-0'>
            <CodeCardContent code={code} />
            <CardActions>
                <Button size="small" onClick={useCode}>Akceptuj</Button>
            </CardActions>
        </Card>
    )
}
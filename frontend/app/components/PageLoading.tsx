import CircularProgress from '@mui/material/CircularProgress';

export default function PageLoading() {
    return (
        <div className="flex h-full flex-col items-center justify-center">
            <CircularProgress />
        </div>
    )
}

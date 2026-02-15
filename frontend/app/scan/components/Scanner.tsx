"use client"
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Alert, Button } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { Html5Qrcode } from "html5-qrcode";

export default function Scanner() {
    const router = useRouter();
    const runningRef = useRef(false);
    const [mode, setMode] = useState<"loading" | "camera" | "file">("loading");
    const [error, setError] = useState<string | null>(null);

    const navigateToCode = (decodedText: string) => {
        const match = decodedText.match(/\/use-code\/([^/?#]+)/);
        if (match) {
            router.push(`/use-code/${match[1]}`);
        } else {
            router.push(`/use-code/${decodedText}`);
        }
    };

    // Try live camera scanning
    useEffect(() => {
        let cancelled = false;
        let scanner: Html5Qrcode | null = null;

        const onScan = (decodedText: string) => {
            if (runningRef.current) {
                runningRef.current = false;
                scanner?.stop().catch(() => {});
                navigateToCode(decodedText);
            }
        };

        const config = { fps: 10, qrbox: { width: 250, height: 250 } };

        const start = async () => {
            scanner = new Html5Qrcode("qr-reader");
            try {
                await scanner.start(
                    { facingMode: "environment" },
                    config, onScan, () => {}
                );
            } catch {
                try {
                    await scanner.start(
                        { facingMode: "user" },
                        config, onScan, () => {}
                    );
                } catch {
                    if (!cancelled) setMode("file");
                    return;
                }
            }
            if (cancelled) {
                scanner.stop().catch(() => {});
            } else {
                runningRef.current = true;
                setMode("camera");
            }
        };

        start();

        return () => {
            cancelled = true;
            if (runningRef.current) {
                runningRef.current = false;
                scanner?.stop().catch(() => {});
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setError(null);
        const scanner = new Html5Qrcode("qr-file-tmp");
        try {
            const result = await scanner.scanFileV2(file, false);
            navigateToCode(result.decodedText);
        } catch {
            setError("Nie znaleziono kodu QR na zdjęciu");
        }
    };

    return (
        <Box className="flex flex-col items-center gap-4 p-4">
            <Typography variant="h6">Zeskanuj kod QR</Typography>

            {/* Live camera view (hidden when in file mode) */}
            <Box
                id="qr-reader"
                sx={{
                    width: "100%",
                    maxWidth: 400,
                    display: mode === "file" ? "none" : "block",
                }}
            />

            {/* Hidden element for scanFileV2 */}
            <Box id="qr-file-tmp" sx={{ display: "none" }} />

            {/* File/photo fallback */}
            {mode === "file" && (
                <Button
                    variant="contained"
                    component="label"
                    startIcon={<CameraAltIcon />}
                    size="large"
                >
                    Zrób zdjęcie kodu
                    <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        hidden
                        onChange={handleFile}
                    />
                </Button>
            )}

            {error && <Alert severity="error">{error}</Alert>}
        </Box>
    );
}

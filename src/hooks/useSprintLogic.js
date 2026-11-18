// src/hooks/useSprintLogic.js
import { useState, useCallback } from "react";
import { useChat } from '@ai-sdk/react';
import { bumpUnit } from '../utils/helpers';
import { callVision } from '../api/ai';

export function useSprintLogic(activeAgent, activeUnit, setProgress) {
    const [scanImage, setScanImage] = useState(null);
    const [scanResult, setScanResult] = useState(null);
    const [scanning, setScanning] = useState(false);

    const runScan = useCallback(async (scanImageFile, sampleFn, allUnits, studentContext, baseRules) => {
        if (!scanImageFile || !sampleFn) return;
        setScanning(true);
        setScanResult(null);
        const prompt = [
            "Kamu asisten yang membaca foto soal matematika, kimia, ATAU fisika SMA (kelas 10-12).",
            "Langkah: (1) sebutkan mata pelajaran, kelas (10/11/12), dan topik yang paling cocok dari daftar ini: " +
                allUnits.map((u) => u.title + " (" + u.subject + ", kelas " + u.grade + ")").join(", ") +
                ". (2) tuliskan ulang soalnya singkat. (3) berikan penyelesaian langkah demi langkah sampai jawaban akhir.",
            studentContext,
            baseRules,
        ].join("\n\n");

        try {
            const resText = await callVision(prompt, scanImageFile);
            setScanResult(resText);
            setProgress((p) => bumpUnit(p, "scan-umum", 5));
        }
        catch (e) {
            setScanResult("Gagal membaca foto: error");
        }
        finally {
            setScanning(false);
        }
    }, [setProgress]);

    return {
        scanImage,
        setScanImage,
        scanResult,
        setScanResult,
        scanning,
        runScan
    };
}

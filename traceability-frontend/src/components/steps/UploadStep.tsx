"use client";

import React, { useCallback, useState } from "react";
import { UploadCloud, FileUp } from "lucide-react";

interface UploadStepProps {
    onNext: (file: File) => void;
}

export default function UploadStep({ onNext }: UploadStepProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    const handleFile = (file: File) => {
        if (!file) return;

        // Example: validate file size
        if (file.size > 5 * 1024 * 1024) {
            alert("ไฟล์ใหญ่เกิน 5MB");
            return;
        }

        setPreview(URL.createObjectURL(file));
        onNext(file);
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = () => setIsDragging(false);

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    return (
        <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Import Your File
            </h2>

            <div
                className={`border-2 border-dashed rounded-2xl p-10 cursor-pointer transition-all
                ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400"}`}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
            >
                <label className="flex flex-col items-center gap-3 cursor-pointer">
                    <UploadCloud className="w-12 h-12 text-gray-500" />
                    <span className="text-gray-600">
                        Click or drag file to upload
                    </span>
                    <input type="file" className="hidden" onChange={onInputChange} />
                </label>
            </div>

            {preview && (
                <div className="mt-6 p-4 border rounded-xl bg-gray-50 flex items-center gap-4">
                    <FileUp className="text-blue-600 w-7 h-7" />
                    <span className="text-gray-700">File selected</span>
                </div>
            )}
        </div>
    );
}

"use client";

import React from "react";

interface UploadStepProps {
    onNext: (file: File) => void;
}

export default function UploadStep({ onNext }: UploadStepProps) {
    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onNext(file);
        }
    };

    return (
        <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">Upload Your File</h2>

            <label className="border-2 border-dashed border-gray-400 p-10 block cursor-pointer rounded-xl hover:border-blue-500">
                <input type="file" className="hidden" onChange={handleUpload} />
                <span className="text-gray-600">Click to upload your file</span>
            </label>
        </div>
    );
}

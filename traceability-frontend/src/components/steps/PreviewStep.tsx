"use client";

import React from "react";

interface PreviewStepProps {
    file: File;
    onNext: () => void;
    onBack: () => void;
}

export default function PreviewStep({ file, onNext, onBack }: PreviewStepProps) {
    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Preview File</h2>

            <p className="text-gray-700 mb-4">
                File name: <strong>{file?.name}</strong>
            </p>

            <div className="flex justify-between mt-8">
                <button
                    className="px-4 py-2 bg-gray-200 rounded-lg"
                    onClick={onBack}
                >
                    Back
                </button>

                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                    onClick={onNext}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

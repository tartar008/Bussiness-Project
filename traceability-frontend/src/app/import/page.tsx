"use client";

import { useState } from "react";
import { useStep } from "@/hooks/useStep";

import {
    Stepper,
    LayoutContainer,
    UploadStep,
    PreviewStep,
    MappingStep,
    ConfirmStep,
} from "@/components";

export default function ImportPage() {
    const { step, next, back } = useStep();
    const [file, setFile] = useState<File | null>(null);

    const handleUpload = (file: File) => {
        setFile(file);
        next();
    };

    return (
        <LayoutContainer>
            <Stepper active={step} />

            {step === 1 && <UploadStep onNext={handleUpload} />}

            {step === 2 && file && (
                <PreviewStep file={file} onNext={next} onBack={back} />
            )}

            {step === 3 && (
                <MappingStep onNext={next} onBack={back} />
            )}

            {step === 4 && (
                <ConfirmStep onBack={back} />
            )}
        </LayoutContainer>
    );
}

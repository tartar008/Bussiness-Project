import { useState } from "react";

export const useStep = (initial = 1) => {
    const [step, setStep] = useState(initial);

    const next = () => setStep((prev) => prev + 1);
    const back = () => setStep((prev) => prev - 1);
    const goTo = (n) => setStep(n);

    return { step, next, back, goTo };
};

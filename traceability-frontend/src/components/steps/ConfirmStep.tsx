"use client";

interface ConfirmStepProps {
    onBack: () => void;
}

export default function ConfirmStep({ onBack }: ConfirmStepProps) {
    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Confirm</h2>

            <p className="text-gray-600 mb-6">
                Everything looks good. Click Submit to finish.
            </p>

            <div className="flex justify-between mt-8">
                <button
                    className="px-4 py-2 bg-gray-200 rounded-lg"
                    onClick={onBack}
                >
                    Back
                </button>

                <button
                    className="px-4 py-2 bg-green-500 text-white rounded-lg"
                    onClick={() => alert("Submitted!")}
                >
                    Submit
                </button>
            </div>
        </div>
    );
}

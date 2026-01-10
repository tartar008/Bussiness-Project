"use client";

import React from "react";

const steps = ["Upload", "Preview", "Mapping", "Confirm"];

interface StepperProps {
    active: number; // กำหนดว่าเป็นหมายเลข step ที่ active อยู่
}

export default function Stepper({ active }: StepperProps) {
    return (
        <div className="flex justify-center gap-6 my-6">
            {steps.map((label, index) => {
                const stepNumber = index + 1;
                const isActive = active === stepNumber;
                const isDone = active > stepNumber;

                return (
                    <div key={index} className="flex flex-col items-center">
                        <div
                            className={`
                                w-10 h-10 flex items-center justify-center rounded-full border-2
                                ${isDone ? "bg-green-500 text-white border-green-500" : ""}
                                ${isActive ? "border-blue-500 text-blue-600" : "border-gray-400"}
                            `}
                        >
                            {stepNumber}
                        </div>

                        <span
                            className={`mt-2 text-sm ${isActive ? "text-blue-600" : "text-gray-500"
                                }`}
                        >
                            {label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

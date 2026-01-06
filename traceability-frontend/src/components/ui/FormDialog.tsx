"use client";
import React from "react";
import { Button } from "./FormControls";

interface FormDialogProps {
    open: boolean;
    onClose: () => void;
    title: string;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    children: React.ReactNode;
}

export const FormDialog = ({ open, onClose, title, onSubmit, children }: FormDialogProps) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
            <form onSubmit={onSubmit} className="bg-white p-6 rounded shadow w-96 space-y-4">
                <h3 className="text-lg font-bold">{title}</h3>
                {children}
                <div className="flex justify-end gap-2">
                    <Button variant="ghost" type="button" onClick={onClose}>ยกเลิก</Button>
                    <Button type="submit">บันทึก</Button>
                </div>
            </form>
        </div>
    );
};

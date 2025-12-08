"use client";

import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

interface PreviewStepProps {
    file: File;
    onNext: () => void;
    onBack: () => void;
}

export default function PreviewStep({ file, onNext, onBack }: PreviewStepProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [textContent, setTextContent] = useState<string | null>(null);
    const [tableData, setTableData] = useState<string[][] | null>(null);

    useEffect(() => {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);

        const reader = new FileReader();

        // Excel / CSV Parser
        reader.onload = (e) => {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: "array" });

            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            setTableData(json as string[][]);
        };

        const isExcel =
            file.name.endsWith(".xlsx") ||
            file.name.endsWith(".xls") ||
            file.name.endsWith(".csv");

        if (isExcel) {
            reader.readAsArrayBuffer(file);
        }

        if (file.type.startsWith("text/") && !isExcel) {
            file.text().then(setTextContent);
        }

        return () => URL.revokeObjectURL(url);
    }, [file]);

    const isImage = file.type.startsWith("image/");
    const isPdf = file.type === "application/pdf";
    const isExcel =
        file.name.endsWith(".xlsx") ||
        file.name.endsWith(".xls") ||
        file.name.endsWith(".csv");

    return (
        <div className="max-w-4xl mx-auto px-4">
            {/* HEADER */}
            <div className="mb-8">
                <h2 className="text-3xl font-semibold tracking-tight mb-2">
                    File Preview
                </h2>
                <p className="text-gray-500 text-sm">
                    ตรวจสอบข้อมูลก่อนดำเนินการต่อ
                </p>
            </div>

            {/* FILE INFO CARD */}
            <div className="bg-white border rounded-xl shadow-sm p-5 mb-6">
                <div className="text-sm text-gray-600">
                    <span className="font-medium">Filename:</span>{" "}
                    <span className="text-gray-800">{file.name}</span>
                </div>
            </div>

            {/* EXCEL / CSV TABLE (Premium Preview) */}
            {isExcel && tableData && (
                <div className="overflow-auto max-h-[420px] rounded-xl border shadow-sm">
                    <table className="w-full text-sm border-collapse">
                        <thead className="bg-gray-100 sticky top-0 z-10">
                            <tr>
                                {tableData[0]?.map((_, j) => (
                                    <th
                                        key={j}
                                        className="px-4 py-2 text-left font-semibold text-gray-700 border-b"
                                    >
                                        {`Column ${j + 1}`}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {tableData.slice(1).map((row, i) => (
                                <tr
                                    key={i}
                                    className={`border-b transition ${i % 2 === 0 ? "bg-white" : "bg-gray-50"
                                        } hover:bg-blue-50`}
                                >
                                    {row.map((cell, j) => (
                                        <td key={j} className="px-4 py-2 text-gray-800 border-r">
                                            {cell || ""}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}


            {/* BUTTONS */}
            <div className="flex justify-between">
                <button
                    onClick={onBack}
                    className="px-5 py-2.5 rounded-lg border bg-white hover:bg-gray-50 transition"
                >
                    Back
                </button>

                <button
                    onClick={onNext}
                    className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                    Next
                </button>
            </div>
        </div>
    );
}

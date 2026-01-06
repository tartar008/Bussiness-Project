"use client";
import * as React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "./table";

interface Column<T> {
    key: string;
    label: string;
    render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    onAdd?: () => void;
    title?: string;
}

export const DataTable = <T extends { id: string | number }>({ columns, data, onAdd, title = "รายการ" }: DataTableProps<T>) => (
    <div className="space-y-4">
        <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">{title}</h2>
            {onAdd && <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={onAdd}>เพิ่ม</button>}
        </div>

        <Table>
            <TableHeader>
                <TableRow>
                    {columns.map(c => <TableHead key={c.key}>{c.label}</TableHead>)}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map(row => (
                    <TableRow key={row.id}>
                        {columns.map(c => <TableCell key={c.key}>{c.render ? c.render(row) : (row as any)[c.key]}</TableCell>)}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
);

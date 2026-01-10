'use client';

import { DataTable } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, MapPin } from 'lucide-react';
import { Plot } from '@/types/database';

interface Props {
    plots: Plot[];
    isLoading: boolean;
    onAdd: () => void;
    onEdit: (p: Plot) => void;
    onDelete: (id: string) => void;
    onSelect: (p: Plot) => void;
}

export function PlotTable({
    plots,
    isLoading,
    onAdd,
    onEdit,
    onDelete,
    onSelect,
}: Props) {
    const columns = [
        { key: 'plot_code', label: 'รหัสแปลง' },
        { key: 'plot_name', label: 'ชื่อแปลง' },
        { key: 'area_rai', label: 'พื้นที่ (ไร่)' },
        { key: 'province', label: 'จังหวัด' },
        {
            key: 'status',
            label: 'สถานะ',
            render: (p: Plot) => <StatusBadge status={p.status} />,
        },
        {
            key: 'actions',
            label: 'จัดการ',
            render: (p: Plot) => (
                <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => onSelect(p)}>
                        <MapPin className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => onEdit(p)}>
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => onDelete(p.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <DataTable
            columns={columns}
            data={plots}
            isLoading={isLoading}
            onAdd={onAdd}
            addLabel="เพิ่มแปลง"
            getRowKey={(p) => p.id}
        />
    );
}

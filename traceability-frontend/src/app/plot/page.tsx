'use client';

/**
 * app/plot/page.tsx
 * - Page = orchestration (state / data / dialog)
 * - Table / Form แยกเป็น component
 */

import { useState } from 'react';

import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';

import { PlotTable } from '@/components/plots/PlotTable';
import { PlotFormDialog } from '@/components/plots/PlotFormDialog';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import {
    usePlots,
    useCreatePlot,
    useUpdatePlot,
    useDeletePlot,
} from '@/hooks/usePlots';

/**
 * NOTE:
 * ถ้าคุณยังไม่มี Plot type กลาง
 * ใช้ any ไปก่อน แล้วค่อย refactor ทีหลัง
 */
type Plot = {
    id: string;
    plot_code: string;
    plot_name?: string | null;
    area_rai?: number | null;
    province?: string | null;
    status: string;
};

export default function PlotsPage() {
    /* ---------------- layout ---------------- */
    const [activeModule, setActiveModule] = useState('plots');

    /* ---------------- dialogs / state ---------------- */
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingPlot, setEditingPlot] = useState<Plot | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);

    /* ---------------- data ---------------- */
    const { data: plots = [], isLoading } = usePlots();
    const createPlot = useCreatePlot();
    const updatePlot = useUpdatePlot();
    const deletePlot = useDeletePlot();

    /* ---------------- handlers ---------------- */
    const openCreateDialog = () => {
        setEditingPlot(null);
        setIsDialogOpen(true);
    };

    const openEditDialog = (plot: Plot) => {
        setEditingPlot(plot);
        setIsDialogOpen(true);
    };

    const handleSubmit = async (formData: any) => {
        const payload = {
            plot_code: formData.plot_code,
            plot_name: formData.plot_name || null,
            area_rai: formData.area_rai ? Number(formData.area_rai) : null,
            province: formData.province || null,
            status: 'active',
        };

        if (editingPlot) {
            await updatePlot.mutateAsync({
                id: editingPlot.id,
                ...payload,
            });
        } else {
            await createPlot.mutateAsync(payload);
        }

        setIsDialogOpen(false);
        setEditingPlot(null);
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        await deletePlot.mutateAsync(deleteId);
        setDeleteId(null);
    };

    /* ---------------- LIST VIEW ---------------- */
    if (!selectedPlot) {
        return (
            <div className="flex min-h-screen bg-background">


                <main className="flex-1 overflow-auto">

                    <div className="p-6">
                        <PlotTable
                            plots={plots}
                            isLoading={isLoading}
                            onAdd={openCreateDialog}
                            onEdit={openEditDialog}
                            onDelete={(id) => setDeleteId(id)}
                            onSelect={(p) => setSelectedPlot(p)}
                        />
                    </div>
                </main>

                {/* ---- create / edit dialog ---- */}
                <PlotFormDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    editingPlot={editingPlot}
                    onSubmit={handleSubmit}
                    isLoading={createPlot.isPending || updatePlot.isPending}
                />

                {/* ---- delete confirm ---- */}
                <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>ยืนยันการลบ</AlertDialogTitle>
                            <AlertDialogDescription>
                                คุณต้องการลบแปลงนี้หรือไม่?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDelete}
                                className="bg-destructive text-destructive-foreground"
                            >
                                ลบ
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        );
    }

    /* ---------------- DETAIL VIEW (stub) ---------------- */
    return (
        <div className="flex min-h-screen bg-background">


            <main className="flex-1 overflow-auto">


                <div className="p-6">
                    <Button
                        variant="outline"
                        className="mb-4"
                        onClick={() => setSelectedPlot(null)}
                    >
                        ← กลับ
                    </Button>

                    {/* TODO:
            - Info
            - Geometry (GIS)
            - EUDR Status
          */}
                    <div className="text-muted-foreground">
                        หน้ารายละเอียด (จะเพิ่ม GIS / EUDR ต่อ)
                    </div>
                </div>
            </main>
        </div>
    );
}

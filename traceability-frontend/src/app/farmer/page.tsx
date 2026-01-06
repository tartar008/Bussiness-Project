"use client";

import { useState } from "react";
import { Pencil, Trash2, Eye } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import { FormDialog } from "@/components/ui/FormDialog";
import { Button, Input, Label } from "@/components/ui/FormControls";
import { useFarmers } from "@/hooks/useFarmers";
import { Farmer } from "@/types/farmer";

export default function FarmersPage() {
    const { farmers, loading, addFarmer, editFarmer, removeFarmer } = useFarmers();

    const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingFarmer, setEditingFarmer] = useState<Farmer | null>(null);

    const [form, setForm] = useState({
        prefix: "", firstName: "", lastName: "", citizenId: "", phone: "", address: ""
    });

    const handleOpenDialog = (farmer?: Farmer) => {
        if (farmer) {
            setEditingFarmer(farmer);
            setForm({
                prefix: farmer.prefix || "",
                firstName: farmer.firstName || "",
                lastName: farmer.lastName || "",
                citizenId: farmer.citizenId || "",
                phone: farmer.phone || "",
                address: farmer.address || "",
            });
        } else {
            setEditingFarmer(null);
            setForm({ prefix: "", firstName: "", lastName: "", citizenId: "", phone: "", address: "" });
        }
        setIsDialogOpen(true);
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (editingFarmer) await editFarmer(editingFarmer.id, form);
        else await addFarmer(form);
        setIsDialogOpen(false);
    };
    const handleDelete = async (id: string) => {
        if (!confirm("คุณแน่ใจว่าต้องการลบเกษตรกรนี้หรือไม่?")) return;
        await removeFarmer(id);
    };

    const columns = [
        { key: "prefix", label: "คำนำหน้า" },
        { key: "firstName", label: "ชื่อ" },
        { key: "lastName", label: "นามสกุล" },
        { key: "citizenId", label: "เลขบัตรประชาชน" },
        {
            key: "actions", label: "จัดการ",
            render: (f: Farmer) => (
                <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => setSelectedFarmer(f)}><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" onClick={() => handleOpenDialog(f)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" onClick={() => handleDelete(f.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                </div>
            )
        }
    ];

    return (
        <div className="min-h-screen p-6 bg-gray-50">
            <h1 className="text-2xl font-bold mb-4">จัดการเกษตรกร</h1>

            {loading ? <p>กำลังโหลดข้อมูล...</p> :
                !selectedFarmer ?
                    <DataTable columns={columns} data={farmers} onAdd={() => handleOpenDialog()} /> :
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-lg font-bold mb-2">{selectedFarmer.prefix} {selectedFarmer.firstName} {selectedFarmer.lastName}</h2>
                        <p>Citizen ID: {selectedFarmer.citizenId}</p>
                        <p>Phone: {selectedFarmer.phone}</p>
                        <p>Address: {selectedFarmer.address}</p>
                        <Button variant="ghost" onClick={() => setSelectedFarmer(null)}>กลับ</Button>
                    </div>
            }

            <FormDialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} title="เพิ่ม/แก้ไขเกษตรกร" onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <div><Label>คำนำหน้า</Label><Input value={form.prefix} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, prefix: e.target.value }))} /></div>
                    <div><Label>ชื่อ</Label><Input value={form.firstName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, firstName: e.target.value }))} /></div>
                    <div><Label>นามสกุล</Label><Input value={form.lastName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, lastName: e.target.value }))} /></div>
                    <div><Label>เลขบัตรประชาชน</Label><Input value={form.citizenId} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, citizenId: e.target.value }))} /></div>
                    <div><Label>โทรศัพท์</Label><Input value={form.phone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
                    <div><Label>ที่อยู่</Label><Input value={form.address} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, address: e.target.value }))} /></div>
                </div>
            </FormDialog>
        </div>
    );
}

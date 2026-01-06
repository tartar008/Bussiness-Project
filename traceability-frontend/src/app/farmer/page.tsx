"use client";

import { useState } from "react";
import { Pencil, Trash2, Eye } from "lucide-react";

// ------------------- Type Definitions -------------------
type Farmer = {
    id: string;
    farmer_code: string;
    first_name: string;
    last_name: string;
    id_card: string;
    phone?: string;
    address?: string;
    province?: string;
    district?: string;
    subdistrict?: string;
    postal_code?: string;
};

// ------------------- Helpers -------------------
const generateFarmerCode = () => `F${Date.now().toString(36).toUpperCase()}`;

// ------------------- UI Components -------------------
const Button = ({ children, onClick, variant = "default" }: any) => (
    <button
        onClick={onClick}
        className={`
      px-3 py-1 rounded-lg text-sm font-medium transition-colors
      ${variant === "ghost" ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "bg-blue-600 text-white hover:bg-blue-700"}
    `}
    >
        {children}
    </button>
);

const Input = ({ value, onChange, placeholder }: any) => (
    <input
        className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
    />
);

const Label = ({ children }: any) => (
    <label className="block mb-1 text-gray-700 font-semibold">{children}</label>
);

const Card = ({ children }: any) => (
    <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">{children}</div>
);

const FormDialog = ({ open, onClose, title, children, onSubmit }: any) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <form
                onSubmit={onSubmit}
                className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md animate-slide-in"
            >
                <h3 className="text-2xl font-bold mb-5 text-gray-800">{title}</h3>
                <div className="space-y-4">{children}</div>
                <div className="mt-6 flex justify-end gap-3">
                    <Button type="button" variant="ghost" onClick={onClose}>
                        ยกเลิก
                    </Button>
                    <Button type="submit">บันทึก</Button>
                </div>
            </form>
        </div>
    );
};

const DataTable = ({ columns, data, onAdd, getRowKey }: any) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">รายการเกษตรกร</h2>
            <Button onClick={onAdd}>เพิ่มเกษตรกร</Button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr>
                        {columns.map((c: any) => (
                            <th key={c.key} className="border-b border-gray-300 px-4 py-2 text-gray-700 font-semibold">
                                {c.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row: any) => (
                        <tr key={getRowKey(row)} className="hover:bg-gray-50 transition">
                            {columns.map((c: any) => (
                                <td key={c.key} className="px-4 py-2 border-b border-gray-200 text-gray-700">
                                    {c.render ? c.render(row) : row[c.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

// ------------------- Main Page -------------------
export default function FarmersPage() {
    const [farmers, setFarmers] = useState<Farmer[]>([]);
    const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingFarmer, setEditingFarmer] = useState<Farmer | null>(null);

    const [form, setForm] = useState({
        farmer_code: "",
        first_name: "",
        last_name: "",
        id_card: "",
        phone: "",
        address: "",
        province: "",
        district: "",
        subdistrict: "",
        postal_code: "",
    });

    const resetForm = () => {
        setForm({
            farmer_code: generateFarmerCode(),
            first_name: "",
            last_name: "",
            id_card: "",
            phone: "",
            address: "",
            province: "",
            district: "",
            subdistrict: "",
            postal_code: "",
        });
        setEditingFarmer(null);
    };

    const handleOpenDialog = (farmer?: Farmer) => {
        if (farmer) {
            setEditingFarmer(farmer);
            setForm({ ...farmer });
        } else {
            resetForm();
        }
        setIsDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingFarmer) {
            setFarmers((prev) => prev.map((f) => (f.id === editingFarmer.id ? { ...f, ...form } : f)));
        } else {
            setFarmers((prev) => [...prev, { ...form, id: Date.now().toString() }]);
        }
        setIsDialogOpen(false);
        resetForm();
    };

    const columns = [
        { key: "farmer_code", label: "รหัสเกษตรกร" },
        { key: "name", label: "ชื่อ-นามสกุล", render: (f: Farmer) => `${f.first_name} ${f.last_name}` },
        { key: "id_card", label: "เลขบัตรประชาชน" },
        { key: "phone", label: "โทรศัพท์" },
        {
            key: "actions",
            label: "จัดการ",
            render: (f: Farmer) => (
                <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => setSelectedFarmer(f)}>
                        <Eye className="h-5 w-5 text-gray-600" />
                    </Button>
                    <Button variant="ghost" onClick={() => handleOpenDialog(f)}>
                        <Pencil className="h-5 w-5 text-gray-600" />
                    </Button>
                    <Button variant="ghost" onClick={() => setFarmers((prev) => prev.filter((p) => p.id !== f.id))}>
                        <Trash2 className="h-5 w-5 text-red-500" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
            {!selectedFarmer ? (
                <DataTable columns={columns} data={farmers} onAdd={() => handleOpenDialog()} getRowKey={(f: Farmer) => f.id} />
            ) : (
                <Card>
                    <h3 className="text-xl font-bold mb-3">FarmBooks & Plots (ยังไม่เชื่อม backend)</h3>
                    <p className="text-gray-600">สามารถสร้าง Tabs, FarmBooks, Plot linking ได้ที่นี่</p>
                </Card>
            )}
            <FormDialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} title="เพิ่ม/แก้ไขเกษตรกร" onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div>
                        <Label>รหัสเกษตรกร</Label>
                        <Input value={form.farmer_code} onChange={(e: any) => setForm((f) => ({ ...f, farmer_code: e.target.value }))} />
                    </div>
                    <div>
                        <Label>ชื่อ</Label>
                        <Input value={form.first_name} onChange={(e: any) => setForm((f) => ({ ...f, first_name: e.target.value }))} />
                    </div>
                    <div>
                        <Label>นามสกุล</Label>
                        <Input value={form.last_name} onChange={(e: any) => setForm((f) => ({ ...f, last_name: e.target.value }))} />
                    </div>
                    <div>
                        <Label>เลขบัตรประชาชน</Label>
                        <Input value={form.id_card} onChange={(e: any) => setForm((f) => ({ ...f, id_card: e.target.value }))} />
                    </div>
                </div>
            </FormDialog>
        </div>
    );
}

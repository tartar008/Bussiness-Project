"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  X,
  Loader2,
  MapPin,
  FolderOpen,
  FileText,
} from "lucide-react";

interface UploadedFile {
  name: string;
  url: string;
  type: "document" | "image";
}

interface PointCoord {
  lat: string;
  lng: string;
}

interface PlotFormData {
  plot_code: string;
  plot_name: string;

  province: string;
  district: string;
  subdistrict: string;

  document_type: string;
  document_number: string;

  rai: string;
  ngan: string;
  wah: string;
  area_rai: string;
  area_hectare: string;

  geometry_type: "Point" | "Polygon";
  point_lat: string;
  point_lng: string;
  polygon_coords: PointCoord[];

  owned_before_2020: boolean;
  status_human_rights: boolean;
  status_environment: boolean;
  status_deforestation: boolean;
  status_tax: boolean;
  status_land_title: boolean;

  tree_count: string;
  planting_year: string;
  rubber_variety: string;
  capacity_per_day: string;
  max_range_year: string;
  min_range_year: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DOCUMENT_TYPES = [
  { value: "โฉนด", label: "โฉนด (CHANOTE)" },
  { value: "น.ส. 3", label: "น.ส. 3" },
  { value: "น.ส. 3 ก.", label: "น.ส. 3 ก." },
  { value: "ส.ป.ก. 4-01", label: "ส.ป.ก. 4-01" },
  { value: "ไม่มีเอกสาร", label: "ไม่มีเอกสาร" },
];

const generatePlotCode = () =>
  `P${Date.now().toString(36).toUpperCase()}`;

export function PlotFormDialog({ open, onOpenChange }: Props) {
  const docInputRef = useRef<HTMLInputElement>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);

  const [documents, setDocuments] = useState<UploadedFile[]>([]);
  const [images, setImages] = useState<UploadedFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState<PlotFormData>({
    plot_code: generatePlotCode(),
    plot_name: "",
    province: "",
    district: "",
    subdistrict: "",
    document_type: "ไม่มีเอกสาร",
    document_number: "",
    rai: "",
    ngan: "",
    wah: "",
    area_rai: "",
    area_hectare: "",
    geometry_type: "Point",
    point_lat: "",
    point_lng: "",
    polygon_coords: [{ lat: "", lng: "" }],
    owned_before_2020: false,
    status_human_rights: false,
    status_environment: false,
    status_deforestation: false,
    status_tax: false,
    status_land_title: false,
    tree_count: "",
    planting_year: "",
    rubber_variety: "",
    capacity_per_day: "",
    max_range_year: "",
    min_range_year: "",
  });

  /* ====== AREA CALC ====== */
  useEffect(() => {
    const rai = Number(form.rai) || 0;
    const ngan = Number(form.ngan) || 0;
    const wah = Number(form.wah) || 0;

    const totalRai = rai + ngan / 4 + wah / 400;
    const hectare = totalRai * 0.16;

    setForm((p) => ({
      ...p,
      area_rai: totalRai ? totalRai.toFixed(2) : "",
      area_hectare: hectare ? hectare.toFixed(2) : "",
    }));
  }, [form.rai, form.ngan, form.wah]);

  /* ====== MOCK UPLOAD ====== */
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "document" | "image"
  ) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles: UploadedFile[] = Array.from(files).map((f) => ({
      name: f.name,
      url: URL.createObjectURL(f),
      type,
    }));

    type === "document"
      ? setDocuments((p) => [...p, ...newFiles])
      : setImages((p) => [...p, ...newFiles]);

    e.target.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    console.log("FORM DATA:", form);
    console.log("DOCUMENTS:", documents);
    console.log("IMAGES:", images);

    setTimeout(() => {
      setIsLoading(false);
      onOpenChange(false);
    }, 800);
  };

  /* ====== UI ====== */
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            เพิ่มแปลงยาง
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>รหัสแปลง</Label>
            <Input value={form.plot_code} readOnly className="bg-muted" />
          </div>

          {/* LOCATION */}
          <Card>
            <CardHeader>
              <CardTitle>📍 ที่ตั้ง</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4">
              <Input
                placeholder="ชื่อแปลง"
                value={form.plot_name}
                onChange={(e) =>
                  setForm({ ...form, plot_name: e.target.value })
                }
              />
              <Input
                placeholder="จังหวัด"
                value={form.province}
                onChange={(e) =>
                  setForm({ ...form, province: e.target.value })
                }
              />
              <Input
                placeholder="อำเภอ"
                value={form.district}
                onChange={(e) =>
                  setForm({ ...form, district: e.target.value })
                }
              />
            </CardContent>
          </Card>

          {/* DOCUMENT UPLOAD */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-4 w-4" />
                เอกสาร
              </CardTitle>
            </CardHeader>
            <CardContent className="flex gap-3 flex-wrap">
              {documents.map((d, i) => (
                <div
                  key={i}
                  className="border rounded-lg p-2 text-xs flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  {d.name}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() =>
                      setDocuments((p) => p.filter((_, x) => x !== i))
                    }
                  />
                </div>
              ))}
              <label className="border-2 border-dashed rounded-lg w-24 h-16 flex items-center justify-center cursor-pointer">
                <input
                  ref={docInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, "document")}
                />
                <Plus />
              </label>
            </CardContent>
          </Card>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              ยกเลิก
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              บันทึก
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

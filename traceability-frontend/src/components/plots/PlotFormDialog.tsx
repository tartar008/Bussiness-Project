import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, Loader2, MapPin, FolderOpen, Image, FileText, Trash2 } from "lucide-react";
import { Plot } from "@/types/database";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UploadedFile {
  name: string;
  url: string;
  type: 'document' | 'image';
}

interface PointCoord {
  lat: string;
  lng: string;
}

interface PlotFormData {
  plot_code: string;
  plot_name: string;
  // Location
  province: string;
  district: string;
  subdistrict: string;
  // Document
  document_type: string;
  document_number: string;
  // Area
  rai: string;
  ngan: string;
  wah: string;
  area_rai: string;
  area_hectare: string;
  // Geometry
  geometry_type: "Point" | "Polygon";
  point_lat: string;
  point_lng: string;
  polygon_coords: PointCoord[];
  // EUDR Checks
  owned_before_2020: boolean;
  status_human_rights: boolean;
  status_environment: boolean;
  status_deforestation: boolean;
  status_tax: boolean;
  status_land_title: boolean;
  // Other
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
  editingPlot?: Plot | null;
  onSubmit: (data: PlotFormData) => Promise<void>;
  isLoading: boolean;
}

const DOCUMENT_TYPES = [
  { value: "โฉนด", label: "โฉนด (CHANOTE)" },
  { value: "น.ส. 3", label: "น.ส. 3" },
  { value: "น.ส. 3 ก.", label: "น.ส. 3 ก." },
  { value: "น.ส. 4 จ.", label: "น.ส. 4 จ." },
  { value: "ส.ป.ก. 4-01", label: "ส.ป.ก. 4-01" },
  { value: "ไม่มีเอกสาร", label: "ไม่มีเอกสาร" },
];

const generatePlotCode = () => `P${Date.now().toString(36).toUpperCase()}`;

export function PlotFormDialog({ open, onOpenChange, editingPlot, onSubmit, isLoading }: Props) {
  const docInputRef = useRef<HTMLInputElement>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);
  
  const [documents, setDocuments] = useState<UploadedFile[]>([]);
  const [gardenImages, setGardenImages] = useState<UploadedFile[]>([]);
  const [uploadingDocs, setUploadingDocs] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

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

  // Handle document uploads
  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingDocs(true);
    const newDocs: UploadedFile[] = [];

    for (const file of Array.from(files)) {
      const fileName = `${form.plot_code}/${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage
        .from('plot-documents')
        .upload(fileName, file);

      if (error) {
        toast.error(`ไม่สามารถอัปโหลด ${file.name}: ${error.message}`);
        continue;
      }

      const { data: urlData } = supabase.storage
        .from('plot-documents')
        .getPublicUrl(fileName);

      newDocs.push({
        name: file.name,
        url: urlData.publicUrl,
        type: 'document',
      });
    }

    setDocuments(prev => [...prev, ...newDocs]);
    setUploadingDocs(false);
    if (docInputRef.current) docInputRef.current.value = '';
    if (newDocs.length > 0) toast.success(`อัปโหลดเอกสารสำเร็จ ${newDocs.length} ไฟล์`);
  };

  // Handle garden image uploads
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    const newImages: UploadedFile[] = [];

    for (const file of Array.from(files)) {
      const fileName = `${form.plot_code}/${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage
        .from('plot-images')
        .upload(fileName, file);

      if (error) {
        toast.error(`ไม่สามารถอัปโหลด ${file.name}: ${error.message}`);
        continue;
      }

      const { data: urlData } = supabase.storage
        .from('plot-images')
        .getPublicUrl(fileName);

      newImages.push({
        name: file.name,
        url: urlData.publicUrl,
        type: 'image',
      });
    }

    setGardenImages(prev => [...prev, ...newImages]);
    setUploadingImages(false);
    if (imgInputRef.current) imgInputRef.current.value = '';
    if (newImages.length > 0) toast.success(`อัปโหลดรูปสำเร็จ ${newImages.length} รูป`);
  };

  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const removeImage = (index: number) => {
    setGardenImages(prev => prev.filter((_, i) => i !== index));
  };

  // Calculate total area when rai/ngan/wah changes
  useEffect(() => {
    const rai = parseFloat(form.rai) || 0;
    const ngan = parseFloat(form.ngan) || 0;
    const wah = parseFloat(form.wah) || 0;
    
    const totalRai = rai + ngan / 4 + wah / 400;
    const hectare = totalRai * 0.16;
    
    if (totalRai > 0) {
      setForm(prev => ({
        ...prev,
        area_rai: totalRai.toFixed(2),
        area_hectare: hectare.toFixed(2),
      }));
    }
  }, [form.rai, form.ngan, form.wah]);

  // Load editing data
  useEffect(() => {
    if (editingPlot) {
      setForm({
        plot_code: editingPlot.plot_code,
        plot_name: editingPlot.plot_name || "",
        province: editingPlot.province || "",
        district: editingPlot.district || "",
        subdistrict: editingPlot.subdistrict || "",
        document_type: "ไม่มีเอกสาร",
        document_number: "",
        rai: editingPlot.area_rai?.toString() || "",
        ngan: "",
        wah: "",
        area_rai: editingPlot.area_rai?.toString() || "",
        area_hectare: editingPlot.area_hectare?.toString() || "",
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
        tree_count: editingPlot.tree_count?.toString() || "",
        planting_year: editingPlot.planting_year?.toString() || "",
        rubber_variety: editingPlot.rubber_variety || "",
        capacity_per_day: "",
        max_range_year: editingPlot.expected_yield_per_year?.toString() || "",
        min_range_year: "",
      });
    } else {
      setForm(prev => ({ ...prev, plot_code: generatePlotCode() }));
    }
  }, [editingPlot, open]);

  const addPolygonPoint = () => {
    setForm(prev => ({
      ...prev,
      polygon_coords: [...prev.polygon_coords, { lat: "", lng: "" }],
    }));
  };

  const removePolygonPoint = (index: number) => {
    if (form.polygon_coords.length > 1) {
      setForm(prev => ({
        ...prev,
        polygon_coords: prev.polygon_coords.filter((_, i) => i !== index),
      }));
    }
  };

  const updatePolygonPoint = (index: number, field: "lat" | "lng", value: string) => {
    setForm(prev => ({
      ...prev,
      polygon_coords: prev.polygon_coords.map((p, i) =>
        i === index ? { ...p, [field]: value } : p
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {editingPlot ? "แก้ไขข้อมูลแปลง" : "เพิ่มแปลงยางใหม่"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Plot ID - Auto generated */}
          <div className="space-y-2">
            <Label>รหัสแปลง (Plot ID)</Label>
            <Input 
              value={form.plot_code} 
              readOnly 
              className="bg-muted"
            />
          </div>

          {/* Location Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">📍 ที่ตั้งแปลง</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>ชื่อแปลง</Label>
                <Input
                  value={form.plot_name}
                  onChange={(e) => setForm({ ...form, plot_name: e.target.value })}
                  placeholder="ชื่อแปลง (ถ้ามี)"
                />
              </div>
              <div className="space-y-2">
                <Label>จังหวัด *</Label>
                <Input
                  value={form.province}
                  onChange={(e) => setForm({ ...form, province: e.target.value })}
                  placeholder="จังหวัด"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>อำเภอ *</Label>
                <Input
                  value={form.district}
                  onChange={(e) => setForm({ ...form, district: e.target.value })}
                  placeholder="อำเภอ"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>ตำบล</Label>
                <Input
                  value={form.subdistrict}
                  onChange={(e) => setForm({ ...form, subdistrict: e.target.value })}
                  placeholder="ตำบล"
                />
              </div>
            </CardContent>
          </Card>

          {/* Document Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">📄 เอกสารสิทธิ์</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>ประเภทเอกสาร</Label>
                <Select
                  value={form.document_type}
                  onValueChange={(v) => setForm({ ...form, document_type: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DOCUMENT_TYPES.map((doc) => (
                      <SelectItem key={doc.value} value={doc.value}>
                        {doc.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>เลขที่เอกสาร</Label>
                <Input
                  value={form.document_number}
                  onChange={(e) => setForm({ ...form, document_number: e.target.value })}
                  placeholder="เลขที่เอกสารสิทธิ์"
                  disabled={form.document_type === "ไม่มีเอกสาร"}
                />
              </div>
            </CardContent>
          </Card>

          {/* Area Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">📐 พื้นที่</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>ไร่</Label>
                  <Input
                    type="number"
                    step="1"
                    value={form.rai}
                    onChange={(e) => setForm({ ...form, rai: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>งาน</Label>
                  <Input
                    type="number"
                    step="1"
                    min="0"
                    max="3"
                    value={form.ngan}
                    onChange={(e) => setForm({ ...form, ngan: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>ตารางวา</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="99"
                    value={form.wah}
                    onChange={(e) => setForm({ ...form, wah: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted rounded-lg">
                  <span className="text-sm text-muted-foreground">รวม:</span>{" "}
                  <span className="font-semibold">{form.area_rai || "0"} ไร่</span>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <span className="text-sm text-muted-foreground">เฮกตาร์:</span>{" "}
                  <span className="font-semibold">{form.area_hectare || "0"} ha</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Geometry Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">🗺️ พิกัด GIS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>ประเภทพิกัด</Label>
                <Select
                  value={form.geometry_type}
                  onValueChange={(v) => setForm({ ...form, geometry_type: v as "Point" | "Polygon" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Point">Point (จุดเดียว)</SelectItem>
                    <SelectItem value="Polygon">Polygon (หลายจุด)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {form.geometry_type === "Point" ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Latitude</Label>
                    <Input
                      type="number"
                      step="any"
                      value={form.point_lat}
                      onChange={(e) => setForm({ ...form, point_lat: e.target.value })}
                      placeholder="7.123456"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Longitude</Label>
                    <Input
                      type="number"
                      step="any"
                      value={form.point_lng}
                      onChange={(e) => setForm({ ...form, point_lng: e.target.value })}
                      placeholder="100.123456"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>จุดพิกัด Polygon</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addPolygonPoint}>
                      <Plus className="h-4 w-4 mr-1" />
                      เพิ่มจุด
                    </Button>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {form.polygon_coords.map((coord, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground w-8">#{index + 1}</span>
                        <Input
                          type="number"
                          step="any"
                          placeholder="Lat"
                          value={coord.lat}
                          onChange={(e) => updatePolygonPoint(index, "lat", e.target.value)}
                          className="flex-1"
                        />
                        <Input
                          type="number"
                          step="any"
                          placeholder="Lng"
                          value={coord.lng}
                          onChange={(e) => updatePolygonPoint(index, "lng", e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removePolygonPoint(index)}
                          disabled={form.polygon_coords.length === 1}
                        >
                          <X className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* EUDR Status Checks */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">✅ สถานะ EUDR Compliance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    checked={form.status_human_rights}
                    onCheckedChange={(c) => setForm({ ...form, status_human_rights: !!c })}
                  />
                  <span className="text-sm">Human Rights</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    checked={form.status_environment}
                    onCheckedChange={(c) => setForm({ ...form, status_environment: !!c })}
                  />
                  <span className="text-sm">Environment</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    checked={form.status_deforestation}
                    onCheckedChange={(c) => setForm({ ...form, status_deforestation: !!c })}
                  />
                  <span className="text-sm">Deforestation</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    checked={form.status_tax}
                    onCheckedChange={(c) => setForm({ ...form, status_tax: !!c })}
                  />
                  <span className="text-sm">ภาษี</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    checked={form.status_land_title}
                    onCheckedChange={(c) => setForm({ ...form, status_land_title: !!c })}
                  />
                  <span className="text-sm">เอกสารสิทธิ์</span>
                </label>
              </div>

              <div className="pt-2 border-t">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    checked={form.owned_before_2020}
                    onCheckedChange={(c) => setForm({ ...form, owned_before_2020: !!c })}
                  />
                  <span className="text-sm font-medium">เป็นเจ้าของก่อนปี พ.ศ. 2563 (2020)</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Documents & Images Upload Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FolderOpen className="h-4 w-4 text-amber-500" />
                เอกสารและรูปภาพ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Document Upload */}
              <div className="space-y-3">
                <Label className="text-primary font-medium">อัปโหลดเอกสารตรวจเช็ค</Label>
                <div className="flex flex-wrap gap-3">
                  {documents.map((doc, index) => (
                    <div 
                      key={index} 
                      className="relative group border border-border rounded-lg p-3 bg-muted/30 min-w-[120px]"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-6 w-6 text-muted-foreground" />
                        <span className="text-xs truncate max-w-[80px]">{doc.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDocument(index)}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <label className="flex items-center justify-center border-2 border-dashed border-primary/30 rounded-lg w-32 h-24 cursor-pointer hover:bg-primary/5 hover:border-primary transition-colors">
                    <input
                      ref={docInputRef}
                      type="file"
                      className="hidden"
                      multiple
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                      onChange={handleDocumentUpload}
                      disabled={uploadingDocs}
                    />
                    {uploadingDocs ? (
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    ) : (
                      <Plus className="h-6 w-6 text-primary/50" />
                    )}
                  </label>
                </div>
              </div>

              {/* Garden Images Upload */}
              <div className="space-y-3">
                <Label className="text-primary font-medium">อัปโหลดรูป (สวน)</Label>
                <div className="flex flex-wrap gap-3">
                  {gardenImages.map((img, index) => (
                    <div 
                      key={index} 
                      className="relative group border border-border rounded-lg overflow-hidden w-32 h-24"
                    >
                      <img 
                        src={img.url} 
                        alt={img.name}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <label className="flex items-center justify-center border-2 border-dashed border-primary/30 rounded-lg w-32 h-24 cursor-pointer hover:bg-primary/5 hover:border-primary transition-colors">
                    <input
                      ref={imgInputRef}
                      type="file"
                      className="hidden"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImages}
                    />
                    {uploadingImages ? (
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    ) : (
                      <Plus className="h-6 w-6 text-primary/50" />
                    )}
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">🌳 ข้อมูลเพิ่มเติม</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>จำนวนต้นยาง</Label>
                <Input
                  type="number"
                  value={form.tree_count}
                  onChange={(e) => setForm({ ...form, tree_count: e.target.value })}
                  placeholder="จำนวนต้น"
                />
              </div>
              <div className="space-y-2">
                <Label>ปีที่ปลูก</Label>
                <Input
                  type="number"
                  value={form.planting_year}
                  onChange={(e) => setForm({ ...form, planting_year: e.target.value })}
                  placeholder="พ.ศ. เช่น 2560"
                />
              </div>
              <div className="space-y-2">
                <Label>พันธุ์ยาง</Label>
                <Input
                  value={form.rubber_variety}
                  onChange={(e) => setForm({ ...form, rubber_variety: e.target.value })}
                  placeholder="พันธุ์ยาง"
                />
              </div>
              <div className="space-y-2">
                <Label>Capacity (Kg/Day)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.capacity_per_day}
                  onChange={(e) => setForm({ ...form, capacity_per_day: e.target.value })}
                  placeholder="กำลังการผลิต/วัน"
                />
              </div>
              <div className="space-y-2">
                <Label>Max Range (kg/year)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.max_range_year}
                  onChange={(e) => setForm({ ...form, max_range_year: e.target.value })}
                  placeholder="ผลผลิตสูงสุด/ปี"
                />
              </div>
              <div className="space-y-2">
                <Label>Min Range (kg/year)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.min_range_year}
                  onChange={(e) => setForm({ ...form, min_range_year: e.target.value })}
                  placeholder="ผลผลิตต่ำสุด/ปี"
                />
              </div>
            </CardContent>
          </Card>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              ยกเลิก
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingPlot ? "บันทึก" : "เพิ่มแปลง"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
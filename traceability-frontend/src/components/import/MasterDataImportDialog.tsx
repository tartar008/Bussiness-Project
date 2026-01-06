import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Loader2, Download } from 'lucide-react';
import { useImportMasterData, parseExcelCSV } from '@/hooks/useDataImport';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ParsedData {
  rows: ReturnType<typeof parseExcelCSV>;
  farmerCount: number;
  plotCount: number;
}

export function MasterDataImportDialog({ open, onOpenChange }: Props) {
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [importResult, setImportResult] = useState<{
    success: boolean;
    farmersCreated: number;
    plotsCreated: number;
    errors: string[];
  } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importMutation = useImportMasterData();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setImportResult(null);

    try {
      const text = await file.text();
      const rows = parseExcelCSV(text);
      
      // Count unique farmers and plots
      const farmerIds = new Set(rows.map(r => r.farmer_id));
      const plotIds = new Set(rows.map(r => r.plot_id));
      
      setParsedData({
        rows,
        farmerCount: farmerIds.size,
        plotCount: plotIds.size,
      });
    } catch {
      setParsedData(null);
    }
  };

  const handleImport = async () => {
    if (!parsedData) return;
    
    const result = await importMutation.mutateAsync(parsedData.rows);
    setImportResult({
      success: result.errors.length === 0,
      farmersCreated: result.farmersCreated,
      plotsCreated: result.plotsCreated,
      errors: result.errors,
    });
  };

  const handleClose = () => {
    setParsedData(null);
    setFileName('');
    setImportResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onOpenChange(false);
  };

  const downloadTemplate = (format: 'csv' | 'tsv') => {
    const headers = [
      'คำนำหน้า', 'ชื่อ', 'นามสกุล', 'ที่อยู่', 'เบอร์โทรติดต่อ', 
      'ทะเบียนเกษตร', 'หมายเลขทะเบียน', 'รหัสบัตรประจำตัวประชาชน',
      'จำนวนแปลงที่ถือครอง', 'แปลงที่', 'ไร่', 'งาน', 'ตารางวา', 
      'จำนวนไร่', 'พื้นที่ (ha)', 'ประเภทเอกสารสิทธิ', 'เลขที่เอกสาร',
      'ตำบล', 'อำเภอ', 'จังหวัด', 'ประเภทพิกัด', 'ค่าพิกัดแปลง', 
      'ค่าพิกัดแปลง Adj', 'มีสวนก่อนปี พ.ศ. 2563',
      'Farmer_ID', 'Plot_ID', 'รหัสจุดรับซื้อ', 'Unique_ID',
      'SupplyChainComplexity', 'PlotStatus', 'Protective_Check',
      'ReserveForest_Check', 'TreeCoverLoss_Check', 'GFW Integrated Alerts',
      'Risk_Analysis', 'Doucment', 'Capacity (Kg/Day)', 
      'MaxRange (kg/year)', 'MinRange (kg/year)'
    ];
    
    // Sample data row
    const sampleRow = [
      'นาง', 'สุนันท์', 'สุขราช', '127/1 หมู่01 ตำบลละมอ อำเภอนาโยง จังหวัดตรัง', '-',
      'ทะเบียนเกษตร (เล่มเขียว)', '920803125611', '2800100019918',
      '1', '', '8', '1', '44',
      '8.36', '1.34', 'ไม่มีเอกสาร', '',
      'ละมอ', 'นาโยง', 'ตรัง', 'UTM 47N', '582530 836953',
      '582530 836953', 'ก่อน',
      'F00385', 'P00717', '40', '40F00385P00717',
      '', '', '',
      '', '', '',
      '', '', '',
      '', ''
    ];

    const separator = format === 'csv' ? ',' : '\t';
    const extension = format === 'csv' ? 'csv' : 'tsv';
    const mimeType = format === 'csv' ? 'text/csv' : 'text/tab-separated-values';
    
    // Escape commas in CSV format
    const escapeValue = (val: string) => {
      if (format === 'csv' && (val.includes(',') || val.includes('"') || val.includes('\n'))) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    };
    
    const content = [
      headers.map(escapeValue).join(separator),
      sampleRow.map(escapeValue).join(separator)
    ].join('\n');
    
    const blob = new Blob(['\ufeff' + content], { type: `${mimeType};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `master_data_template.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            นำเข้าข้อมูลเริ่มต้น (Master Data)
          </DialogTitle>
          <DialogDescription>
            นำเข้าข้อมูลเกษตรกร, แปลงยาง, พิกัด และสถานะ EUDR จากไฟล์ Excel/CSV
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Upload Area */}
          {!parsedData && !importResult && (
            <div className="space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
              >
                <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium">คลิกเพื่อเลือกไฟล์ หรือลากวาง</p>
                <p className="text-sm text-muted-foreground mt-1">
                  รองรับไฟล์ .tsv, .csv (Tab-separated values)
                </p>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".tsv,.csv,.txt"
                onChange={handleFileSelect}
                className="hidden"
              />

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => downloadTemplate('csv')} className="flex-1 gap-2">
                  <Download className="h-4 w-4" />
                  Template CSV
                </Button>
                <Button variant="outline" onClick={() => downloadTemplate('tsv')} className="flex-1 gap-2">
                  <Download className="h-4 w-4" />
                  Template TSV/Excel
                </Button>
              </div>
            </div>
          )}

          {/* Preview */}
          {parsedData && !importResult && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <FileSpreadsheet className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">{fileName}</p>
                    <p className="text-sm text-muted-foreground">
                      พบ {parsedData.rows.length} แถว
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-3xl font-bold text-primary">{parsedData.farmerCount}</p>
                    <p className="text-sm text-muted-foreground">เกษตรกร</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-3xl font-bold text-primary">{parsedData.plotCount}</p>
                    <p className="text-sm text-muted-foreground">แปลงยาง</p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mt-4">
                  * ระบบจะสร้างข้อมูล Farmers, Plots, PlotGeometry, PlotDocuments, PlotStatusLinks และ FarmBooks โดยอัตโนมัติ
                </p>
              </CardContent>
            </Card>
          )}

          {/* Result */}
          {importResult && (
            <Card className={importResult.success ? 'border-green-500' : 'border-yellow-500'}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  {importResult.success ? (
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  ) : (
                    <AlertCircle className="h-8 w-8 text-yellow-500" />
                  )}
                  <div>
                    <p className="font-medium">
                      {importResult.success ? 'นำเข้าข้อมูลสำเร็จ' : 'นำเข้าข้อมูลสำเร็จบางส่วน'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      สร้าง {importResult.farmersCreated} เกษตรกร, {importResult.plotsCreated} แปลง
                    </p>
                  </div>
                </div>

                {importResult.errors.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-destructive mb-2">
                      ข้อผิดพลาด ({importResult.errors.length}):
                    </p>
                    <ScrollArea className="h-32 rounded border p-2">
                      {importResult.errors.map((err, idx) => (
                        <p key={idx} className="text-xs text-muted-foreground">
                          {err}
                        </p>
                      ))}
                    </ScrollArea>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          {!importResult ? (
            <>
              <Button variant="outline" onClick={handleClose}>
                ยกเลิก
              </Button>
              {parsedData && (
                <Button 
                  onClick={handleImport} 
                  disabled={importMutation.isPending}
                  className="gap-2"
                >
                  {importMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  นำเข้าข้อมูล
                </Button>
              )}
            </>
          ) : (
            <Button onClick={handleClose}>ปิด</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { useState, useRef, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Loader2, Download, ChevronRight, ChevronLeft, Settings2, Eye } from 'lucide-react';
import { useImportMasterData } from '@/hooks/useDataImport';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Field categories as specified by user
interface FieldConfig {
  key: string;
  thaiLabel: string;
  category: 'core' | 'optional' | 'system' | 'gis';
  dbField?: string;
  description?: string;
}

const FIELD_CONFIGS: FieldConfig[] = [
  // Core - Required (ต้อง import)
  { key: 'prefix', thaiLabel: 'คำนำหน้า', category: 'core', dbField: 'farmers.prefix', description: 'แสดงผลชื่อ' },
  { key: 'first_name', thaiLabel: 'ชื่อ', category: 'core', dbField: 'farmers.first_name', description: 'identity' },
  { key: 'last_name', thaiLabel: 'นามสกุล', category: 'core', dbField: 'farmers.last_name', description: 'identity' },
  { key: 'id_card', thaiLabel: 'รหัสบัตรประจำตัวประชาชน', category: 'core', dbField: 'farmers.id_card', description: 'unique / ป้องกันซ้ำ' },
  { key: 'phone', thaiLabel: 'เบอร์โทรติดต่อ', category: 'core', dbField: 'farmers.phone', description: 'ติดต่อ' },
  { key: 'address', thaiLabel: 'ที่อยู่', category: 'core', dbField: 'farmers.address', description: 'ที่อยู่รวม' },
  { key: 'total_rai', thaiLabel: 'จำนวนไร่', category: 'core', dbField: 'plots.area_rai', description: 'พื้นที่แปลง' },
  { key: 'area_hectare', thaiLabel: 'พื้นที่ (ha)', category: 'core', dbField: 'plots.area_hectare', description: 'พื้นที่เฮกตาร์' },
  { key: 'subdistrict', thaiLabel: 'ตำบล', category: 'core', dbField: 'plots.subdistrict', description: 'ที่ตั้งแปลง' },
  { key: 'district', thaiLabel: 'อำเภอ', category: 'core', dbField: 'plots.district', description: 'ที่ตั้งแปลง' },
  { key: 'province', thaiLabel: 'จังหวัด', category: 'core', dbField: 'plots.province', description: 'ที่ตั้งแปลง' },
  { key: 'document_type', thaiLabel: 'ประเภทเอกสารสิทธิ', category: 'core', dbField: 'plot_documents.document_type', description: 'เอกสารที่ดิน' },
  { key: 'document_number', thaiLabel: 'เลขที่เอกสาร', category: 'core', dbField: 'plot_documents.document_number', description: 'อ้างอิง' },
  
  // Optional - Phase 2 (ไม่จำเป็นต้อง map)
  { key: 'farm_book_type', thaiLabel: 'ทะเบียนเกษตร', category: 'optional', dbField: 'farm_books.issuing_authority', description: 'metadata' },
  { key: 'farm_book_number', thaiLabel: 'หมายเลขทะเบียน', category: 'optional', dbField: 'farm_books.book_number', description: 'metadata' },
  { key: 'plot_count', thaiLabel: 'จำนวนแปลงที่ถือครอง', category: 'optional', description: 'metadata' },
  { key: 'collection_point_code', thaiLabel: 'รหัสจุดรับซื้อ', category: 'optional', description: 'metadata' },
  { key: 'capacity_kg_day', thaiLabel: 'Capacity (Kg/Day)', category: 'optional', description: 'metadata' },
  { key: 'max_range_kg_year', thaiLabel: 'MaxRange (kg/year)', category: 'optional', dbField: 'plots.expected_yield_per_year', description: 'กำลังผลิต' },
  { key: 'min_range_kg_year', thaiLabel: 'MinRange (kg/year)', category: 'optional', description: 'metadata' },
  { key: 'rai', thaiLabel: 'ไร่', category: 'optional', description: 'แยกจาก จำนวนไร่' },
  { key: 'ngan', thaiLabel: 'งาน', category: 'optional', description: 'หน่วยพื้นที่' },
  { key: 'sq_wa', thaiLabel: 'ตารางวา', category: 'optional', description: 'หน่วยพื้นที่' },
  { key: 'plot_number', thaiLabel: 'แปลงที่', category: 'optional', description: 'ลำดับแปลง' },
  { key: 'pre_2563', thaiLabel: 'มีสวนก่อนปี พ.ศ. 2563', category: 'optional', dbField: 'plot_status_links', description: 'EUDR status' },
  
  // System - Auto-generated (ไม่ควร import)
  { key: 'farmer_id', thaiLabel: 'Farmer_ID', category: 'system', description: 'ใช้เป็น farmer_code แทน' },
  { key: 'plot_id', thaiLabel: 'Plot_ID', category: 'system', description: 'ใช้เป็น plot_code แทน' },
  { key: 'unique_id', thaiLabel: 'Unique_ID', category: 'system', description: 'auto-generated' },
  
  // GIS/Analysis - แยก Module
  { key: 'coordinate_type', thaiLabel: 'ประเภทพิกัด', category: 'gis', description: 'import เฉพาะ geometry' },
  { key: 'coordinates', thaiLabel: 'ค่าพิกัดแปลง', category: 'gis', dbField: 'plot_geometry.coordinates', description: 'GIS data' },
  { key: 'coordinates_adj', thaiLabel: 'ค่าพิกัดแปลง Adj', category: 'gis', description: 'adjusted coordinates' },
  { key: 'supply_chain_complexity', thaiLabel: 'SupplyChainComplexity', category: 'gis', description: 'analysis result' },
  { key: 'plot_status', thaiLabel: 'PlotStatus', category: 'gis', description: 'analysis result' },
  { key: 'protective_check', thaiLabel: 'Protective_Check', category: 'gis', dbField: 'plot_status_links', description: 'GIS analysis' },
  { key: 'reserve_forest_check', thaiLabel: 'ReserveForest_Check', category: 'gis', dbField: 'plot_status_links', description: 'GIS analysis' },
  { key: 'tree_cover_loss_check', thaiLabel: 'TreeCoverLoss_Check', category: 'gis', dbField: 'plot_status_links', description: 'GIS analysis' },
  { key: 'gfw_integrated_alerts', thaiLabel: 'GFW Integrated Alerts', category: 'gis', dbField: 'plot_status_links', description: 'GIS analysis' },
  { key: 'risk_analysis', thaiLabel: 'Risk_Analysis', category: 'gis', dbField: 'plot_status_links', description: 'GIS analysis' },
];

// Thai to key mapping for parsing
const THAI_TO_KEY: Record<string, string> = {
  'คำนำหน้า': 'prefix',
  'ชื่อ': 'first_name',
  'นามสกุล': 'last_name',
  'ที่อยู่': 'address',
  'เบอร์โทรติดต่อ': 'phone',
  'ทะเบียนเกษตร': 'farm_book_type',
  'หมายเลขทะเบียน': 'farm_book_number',
  'รหัสบัตรประจำตัวประชาชน': 'id_card',
  'จำนวนแปลงที่ถือครอง': 'plot_count',
  'แปลงที่': 'plot_number',
  'ไร่': 'rai',
  'งาน': 'ngan',
  'ตารางวา': 'sq_wa',
  'จำนวนไร่': 'total_rai',
  'พื้นที่ (ha)': 'area_hectare',
  'ประเภทเอกสารสิทธิ': 'document_type',
  'เลขที่เอกสาร': 'document_number',
  'ตำบล': 'subdistrict',
  'อำเภอ': 'district',
  'จังหวัด': 'province',
  'ประเภทพิกัด': 'coordinate_type',
  'ค่าพิกัดแปลง': 'coordinates',
  'ค่าพิกัดแปลง adj': 'coordinates_adj',
  'มีสวนก่อนปี พ.ศ. 2563': 'pre_2563',
  'farmer_id': 'farmer_id',
  'plot_id': 'plot_id',
  'รหัสจุดรับซื้อ': 'collection_point_code',
  'unique_id': 'unique_id',
  'supplychaincomplexity': 'supply_chain_complexity',
  'plotstatus': 'plot_status',
  'protective_check': 'protective_check',
  'reserveforest_check': 'reserve_forest_check',
  'treecoverloss_check': 'tree_cover_loss_check',
  'gfw integrated alerts': 'gfw_integrated_alerts',
  'risk_analysis': 'risk_analysis',
  'doucment': 'document',
  'capacity (kg/day)': 'capacity_kg_day',
  'maxrange (kg/year)': 'max_range_kg_year',
  'minrange (kg/year)': 'min_range_kg_year',
};

interface ParsedFile {
  headers: string[];
  rows: Record<string, string>[];
  rawText: string;
}

interface FieldMapping {
  sourceHeader: string;
  targetField: string;
  enabled: boolean;
}

type WizardStep = 'upload' | 'detect' | 'confirm' | 'import';

export function ImportWizard({ open, onOpenChange }: Props) {
  const [step, setStep] = useState<WizardStep>('upload');
  const [parsedFile, setParsedFile] = useState<ParsedFile | null>(null);
  const [fileName, setFileName] = useState('');
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([]);
  const [includeGIS, setIncludeGIS] = useState(false);
  const [importResult, setImportResult] = useState<{
    success: boolean;
    farmersCreated: number;
    plotsCreated: number;
    geometryCreated: number;
    statusLinksCreated: number;
    farmBooksCreated: number;
    errors: string[];
  } | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importMutation = useImportMasterData();

  // Detect delimiter from content
  const detectDelimiter = (text: string): string => {
    const firstLine = text.split('\n')[0] || '';
    
    // Count potential delimiters in first line
    const tabCount = (firstLine.match(/\t/g) || []).length;
    const commaCount = (firstLine.match(/,/g) || []).length;
    const semicolonCount = (firstLine.match(/;/g) || []).length;
    
    // If tabs are present and more than commas, use tab
    if (tabCount > 0 && tabCount >= commaCount) return '\t';
    // If commas are present, use comma
    if (commaCount > 0) return ',';
    // If semicolons are present (some EU CSVs), use semicolon
    if (semicolonCount > 0) return ';';
    
    // Default to tab
    return '\t';
  };

  // Parse CSV with proper quote handling
  const parseCSVLine = (line: string, delimiter: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];
      
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Escaped quote
          current += '"';
          i++;
        } else {
          // Toggle quote mode
          inQuotes = !inQuotes;
        }
      } else if (char === delimiter && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  };

  // Parse file content
  const parseFile = (text: string): ParsedFile | null => {
    // Handle different line endings
    const normalizedText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const lines = normalizedText.split('\n').filter(l => l.trim());
    
    if (lines.length < 2) return null;

    const delimiter = detectDelimiter(normalizedText);
    console.log('Detected delimiter:', delimiter === '\t' ? 'TAB' : delimiter);
    
    const headers = parseCSVLine(lines[0], delimiter);
    console.log('Headers found:', headers.length, headers);
    
    // Skip if only 1 column detected (likely wrong delimiter)
    if (headers.length < 2) {
      console.warn('Only 1 column detected, trying alternative delimiters...');
      // Try other delimiters
      for (const altDelimiter of ['\t', ',', ';']) {
        if (altDelimiter === delimiter) continue;
        const altHeaders = parseCSVLine(lines[0], altDelimiter);
        if (altHeaders.length > headers.length) {
          console.log('Using alternative delimiter:', altDelimiter === '\t' ? 'TAB' : altDelimiter);
          const altRows: Record<string, string>[] = [];
          for (let i = 1; i < lines.length; i++) {
            const values = parseCSVLine(lines[i], altDelimiter);
            const row: Record<string, string> = {};
            altHeaders.forEach((h, idx) => {
              row[h] = values[idx] || '';
            });
            altRows.push(row);
          }
          return { headers: altHeaders, rows: altRows, rawText: text };
        }
      }
    }
    
    const rows: Record<string, string>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i], delimiter);
      const row: Record<string, string> = {};
      headers.forEach((h, idx) => {
        row[h] = values[idx] || '';
      });
      rows.push(row);
    }

    return { headers, rows, rawText: text };
  };

  // Auto-detect field mappings
  const detectMappings = (headers: string[]): FieldMapping[] => {
    const mappings: FieldMapping[] = [];
    
    headers.forEach(header => {
      const normalizedHeader = header.toLowerCase().trim();
      const matchedKey = THAI_TO_KEY[normalizedHeader] || THAI_TO_KEY[header];
      
      if (matchedKey) {
        const fieldConfig = FIELD_CONFIGS.find(f => f.key === matchedKey);
        const isCore = fieldConfig?.category === 'core';
        const isSystem = fieldConfig?.category === 'system';
        
        mappings.push({
          sourceHeader: header,
          targetField: matchedKey,
          // Auto-enable core fields, disable system fields
          enabled: isSystem ? false : isCore,
        });
      } else {
        mappings.push({
          sourceHeader: header,
          targetField: '_unmapped',
          enabled: false,
        });
      }
    });

    return mappings;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setImportResult(null);

    try {
      const text = await file.text();
      const parsed = parseFile(text);
      
      if (parsed) {
        setParsedFile(parsed);
        const mappings = detectMappings(parsed.headers);
        setFieldMappings(mappings);
        setStep('detect');
      }
    } catch {
      setParsedFile(null);
    }
  };

  // Stats for preview - use id_card for unique farmers, total rows for plots
  const stats = useMemo(() => {
    if (!parsedFile || parsedFile.rows.length === 0) return { farmers: 0, plots: 0 };
    
    // Find id_card header for counting unique farmers
    const idCardMapping = fieldMappings.find(m => m.targetField === 'id_card');
    const idCardHeader = idCardMapping?.sourceHeader;
    
    if (idCardHeader) {
      // Count unique farmers by id_card
      const uniqueIdCards = new Set(parsedFile.rows.map(r => r[idCardHeader]).filter(Boolean));
      return { 
        farmers: uniqueIdCards.size, 
        plots: parsedFile.rows.length  // Each row is typically a plot
      };
    }
    
    // Fallback: try to detect unique farmers by name
    const firstNameHeader = fieldMappings.find(m => m.targetField === 'first_name')?.sourceHeader;
    const lastNameHeader = fieldMappings.find(m => m.targetField === 'last_name')?.sourceHeader;
    
    if (firstNameHeader && lastNameHeader) {
      const uniqueFarmers = new Set(
        parsedFile.rows.map(r => `${r[firstNameHeader]}|${r[lastNameHeader]}`).filter(v => v !== '|')
      );
      return { 
        farmers: uniqueFarmers.size, 
        plots: parsedFile.rows.length 
      };
    }
    
    return { farmers: 0, plots: parsedFile.rows.length };
  }, [parsedFile, fieldMappings]);

  // Get preview rows (first 5)
  const previewRows = useMemo(() => {
    if (!parsedFile) return [];
    return parsedFile.rows.slice(0, 5);
  }, [parsedFile]);

  // Convert parsed data to import format
  const prepareImportData = () => {
    if (!parsedFile) return [];

    const enabledMappings = fieldMappings.filter(m => m.enabled && m.targetField !== '_unmapped');
    
    return parsedFile.rows.map(row => {
      const importRow: Record<string, any> = {};
      
      enabledMappings.forEach(mapping => {
        const value = row[mapping.sourceHeader];
        if (value) {
          // Convert numbers
          if (['total_rai', 'area_hectare', 'rai', 'ngan', 'sq_wa', 'plot_count', 'plot_number', 
               'capacity_kg_day', 'max_range_kg_year', 'min_range_kg_year'].includes(mapping.targetField)) {
            const num = parseFloat(value);
            importRow[mapping.targetField] = isNaN(num) ? undefined : num;
          } else {
            importRow[mapping.targetField] = value;
          }
        }
      });
      
      return importRow;
    }).filter(row => {
      // Must have at least id_card OR (first_name AND last_name) for farmer identification
      const hasFarmerIdentity = row.id_card || (row.first_name && row.last_name);
      return hasFarmerIdentity;
    });
  };

  // Validation check before import
  const validationResult = useMemo(() => {
    const enabledMappings = fieldMappings.filter(m => m.enabled && m.targetField !== '_unmapped');
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Check required core fields
    const hasIdCard = enabledMappings.some(m => m.targetField === 'id_card');
    const hasFirstName = enabledMappings.some(m => m.targetField === 'first_name');
    const hasLastName = enabledMappings.some(m => m.targetField === 'last_name');
    
    if (!hasIdCard && !(hasFirstName && hasLastName)) {
      errors.push('ต้องมีอย่างน้อย "รหัสบัตรประจำตัวประชาชน" หรือ "ชื่อ + นามสกุล" เพื่อระบุเกษตรกร');
    }
    
    // Check for plot area
    const hasPlotArea = enabledMappings.some(m => ['total_rai', 'area_hectare'].includes(m.targetField));
    if (!hasPlotArea) {
      warnings.push('ไม่พบข้อมูลพื้นที่แปลง (จำนวนไร่ หรือ พื้นที่ ha)');
    }
    
    // Check location
    const hasLocation = enabledMappings.some(m => ['province', 'district', 'subdistrict'].includes(m.targetField));
    if (!hasLocation) {
      warnings.push('ไม่พบข้อมูลที่ตั้งแปลง (ตำบล/อำเภอ/จังหวัด)');
    }
    
    // Count valid rows
    const validRowCount = prepareImportData().length;
    
    return {
      isValid: errors.length === 0 && validRowCount > 0,
      errors,
      warnings,
      validRowCount,
      totalRows: parsedFile?.rows.length || 0
    };
  }, [fieldMappings, parsedFile]);

  const handleImport = async () => {
    setImportError(null);
    const data = prepareImportData();
    
    if (data.length === 0) {
      setImportError('ไม่มีข้อมูลที่สามารถนำเข้าได้ กรุณาตรวจสอบการจับคู่คอลัมน์อีกครั้ง');
      return;
    }

    setIsImporting(true);
    try {
      const result = await importMutation.mutateAsync(data as any);
      setImportResult({
        success: result.errors.length === 0,
        farmersCreated: result.farmersCreated,
        plotsCreated: result.plotsCreated,
        geometryCreated: result.geometryCreated,
        statusLinksCreated: result.statusLinksCreated,
        farmBooksCreated: result.farmBooksCreated,
        errors: result.errors,
      });
      setStep('import');
    } catch (error) {
      console.error('Import error:', error);
      setImportError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการนำเข้าข้อมูล');
    } finally {
      setIsImporting(false);
    }
  };

  const handleClose = () => {
    setStep('upload');
    setParsedFile(null);
    setFileName('');
    setFieldMappings([]);
    setImportResult(null);
    setImportError(null);
    setIsImporting(false);
    setIncludeGIS(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onOpenChange(false);
  };

  const updateMapping = (index: number, targetField: string) => {
    const newMappings = [...fieldMappings];
    newMappings[index].targetField = targetField;
    setFieldMappings(newMappings);
  };

  const toggleMapping = (index: number, enabled: boolean) => {
    const newMappings = [...fieldMappings];
    newMappings[index].enabled = enabled;
    setFieldMappings(newMappings);
  };

  const downloadTemplate = (format: 'csv' | 'tsv') => {
    const headers = FIELD_CONFIGS.filter(f => f.category !== 'system').map(f => f.thaiLabel);
    
    const separator = format === 'csv' ? ',' : '\t';
    const extension = format === 'csv' ? 'csv' : 'tsv';
    const mimeType = format === 'csv' ? 'text/csv' : 'text/tab-separated-values';
    
    const escapeValue = (val: string) => {
      if (format === 'csv' && (val.includes(',') || val.includes('"') || val.includes('\n'))) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    };
    
    // Header row
    const headerRow = headers.map(escapeValue).join(separator);
    
    // Example data row
    const exampleData: Record<string, string> = {
      'คำนำหน้า': 'นาง',
      'ชื่อ': 'สุนันท์',
      'นามสกุล': 'สุขราช',
      'รหัสบัตรประจำตัวประชาชน': '2800100019918',
      'เบอร์โทรติดต่อ': '081-234-5678',
      'ที่อยู่': '127/1 หมู่01 ตำบลละมอ อำเภอนาโยง จังหวัดตรัง',
      'จำนวนไร่': '8.36',
      'พื้นที่ (ha)': '1.34',
      'ตำบล': 'ละมอ',
      'อำเภอ': 'นาโยง',
      'จังหวัด': 'ตรัง',
      'ประเภทเอกสารสิทธิ': 'น.ส. 4 จ.',
      'เลขที่เอกสาร': '22448',
      'ทะเบียนเกษตร': 'ทะเบียนเกษตร (เล่มเขียว)',
      'หมายเลขทะเบียน': '920803125611',
      'จำนวนแปลงที่ถือครอง': '1',
      'รหัสจุดรับซื้อ': '40',
      'Capacity (Kg/Day)': '',
      'MaxRange (kg/year)': '',
      'MinRange (kg/year)': '',
      'ไร่': '8',
      'งาน': '1',
      'ตารางวา': '44',
      'แปลงที่': '1',
      'มีสวนก่อนปี พ.ศ. 2563': 'ก่อน',
      'ประเภทพิกัด': 'Polygon',
      'ค่าพิกัดแปลง': 'POLYGON ((99.70 7.50,99.70 7.50,...))',
      'ค่าพิกัดแปลง Adj': '',
      'SupplyChainComplexity': '',
      'PlotStatus': '',
      'Protective_Check': 'Non_Overlap',
      'ReserveForest_Check': 'Non_Overlap',
      'TreeCoverLoss_Check': 'Non_Overlap',
      'GFW Integrated Alerts': '',
      'Risk_Analysis': '',
    };
    
    const dataRow = headers.map(h => escapeValue(exampleData[h] || '')).join(separator);
    
    const content = headerRow + '\n' + dataRow;
    
    const blob = new Blob(['\ufeff' + content], { type: `${mimeType};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `import_template.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Categorize mappings for display
  const categorizedMappings = useMemo(() => {
    const core: FieldMapping[] = [];
    const optional: FieldMapping[] = [];
    const gis: FieldMapping[] = [];
    const unmapped: FieldMapping[] = [];

    fieldMappings.forEach(m => {
      const config = FIELD_CONFIGS.find(f => f.key === m.targetField);
      if (!config || m.targetField === '_unmapped') {
        unmapped.push(m);
      } else if (config.category === 'core') {
        core.push(m);
      } else if (config.category === 'optional') {
        optional.push(m);
      } else if (config.category === 'gis') {
        gis.push(m);
      }
    });

    return { core, optional, gis, unmapped };
  }, [fieldMappings]);

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'core':
        return <Badge className="bg-green-100 text-green-800">จำเป็น</Badge>;
      case 'optional':
        return <Badge className="bg-blue-100 text-blue-800">เสริม</Badge>;
      case 'gis':
        return <Badge className="bg-purple-100 text-purple-800">GIS</Badge>;
      case 'system':
        return <Badge className="bg-red-100 text-red-800">ระบบ</Badge>;
      default:
        return <Badge variant="outline">ไม่จับคู่</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Import Wizard - นำเข้าข้อมูลเริ่มต้น
          </DialogTitle>
          <DialogDescription>
            ขั้นตอน: อัปโหลด → ตรวจจับ → ยืนยัน → นำเข้า
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 py-4 border-b">
          {(['upload', 'detect', 'confirm', 'import'] as WizardStep[]).map((s, idx) => (
            <div key={s} className="flex items-center">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                step === s 
                  ? 'bg-primary text-primary-foreground' 
                  : (idx < ['upload', 'detect', 'confirm', 'import'].indexOf(step) 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-muted text-muted-foreground')
              }`}>
                <span className="text-sm font-medium">
                  {idx + 1}. {s === 'upload' ? 'อัปโหลด' : s === 'detect' ? 'ตรวจจับ' : s === 'confirm' ? 'ยืนยัน' : 'นำเข้า'}
                </span>
              </div>
              {idx < 3 && <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />}
            </div>
          ))}
        </div>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4 py-4">
            {/* Step 1: Upload */}
            {step === 'upload' && (
              <div className="space-y-4">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
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
                    Template TSV
                  </Button>
                </div>

                {/* Field Categories Legend */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">ประเภทข้อมูล</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      {getCategoryBadge('core')}
                      <span>Core - ข้อมูลพื้นฐานที่จำเป็น (ชื่อ, บัตรประชาชน, พื้นที่)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getCategoryBadge('optional')}
                      <span>Optional - ข้อมูลเสริม (ทะเบียนเกษตร, รหัสจุดรับซื้อ)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getCategoryBadge('gis')}
                      <span>GIS - ข้อมูลพิกัด/วิเคราะห์ (แยก module)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getCategoryBadge('system')}
                      <span>System - ระบบสร้างเอง (ห้าม import)</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 2: Detect & Suggest */}
            {step === 'detect' && parsedFile && (
              <div className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <FileSpreadsheet className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-medium">{fileName}</p>
                        <p className="text-sm text-muted-foreground">
                          {parsedFile.rows.length} แถว, {parsedFile.headers.length} คอลัมน์
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-muted rounded-lg text-center">
                        <p className="text-3xl font-bold text-primary">{stats.farmers}</p>
                        <p className="text-sm text-muted-foreground">เกษตรกร (unique)</p>
                      </div>
                      <div className="p-4 bg-muted rounded-lg text-center">
                        <p className="text-3xl font-bold text-primary">{stats.plots}</p>
                        <p className="text-sm text-muted-foreground">แปลงยาง (แถว)</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Data Preview */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      ตัวอย่างข้อมูล (5 แถวแรก)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="w-full">
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs border-collapse">
                          <thead>
                            <tr className="bg-muted">
                              <th className="border px-2 py-1.5 text-left font-medium whitespace-nowrap">#</th>
                              {parsedFile.headers.slice(0, 8).map((h, idx) => (
                                <th key={idx} className="border px-2 py-1.5 text-left font-medium whitespace-nowrap max-w-[120px] truncate" title={h}>
                                  {h}
                                </th>
                              ))}
                              {parsedFile.headers.length > 8 && (
                                <th className="border px-2 py-1.5 text-center text-muted-foreground">
                                  +{parsedFile.headers.length - 8} cols
                                </th>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {previewRows.map((row, rowIdx) => (
                              <tr key={rowIdx} className="hover:bg-muted/50">
                                <td className="border px-2 py-1 text-muted-foreground">{rowIdx + 1}</td>
                                {parsedFile.headers.slice(0, 8).map((h, colIdx) => (
                                  <td key={colIdx} className="border px-2 py-1 whitespace-nowrap max-w-[120px] truncate" title={row[h]}>
                                    {row[h] || <span className="text-muted-foreground">-</span>}
                                  </td>
                                ))}
                                {parsedFile.headers.length > 8 && (
                                  <td className="border px-2 py-1 text-center text-muted-foreground">...</td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Settings2 className="h-4 w-4" />
                      การจับคู่อัตโนมัติ (Auto-detected)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <p className="text-muted-foreground">
                        พบ {fieldMappings.filter(m => m.targetField !== '_unmapped').length} คอลัมน์ที่ตรงกับระบบ
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {fieldMappings.filter(m => m.targetField !== '_unmapped').map((m, idx) => {
                          const config = FIELD_CONFIGS.find(f => f.key === m.targetField);
                          return (
                            <Badge 
                              key={idx} 
                              variant={m.enabled ? "default" : "outline"}
                              className="text-xs"
                            >
                              {m.sourceHeader} → {config?.thaiLabel || m.targetField}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="include-gis" 
                    checked={includeGIS}
                    onCheckedChange={(checked) => {
                      setIncludeGIS(!!checked);
                      // Enable/disable GIS fields
                      const newMappings = fieldMappings.map(m => {
                        const config = FIELD_CONFIGS.find(f => f.key === m.targetField);
                        if (config?.category === 'gis') {
                          return { ...m, enabled: !!checked };
                        }
                        return m;
                      });
                      setFieldMappings(newMappings);
                    }}
                  />
                  <Label htmlFor="include-gis">รวมข้อมูล GIS/พิกัด (geometry, status checks)</Label>
                </div>
              </div>
            )}

            {/* Step 3: Confirm Mappings */}
            {step === 'confirm' && (
              <div className="space-y-4">
                {/* Validation Status */}
                <Card className={validationResult.isValid ? "border-green-200 bg-green-50/30" : "border-amber-200 bg-amber-50/30"}>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-3 mb-2">
                      {validationResult.isValid ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-amber-600" />
                      )}
                      <div>
                        <p className="font-medium">
                          {validationResult.isValid 
                            ? `พร้อมนำเข้า ${validationResult.validRowCount} จาก ${validationResult.totalRows} แถว`
                            : 'กรุณาตรวจสอบการตั้งค่า'}
                        </p>
                      </div>
                    </div>
                    
                    {validationResult.errors.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {validationResult.errors.map((err, idx) => (
                          <p key={idx} className="text-sm text-destructive flex items-center gap-2">
                            <AlertCircle className="h-3 w-3" /> {err}
                          </p>
                        ))}
                      </div>
                    )}
                    
                    {validationResult.warnings.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {validationResult.warnings.map((warn, idx) => (
                          <p key={idx} className="text-sm text-amber-600 flex items-center gap-2">
                            <AlertCircle className="h-3 w-3" /> {warn}
                          </p>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Import Error */}
                {importError && (
                  <Card className="border-destructive bg-destructive/10">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-3 text-destructive">
                        <AlertCircle className="h-5 w-5" />
                        <p className="font-medium">{importError}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
                <Tabs defaultValue="core">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="core">
                      Core ({categorizedMappings.core.length})
                    </TabsTrigger>
                    <TabsTrigger value="optional">
                      Optional ({categorizedMappings.optional.length})
                    </TabsTrigger>
                    <TabsTrigger value="gis">
                      GIS ({categorizedMappings.gis.length})
                    </TabsTrigger>
                    <TabsTrigger value="unmapped">
                      ไม่จับคู่ ({categorizedMappings.unmapped.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="core" className="space-y-2 mt-4">
                    {categorizedMappings.core.map((mapping, idx) => {
                      const config = FIELD_CONFIGS.find(f => f.key === mapping.targetField);
                      const originalIdx = fieldMappings.indexOf(mapping);
                      return (
                        <div key={idx} className="flex items-center gap-3 p-2 rounded border bg-green-50/50">
                          <Checkbox 
                            checked={mapping.enabled}
                            onCheckedChange={(checked) => toggleMapping(originalIdx, !!checked)}
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{mapping.sourceHeader}</p>
                            <p className="text-xs text-muted-foreground">{config?.description}</p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          <Select
                            value={mapping.targetField}
                            onValueChange={(val) => updateMapping(originalIdx, val)}
                          >
                            <SelectTrigger className="w-48">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {FIELD_CONFIGS.filter(f => f.category === 'core').map(f => (
                                <SelectItem key={f.key} value={f.key}>{f.thaiLabel}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      );
                    })}
                    {categorizedMappings.core.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">ไม่พบข้อมูล Core</p>
                    )}
                  </TabsContent>

                  <TabsContent value="optional" className="space-y-2 mt-4">
                    {categorizedMappings.optional.map((mapping, idx) => {
                      const config = FIELD_CONFIGS.find(f => f.key === mapping.targetField);
                      const originalIdx = fieldMappings.indexOf(mapping);
                      return (
                        <div key={idx} className="flex items-center gap-3 p-2 rounded border bg-blue-50/50">
                          <Checkbox 
                            checked={mapping.enabled}
                            onCheckedChange={(checked) => toggleMapping(originalIdx, !!checked)}
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{mapping.sourceHeader}</p>
                            <p className="text-xs text-muted-foreground">{config?.description}</p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          <Select
                            value={mapping.targetField}
                            onValueChange={(val) => updateMapping(originalIdx, val)}
                          >
                            <SelectTrigger className="w-48">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {FIELD_CONFIGS.filter(f => f.category === 'optional').map(f => (
                                <SelectItem key={f.key} value={f.key}>{f.thaiLabel}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      );
                    })}
                    {categorizedMappings.optional.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">ไม่พบข้อมูล Optional</p>
                    )}
                  </TabsContent>

                  <TabsContent value="gis" className="space-y-2 mt-4">
                    {categorizedMappings.gis.map((mapping, idx) => {
                      const config = FIELD_CONFIGS.find(f => f.key === mapping.targetField);
                      const originalIdx = fieldMappings.indexOf(mapping);
                      return (
                        <div key={idx} className="flex items-center gap-3 p-2 rounded border bg-purple-50/50">
                          <Checkbox 
                            checked={mapping.enabled}
                            onCheckedChange={(checked) => toggleMapping(originalIdx, !!checked)}
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{mapping.sourceHeader}</p>
                            <p className="text-xs text-muted-foreground">{config?.description}</p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          <Badge variant="outline">{config?.thaiLabel}</Badge>
                        </div>
                      );
                    })}
                    {categorizedMappings.gis.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">ไม่พบข้อมูล GIS</p>
                    )}
                  </TabsContent>

                  <TabsContent value="unmapped" className="space-y-2 mt-4">
                    {categorizedMappings.unmapped.map((mapping, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-2 rounded border bg-muted/50">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-muted-foreground">{mapping.sourceHeader}</p>
                          <p className="text-xs text-muted-foreground">จะถูกบันทึกเป็น raw_data</p>
                        </div>
                      </div>
                    ))}
                    {categorizedMappings.unmapped.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">ทุกคอลัมน์ถูกจับคู่แล้ว</p>
                    )}
                  </TabsContent>
                </Tabs>

                <Card className="bg-muted/50">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Eye className="h-4 w-4" />
                      <span className="font-medium">สรุป:</span>
                      <span>
                        จะนำเข้า {fieldMappings.filter(m => m.enabled).length} field จาก {parsedFile?.rows.length} แถว
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 4: Import Result */}
            {step === 'import' && importResult && (
              <Card className={importResult.success ? 'border-green-500' : 'border-yellow-500'}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-6">
                    {importResult.success ? (
                      <CheckCircle className="h-10 w-10 text-green-500" />
                    ) : (
                      <AlertCircle className="h-10 w-10 text-yellow-500" />
                    )}
                    <div>
                      <p className="text-lg font-medium">
                        {importResult.success ? 'นำเข้าข้อมูลสำเร็จ!' : 'นำเข้าข้อมูลสำเร็จบางส่วน'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ข้อมูลถูกบันทึกในระบบเรียบร้อยแล้ว
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="p-4 bg-muted rounded-lg text-center">
                      <p className="text-2xl font-bold text-green-600">{importResult.farmersCreated}</p>
                      <p className="text-sm text-muted-foreground">เกษตรกร</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg text-center">
                      <p className="text-2xl font-bold text-blue-600">{importResult.plotsCreated}</p>
                      <p className="text-sm text-muted-foreground">แปลงยาง</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg text-center">
                      <p className="text-2xl font-bold text-purple-600">{importResult.farmBooksCreated}</p>
                      <p className="text-sm text-muted-foreground">ทะเบียนเกษตร</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-3 bg-muted/50 rounded-lg text-center">
                      <p className="text-lg font-bold">{importResult.geometryCreated}</p>
                      <p className="text-xs text-muted-foreground">Geometry</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg text-center">
                      <p className="text-lg font-bold">{importResult.statusLinksCreated}</p>
                      <p className="text-xs text-muted-foreground">Status Links</p>
                    </div>
                  </div>

                  {importResult.errors.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-destructive mb-2">
                        ข้อผิดพลาด ({importResult.errors.length}):
                      </p>
                      <ScrollArea className="h-32 rounded border p-2">
                        {importResult.errors.map((err, idx) => (
                          <p key={idx} className="text-xs text-muted-foreground py-1">
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
        </ScrollArea>

        <DialogFooter className="border-t pt-4">
          {step === 'upload' && (
            <Button variant="outline" onClick={handleClose}>ยกเลิก</Button>
          )}
          
          {step === 'detect' && (
            <>
              <Button variant="outline" onClick={() => setStep('upload')}>
                <ChevronLeft className="h-4 w-4 mr-1" /> ย้อนกลับ
              </Button>
              <Button onClick={() => setStep('confirm')}>
                ถัดไป <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </>
          )}
          
          {step === 'confirm' && (
            <>
              <Button variant="outline" onClick={() => { setImportError(null); setStep('detect'); }}>
                <ChevronLeft className="h-4 w-4 mr-1" /> ย้อนกลับ
              </Button>
              <Button 
                onClick={handleImport} 
                disabled={isImporting || !validationResult.isValid}
                className="gap-2"
              >
                {isImporting && <Loader2 className="h-4 w-4 animate-spin" />}
                {isImporting ? 'กำลังนำเข้า...' : `นำเข้าข้อมูล (${validationResult.validRowCount} แถว)`}
              </Button>
            </>
          )}
          
          {step === 'import' && (
            <Button onClick={handleClose}>ปิด</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

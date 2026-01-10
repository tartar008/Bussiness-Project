import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Json } from '@/integrations/supabase/types';

interface ImportRow {
  // Farmer info
  prefix?: string;
  first_name: string;
  last_name: string;
  address?: string;
  phone?: string;
  farm_book_type?: string;
  farm_book_number?: string;
  id_card: string;
  
  // Plot info
  plot_count?: number;
  plot_number?: number;
  rai?: number;
  ngan?: number;
  sq_wa?: number;
  total_rai?: number;
  area_hectare?: number;
  document_type?: string;
  document_number?: string;
  subdistrict?: string;
  district?: string;
  province?: string;
  
  // Geometry
  coordinate_type?: string;
  coordinates?: string;
  coordinates_adj?: string;
  
  // EUDR Status
  pre_2563?: string;
  farmer_id: string;
  plot_id: string;
  collection_point_code?: string;
  unique_id?: string;
  supply_chain_complexity?: string;
  plot_status?: string;
  protective_check?: string;
  reserve_forest_check?: string;
  tree_cover_loss_check?: string;
  gfw_integrated_alerts?: string;
  risk_analysis?: string;
  
  // Capacity
  document?: string;
  capacity_kg_day?: number;
  max_range_kg_year?: number;
  min_range_kg_year?: number;
}

// Column mapping for Thai headers
const COLUMN_MAP: Record<string, keyof ImportRow> = {
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

function parseCoordinates(coordStr: string, coordType: string): { type: string; coordinates: Json } | null {
  if (!coordStr || coordStr.trim() === '') return null;
  
  const trimmed = coordStr.trim();
  
  // Handle POLYGON format
  if (trimmed.toUpperCase().startsWith('POLYGON')) {
    const match = trimmed.match(/POLYGON\s*\(\((.*?)\)\)/i);
    if (match) {
      const coordPairs = match[1].split(',').map(pair => {
        const [lng, lat] = pair.trim().split(/\s+/).map(Number);
        return [lng, lat];
      });
      return { type: 'Polygon', coordinates: [coordPairs] as Json };
    }
  }
  
  // Handle UTM format (e.g., "582530 836953")
  if (coordType?.toUpperCase().includes('UTM')) {
    const parts = trimmed.split(/\s+/).filter(p => !isNaN(Number(p)));
    if (parts.length >= 2) {
      const easting = Number(parts[0]);
      const northing = Number(parts[1]);
      // Simple UTM to lat/lng approximation for zone 47N (Thailand)
      // This is a rough conversion - proper conversion would need proj4
      const lng = (easting - 500000) / 111320 + 99.0;
      const lat = northing / 110540;
      return { type: 'Point', coordinates: [lng, lat] as Json };
    }
  }
  
  return null;
}

interface ImportResult {
  totalRows: number;
  farmersCreated: number;
  plotsCreated: number;
  geometryCreated: number;
  statusLinksCreated: number;
  farmBooksCreated: number;
  errors: string[];
}

export function useImportMasterData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rows: ImportRow[]): Promise<ImportResult> => {
      const errors: string[] = [];
      const farmerMap = new Map<string, string>(); // farmer_code -> id
      const plotMap = new Map<string, string>(); // plot_code -> id
      let farmersCreated = 0;
      let plotsCreated = 0;
      let geometryCreated = 0;
      let statusLinksCreated = 0;
      let farmBooksCreated = 0;

      // Group rows by farmer_id to handle multiple plots per farmer
      const farmerGroups = new Map<string, ImportRow[]>();
      for (const row of rows) {
        if (!row.farmer_id) continue;
        const existing = farmerGroups.get(row.farmer_id) || [];
        existing.push(row);
        farmerGroups.set(row.farmer_id, existing);
      }

      // Process each farmer
      for (const [farmerId, farmerRows] of farmerGroups) {
        const firstRow = farmerRows[0];
        
        try {
          // Check if farmer already exists
          const { data: existingFarmer } = await supabase
            .from('farmers')
            .select('id')
            .eq('farmer_code', farmerId)
            .maybeSingle();

          let actualFarmerId: string;

          if (existingFarmer) {
            actualFarmerId = existingFarmer.id;
          } else {
            // Create farmer
            const fullName = `${firstRow.prefix || ''} ${firstRow.first_name}`.trim();
            const { data: newFarmer, error: farmerError } = await supabase
              .from('farmers')
              .insert({
                farmer_code: farmerId,
                first_name: fullName || firstRow.first_name,
                last_name: firstRow.last_name,
                id_card: firstRow.id_card,
                address: firstRow.address,
                phone: firstRow.phone,
                province: firstRow.province,
                district: firstRow.district,
                subdistrict: firstRow.subdistrict,
              })
              .select('id')
              .single();

            if (farmerError) {
              errors.push(`Farmer ${farmerId}: ${farmerError.message}`);
              continue;
            }
            actualFarmerId = newFarmer.id;
            farmersCreated++;
          }

          farmerMap.set(farmerId, actualFarmerId);

          // Create farm book if exists
          if (firstRow.farm_book_number && !existingFarmer) {
            const { error: fbError } = await supabase
              .from('farm_books')
              .insert({
                farmer_id: actualFarmerId,
                book_number: firstRow.farm_book_number,
                issuing_authority: firstRow.farm_book_type,
                status: 'active',
              });
            if (!fbError) farmBooksCreated++;
          }

          // Process each plot for this farmer
          for (const row of farmerRows) {
            if (!row.plot_id) continue;

            try {
              // Check if plot already exists
              const { data: existingPlot } = await supabase
                .from('plots')
                .select('id')
                .eq('plot_code', row.plot_id)
                .maybeSingle();

              let actualPlotId: string;

              if (existingPlot) {
                actualPlotId = existingPlot.id;
              } else {
                // Create plot
                const { data: newPlot, error: plotError } = await supabase
                  .from('plots')
                  .insert({
                    plot_code: row.plot_id,
                    plot_name: `แปลง ${row.plot_number || row.plot_id}`,
                    area_rai: row.total_rai,
                    area_hectare: row.area_hectare,
                    province: row.province,
                    district: row.district,
                    subdistrict: row.subdistrict,
                    expected_yield_per_year: row.max_range_kg_year,
                    status: row.plot_status || 'active',
                  })
                  .select('id')
                  .single();

                if (plotError) {
                  errors.push(`Plot ${row.plot_id}: ${plotError.message}`);
                  continue;
                }
                actualPlotId = newPlot.id;
                plotsCreated++;

                // Create geometry if coordinates exist
                if (row.coordinates || row.coordinates_adj) {
                  const coords = parseCoordinates(
                    row.coordinates_adj || row.coordinates || '', 
                    row.coordinate_type || ''
                  );
                  if (coords) {
                    const { error: geoError } = await supabase
                      .from('plot_geometry')
                      .insert({
                        plot_id: actualPlotId,
                        geometry_type: coords.type.toLowerCase(),
                        coordinates: coords.coordinates,
                      });
                    if (!geoError) geometryCreated++;
                  }
                }

                // Create plot document if exists
                if (row.document_type && row.document_type !== 'ไม่มีเอกสาร') {
                  await supabase
                    .from('plot_documents')
                    .insert({
                      plot_id: actualPlotId,
                      document_type: row.document_type,
                      document_number: row.document_number,
                      document_name: `${row.document_type} ${row.document_number || ''}`.trim(),
                    });
                }

                // Create EUDR status links
                const statusLinks = [];
                
                if (row.pre_2563) {
                  statusLinks.push({
                    plot_id: actualPlotId,
                    status_type: 'pre_2563',
                    status_value: row.pre_2563 === 'ก่อน' ? 'yes' : 'no',
                    notes: row.pre_2563,
                  });
                }

                if (row.protective_check) {
                  statusLinks.push({
                    plot_id: actualPlotId,
                    status_type: 'protective_area',
                    status_value: row.protective_check.toLowerCase().includes('non') ? 'pass' : 'fail',
                    notes: row.protective_check,
                  });
                }

                if (row.reserve_forest_check) {
                  statusLinks.push({
                    plot_id: actualPlotId,
                    status_type: 'reserve_forest',
                    status_value: row.reserve_forest_check.toLowerCase().includes('non') ? 'pass' : 'fail',
                    notes: row.reserve_forest_check,
                  });
                }

                if (row.tree_cover_loss_check) {
                  statusLinks.push({
                    plot_id: actualPlotId,
                    status_type: 'tree_cover_loss',
                    status_value: row.tree_cover_loss_check.toLowerCase().includes('non') ? 'pass' : 'fail',
                    notes: row.tree_cover_loss_check,
                  });
                }

                if (row.gfw_integrated_alerts) {
                  statusLinks.push({
                    plot_id: actualPlotId,
                    status_type: 'gfw_alerts',
                    status_value: row.gfw_integrated_alerts,
                  });
                }

                if (row.risk_analysis) {
                  statusLinks.push({
                    plot_id: actualPlotId,
                    status_type: 'risk_analysis',
                    status_value: row.risk_analysis,
                  });
                }

                if (statusLinks.length > 0) {
                  const { error: slError } = await supabase
                    .from('plot_status_links')
                    .insert(statusLinks);
                  if (!slError) statusLinksCreated += statusLinks.length;
                }
              }

              plotMap.set(row.plot_id, actualPlotId);

            } catch (err) {
              errors.push(`Plot ${row.plot_id}: ${err instanceof Error ? err.message : 'Unknown error'}`);
            }
          }

        } catch (err) {
          errors.push(`Farmer ${farmerId}: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
      }

      return {
        totalRows: rows.length,
        farmersCreated,
        plotsCreated,
        geometryCreated,
        statusLinksCreated,
        farmBooksCreated,
        errors,
      };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['farmers'] });
      queryClient.invalidateQueries({ queryKey: ['plots'] });
      queryClient.invalidateQueries({ queryKey: ['farm_books'] });
      
      if (result.errors.length === 0) {
        toast.success(`นำเข้าสำเร็จ: ${result.farmersCreated} เกษตรกร, ${result.plotsCreated} แปลง`);
      } else {
        toast.warning(`นำเข้าสำเร็จบางส่วน: ${result.farmersCreated} เกษตรกร, ${result.plotsCreated} แปลง, ${result.errors.length} ข้อผิดพลาด`);
      }
    },
    onError: (error: Error) => {
      toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
    },
  });
}

export function parseExcelCSV(text: string): ImportRow[] {
  const lines = text.split('\n').filter(l => l.trim());
  if (lines.length < 2) return [];

  // Parse headers
  const headers = lines[0].split('\t').map(h => h.trim().toLowerCase());
  
  // Map headers to our field names
  const fieldIndices: Record<keyof ImportRow, number> = {} as Record<keyof ImportRow, number>;
  headers.forEach((header, idx) => {
    const mappedField = COLUMN_MAP[header];
    if (mappedField) {
      fieldIndices[mappedField] = idx;
    }
  });

  // Parse rows
  const rows: ImportRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split('\t').map(v => v.trim());
    
    const getValue = (field: keyof ImportRow): string => {
      const idx = fieldIndices[field];
      return idx !== undefined ? values[idx] || '' : '';
    };

    const getNumber = (field: keyof ImportRow): number | undefined => {
      const val = getValue(field);
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    };

    const farmerId = getValue('farmer_id');
    const plotId = getValue('plot_id');
    
    if (!farmerId || !plotId) continue;

    rows.push({
      prefix: getValue('prefix'),
      first_name: getValue('first_name'),
      last_name: getValue('last_name'),
      address: getValue('address'),
      phone: getValue('phone'),
      farm_book_type: getValue('farm_book_type'),
      farm_book_number: getValue('farm_book_number'),
      id_card: getValue('id_card'),
      plot_count: getNumber('plot_count'),
      plot_number: getNumber('plot_number'),
      rai: getNumber('rai'),
      ngan: getNumber('ngan'),
      sq_wa: getNumber('sq_wa'),
      total_rai: getNumber('total_rai'),
      area_hectare: getNumber('area_hectare'),
      document_type: getValue('document_type'),
      document_number: getValue('document_number'),
      subdistrict: getValue('subdistrict'),
      district: getValue('district'),
      province: getValue('province'),
      coordinate_type: getValue('coordinate_type'),
      coordinates: getValue('coordinates'),
      coordinates_adj: getValue('coordinates_adj'),
      pre_2563: getValue('pre_2563'),
      farmer_id: farmerId,
      plot_id: plotId,
      collection_point_code: getValue('collection_point_code'),
      unique_id: getValue('unique_id'),
      supply_chain_complexity: getValue('supply_chain_complexity'),
      plot_status: getValue('plot_status'),
      protective_check: getValue('protective_check'),
      reserve_forest_check: getValue('reserve_forest_check'),
      tree_cover_loss_check: getValue('tree_cover_loss_check'),
      gfw_integrated_alerts: getValue('gfw_integrated_alerts'),
      risk_analysis: getValue('risk_analysis'),
      document: getValue('document'),
      capacity_kg_day: getNumber('capacity_kg_day'),
      max_range_kg_year: getNumber('max_range_kg_year'),
      min_range_kg_year: getNumber('min_range_kg_year'),
    });
  }

  return rows;
}

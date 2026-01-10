import { ResultImportRow } from './Result-ImportRow'; // สมมติว่ามี Interface นี้

export type ResultImportSummary = {
    message: string;
    total: number; // จำนวนแถวทั้งหมดที่ประมวลผล
    batches: number; // จำนวน Batch ที่ใช้
    results: ResultImportRow[]; // รายละเอียดผลลัพธ์แต่ละแถว
}
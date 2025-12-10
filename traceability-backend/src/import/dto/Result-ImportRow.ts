
export type ResultImportRow = {
    rowIndex: number;
    status: 'fulfilled' | 'rejected';
    data?: any;
    error?: any;
};

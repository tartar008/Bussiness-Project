export type Farmer = {
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

export type FarmBook = {
    id: string;
    book_number: string;
    status: string;
};

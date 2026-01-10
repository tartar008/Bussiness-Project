export type Farmer = {
    id: string;
    farmerId: string;
    prefix: string;
    firstName: string;
    lastName: string;
    citizenId: string;
    phone?: string;
    address?: string;
    createdAt?: string;
    updatedAt?: string;
};


export type FarmBook = {
    id: string;
    book_number: string;
    status: string;
};

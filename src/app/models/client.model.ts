export interface Client {
    id?: string;
    uniqueId?: string;
    name?: string;
    address?: string;
    phone?: string;
    cellPhone?: string;
    accountNumber?: number;
    balance?: number;
    limitAllow?: number;
    discount?: number;
    invoices?: any[];
    isBlocked?: boolean;
}

export interface Product {
    id?: string;
    upc?: number;
    name?: string;
    description?: string;
    format?: string;
    unitInStock?: number;
    generic?: boolean;
    unitCost?: number;
    applyTax?: boolean;
    departmentId?: number;
}

export interface Product {
    id?: string;
    upc?: number;
    name?: string;
    format?: string;
    unitInStock?: number;
    generic?: boolean;
    unitCost?: number;
    applyTax?: boolean;
    followDepartment?: boolean;
    departmentId?: number;
    ageVerification?: boolean;
    tax: number;
}

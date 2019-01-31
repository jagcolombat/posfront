export interface Product {
    id?: number;
    upc?: string;
    name?: string;
    format?: string;
    unitInStock?: number;
    generic?: boolean;
    unitCost?: number;
    applyTax?: boolean;
    followDepartment?: boolean;
    departmentId?: number;
    ageVerification?: boolean;
    ageAllow?: number;
    foodStamp?: boolean;
    tax: number;
}

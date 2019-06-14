export interface Product {
    id?: string;
    upc?: string;
    name?: string;
    format?: string;
    unitInStock?: number;
    generic?: boolean;
    unitCost?: number;
    applyTax?: boolean;
    followDepartment?: boolean;
    departmentId?: string;
    ageVerification?: boolean;
    ageAllow?: number;
    foodStamp?: boolean;
    isRefund?: boolean;
    scalable?: boolean;
    tax: number;
}

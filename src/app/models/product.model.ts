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
    wic?: boolean;
    color?: string;
    prefixIsPrice: boolean;
}

export interface IProductUpdate {
  id: string;
  upc: string;
  price: number;
}

export class ProductUpdate implements IProductUpdate {
  constructor(public id: string, public upc: string, public price: number) { }
}

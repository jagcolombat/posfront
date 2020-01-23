/**
 * Created by tony on 23/10/2018.
 */

 export interface IProductOrder {
  id: string;
  quantity: number;
  total: number;
  tax: number;
  subTotal: number;
  productId: string;
  productUpc: string;
  productName: string;
  foodStamp: boolean;
  isRefund?: boolean;
  discount?: number;
  scalable?: boolean;
}

export class ProductOrder implements IProductOrder {
  id: string;
  constructor(public quantity: number,
              public unitCost: number,
              public total: number,
              public tax: number,
              public subTotal: number,
              public productId: string,
              public productUpc: string,
              public productName: string,
              public foodStamp: boolean,
              public isRefund?: boolean,
              public discount?: number,
              public scalable?: boolean) {

  }
}

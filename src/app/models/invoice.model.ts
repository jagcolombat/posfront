import {InvoiceStatus} from "../services/connection/utils/invoice-status.enum";
import {ProductOrder} from "./order.model";

export interface IInvoice {
  id: number;
  receiptNumber: string;
  status: number;
  total: number;
  productsOrders: ProductOrder[];
  applicationUserId?: number;
}

export class Invoice implements IInvoice {
  id: number;
  constructor(public receiptNumber: string, public status: number, public total: number, public productsOrders: ProductOrder[],
              public applicationUserId?: number) {

  }
}

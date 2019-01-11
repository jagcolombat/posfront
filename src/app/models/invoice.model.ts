import {InvoiceStatus} from "../utils/invoice-status.enum";
import {ProductOrder} from "./product-order.model";

export interface IInvoice {
  id: number;
  receiptNumber: string;
  status: InvoiceStatus;
  total: number;
  productsOrders: ProductOrder[];
  applicationUserId?: number;
  clientAge?: number;
  subtotal?: number;
  tax?: number;
}

export class Invoice implements IInvoice {
  id: number;
  constructor(public receiptNumber: string,
              public status = InvoiceStatus.IN_PROGRESS,
              public total = 0,
              public productsOrders = new Array<ProductOrder>(),
              public applicationUserId?: number,
              public clientAge?: number,
              public subtotal?: number,
              public tax?: number
              ) {
  }
}

import {InvoiceStatus} from '../utils/invoice-status.enum';
import {ProductOrder} from './product-order.model';

export interface IInvoice {
  id: string;
  receiptNumber: string;
  status: InvoiceStatus;
  total: number;
  productOrders: ProductOrder[];
  fsSubtotal: number;
  fsTax: number;
  fsTotal: number;
  applicationUserId?: string;
  clientAge?: number;
  subTotal?: number;
  tax?: number;
  isRefund?: boolean;

}

export class Invoice implements IInvoice {
  id: string;
  constructor(public receiptNumber: string,
              public status = InvoiceStatus.IN_PROGRESS,
              public total = 0,
              public productOrders = new Array<ProductOrder>(),
              public applicationUserId?: string,
              public clientAge?: number,
              public subTotal?: number,
              public tax?: number,
              public isRefund?: boolean,
              public fsSubtotal: number = 0,
              public fsTax: number = 0,
              public fsTotal: number = 0,
              ) {
  }
}

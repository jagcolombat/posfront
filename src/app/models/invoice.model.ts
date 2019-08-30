import {InvoiceStatus} from '../utils/invoice-status.enum';
import {ProductOrder} from './product-order.model';
import {PaymentStatus} from "../utils/payment-status.enum";
import {ETXType} from "../utils/delivery.enum";

export interface IInvoice {
  id: string;
  receiptNumber: string;
  status: InvoiceStatus;
  total: number;
  productOrders: ProductOrder[];
  applicationUserId?: string;
  clientAge?: number;
  subTotal?: number;
  tax?: number;
  isRefund?: boolean;
  fsTotal?: number;
  date?: Date;
  productsCount?: number;
  paymentStatus?: PaymentStatus;
  tip?: number;
  balance?: number;
  type?: ETXType;
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
              public fsTotal?: number,
              public date?: Date,
              public productsCount?: number,
              public paymentStatus?: PaymentStatus,
              public tip?: number,
              public balance?: number,
              public type = ETXType.DINEIN
              ) {
  }
}

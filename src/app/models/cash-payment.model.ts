import { Invoice } from './invoice.model';

export interface ICashPayment {
    invoice: Invoice;
    total: number;
}

export class CashPaymentModel implements ICashPayment{
  constructor(public invoice: Invoice, public total: number) {}
}

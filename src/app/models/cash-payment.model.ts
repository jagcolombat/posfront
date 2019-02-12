import { Invoice } from './invoice.model';

export interface ICashPayment {
    invoice: string;
    total: number;
}

export class CashPaymentModel implements ICashPayment{
  constructor(public invoice: string, public total: number) {}
}

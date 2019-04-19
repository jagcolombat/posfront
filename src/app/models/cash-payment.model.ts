import { Invoice } from './invoice.model';

export interface ICashPayment {
    receiptNumber: string;
    total: number;
    amount: number;
}

export class CashPaymentModel implements ICashPayment{
  constructor(public receiptNumber: string, public total: number, public amount: number) {}
}

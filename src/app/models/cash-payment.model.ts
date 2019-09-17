import { PaymentOpEnum } from '../utils/operations';

export interface ICashPayment {
    receiptNumber: string;
    total: number;
    amount: number;
    type: PaymentOpEnum;
}

export class CashPaymentModel implements ICashPayment{
  constructor(public receiptNumber: string, public total: number, public amount: number, public type: PaymentOpEnum) {}
}

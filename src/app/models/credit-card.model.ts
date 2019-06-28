import {PaymentStatus} from "../utils/payment-status.enum";

export interface CreditCard {
    amount?: number;
    tip?: number;
    receiptNumber: string;
    transferType: PaymentStatus;
}

export class CreditCardModel implements CreditCard{
  constructor(public amount: number, public tip: number=0, public receiptNumber: string,
              public transferType: PaymentStatus=PaymentStatus.SAlE) {}
}


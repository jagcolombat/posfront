export interface ITransferPayment {
  amount: number;
  memo?: string;
  receiptNumber?: string;
}

export class TransferPayment implements ITransferPayment {
  constructor(public amount: number, public memo?: string, public receiptNumber?: string ) {}
}

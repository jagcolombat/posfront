export interface ITransferPayment {
  amount: number;
  memo?: string;
}

export class TransferPayment implements ITransferPayment{
  constructor(public amount: number, public memo?: string ) {}
}

export interface ICheckPayment {
  receiptNumber: string;
  amount: number;
  checkNumber: string;
  bank?: string;
  checkDate?: string;
}

export class CheckPayment implements ICheckPayment{
  constructor(public receiptNumber: string, public amount: number, public checkNumber: string, public bank?: string,
              public checkDate?: string ) {}

}

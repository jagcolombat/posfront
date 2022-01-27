export interface IFunctions {
  refund: number;
  openCheck: number;
  voids: number;
  paidOut: number;
  discount: number;
}

export class Functions implements IFunctions{
  constructor(public refund: number,public openCheck: number,public voids: number,
    public paidOut: number,public discount: number) {}
}

export interface ISales {
  saleTax: number;
  saleWithTax: number;
  grossSale: number;
  deduction: number;
  deductiontax: number;
  chargesAccount: number;
  paymentsAccounts: number;
  netSale: number;
}

export class Sales implements ISales{
  constructor(public saleTax: number,public saleWithTax: number,public grossSale: number,
    public deduction: number,public deductiontax: number,public chargesAccount: number,
    public paymentsAccounts: number, public netSale: number) {}
}

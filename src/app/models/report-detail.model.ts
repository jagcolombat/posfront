export interface IReportDetail {
  cardType: string;
  cardNumber: string;
  amount: number;
  paymentType: string;
  refNumber: string;
  paymentTypeText: string;
}

export interface IReportSummary {
  paymentAmount: number;
  paymentCount: number;
  paymentType: string;
}

export class ReportDetail implements IReportDetail {
  constructor(public cardType: string, public cardNumber: string, public amount: number, public paymentType: string,
              public refNumber: string, public paymentTypeText: string) {}
}

export class ReportSummary implements IReportSummary {
  constructor(public paymentAmount: number, public paymentCount: number, public paymentType: string) {}
}

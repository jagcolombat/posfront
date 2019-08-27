export interface IReportDetail {
  cardType: string;
  cardNumber: string;
  amount: number;
  paymentType: string;
  refNumber: string;
  paymentTypeText: string;
}

export interface IReportSummary {
  amount: number;
  count: number;
  type: string;
}

export class ReportDetail implements IReportDetail {
  constructor(public cardType: string, public cardNumber: string, public amount: number, public paymentType: string,
              public refNumber: string, public paymentTypeText: string) {}
}

export class ReportSummary implements IReportSummary {
  constructor(public amount: number, public count: number, public type: string) {}
}

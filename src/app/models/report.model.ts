import {IReportSummary, ReportDetail, ReportSummary} from './report-detail.model';

export interface IReport {
  resultCode: string;
  resultTxt: string;
  total: number;
  message: string;
  reportSummary: ReportSummary[];
  reportDetailLookups: ReportDetail[];
}

export class Report implements IReport {
  constructor(public resultCode: string, public resultTxt: string, public total: number, public message: string,
    public reportSummary: ReportSummary[], public reportDetailLookups: ReportDetail[]) {}
}

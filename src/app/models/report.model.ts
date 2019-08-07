import { ReportDetail } from './report-detail.model';

export interface Report {
  resultCode: string;
  resultTxt: string;

  creditCount: number;
  creditAmount: number;
  debitCount: number;
  debitAmount: number;
  ebtCount: number;
  ebtAmount: number;
  cashCount: number;
  cashAmount: number;

  Total: number;
  Message: string;

  ReportDetailLookups: ReportDetail[];
}

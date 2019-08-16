import {Report} from "../../models/report.model";
import {ReportDetail, ReportSummary} from "../../models/report-detail.model";

export function leaveFocusOnButton (ev: any) {
  (ev.target.tagName !== 'BUTTON') ? ev.target.parentElement.blur() : ev.target.blur();
}

export function transformCBReport(report) : Report {
  let arrTmp = new Array<ReportSummary>();
  let arrTmp1 = ['cash', 'credit', 'debit', 'ebt'];
  arrTmp1.map(type => { arrTmp.push(transformReportSummary(report, type))});
  return new Report(report.message, report.total, report.resultCode, report.resultTxt, arrTmp,
    report.reportDetailLookups);
}

export function transformReportSummary(report, type: string): ReportSummary {
  return new ReportSummary (
    report[type + 'Amount'],
    report[type + 'Count'],
    type.toUpperCase()
  );
}

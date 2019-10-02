import {Report} from "../../models/report.model";
import {ReportSummary} from "../../models/report-detail.model";
import {FinancialOpEnum, PaymentOpEnum, TotalsOpEnum} from "../operations";
import {AdminOpEnum} from "../operations/admin-op.enum";
import {EFieldType} from "../field-type.enum";

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

export const operationsWithClear = [FinancialOpEnum.REVIEW, FinancialOpEnum.REPRINT, TotalsOpEnum.FS_SUBTOTAL,
  TotalsOpEnum.SUBTOTAL, PaymentOpEnum.CASH , PaymentOpEnum.EBT_CARD, AdminOpEnum.CANCEL_CHECK, AdminOpEnum.REMOVE_HOLD]

export function dataValidation(type: EFieldType): any{
  switch (type) {
    case EFieldType.ADDRESS:
      return {max: 120};
    case EFieldType.NAME:
      return {max: 60};
    case EFieldType.PHONE:
      return {max: 12, mask: '(000) 000-0000'};
    case EFieldType.DESC:
      return {max: 200};
    case EFieldType.CARD_NUMBER:
      return {max: 16};
  }
}

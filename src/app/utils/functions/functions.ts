import {Report} from '../../models/report.model';
import {ReportSummary} from '../../models/report-detail.model';
import {FinancialOpEnum, PaymentOpEnum, TotalsOpEnum} from '../operations';
import {AdminOpEnum} from '../operations/admin-op.enum';
import {EFieldType} from '../field-type.enum';

export function leaveFocusOnButton (ev: any) {
  (ev.target.tagName !== 'BUTTON') ? ev.target.parentElement.blur() : ev.target.blur();
}

export function transformCBReport(report): Report {
  const arrTmp = new Array<ReportSummary>();
  const arrTmp1 = ['cash', 'credit', 'debit', 'ebt'];
  arrTmp1.map(type => arrTmp.push(transformReportSummary(report, type)));
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
  TotalsOpEnum.SUBTOTAL, PaymentOpEnum.CASH , PaymentOpEnum.EBT_CARD, AdminOpEnum.CANCEL_CHECK, AdminOpEnum.REMOVE_HOLD,
  AdminOpEnum.CHANGE_PRICES];

export function dataValidation(type: EFieldType): any {
  switch (type) {
    case EFieldType.ADDRESS:
      return {max: 120};
    case EFieldType.NAME:
      return {max: 60};
    case EFieldType.PHONE:
      return {max: 12, mask: '(000) 000-0000'};
    case EFieldType.DESC:
      return {min: -1, max: 200};
    case EFieldType.CARD_NUMBER:
      return {max: 16, mask: '0000 0000 0000 0000'};
    case EFieldType.EXPDATE:
      return {max: 4, mask: '00/00'};
    case EFieldType.CVV:
      return {max: 4};
    case EFieldType.ZIPCODE:
      return {max: 5};
    case EFieldType.PASSWORD:
      return {min: 4, max: 10, type: 'password'};
  }
}

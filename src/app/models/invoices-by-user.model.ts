import {CompanyType} from '../utils/company-type.enum';
import {InvoiceTransferStatusEnum} from '../utils/invoice-transfer-status.enum';
import {Invoice} from './invoice.model';

export interface IInvoicesByStates {
  user: string;
  invoices: Array<Invoice>;
  company?: CompanyType;
  total?: number;
  state?: InvoiceTransferStatusEnum;
  fromDate?: string;
  toDate?: string;
}

export class InvoicesByStates implements IInvoicesByStates {
  constructor(public user: string, public invoices: Array<Invoice>, public company?: CompanyType,
              public total?: number, public state?: InvoiceTransferStatusEnum, public fromDate?: string,
              public toDate?: string)  {}
}

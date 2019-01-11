import { Invoice } from './invoice.model';

export interface CashPayment {
    invoice: Invoice;
    total: number;
}

import {PaymentType} from '../utils/payment.enum';

export interface Payment {
    type: PaymentType;
    value: any;
}

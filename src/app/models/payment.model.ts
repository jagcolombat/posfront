import {PaymentType} from '../services/connection/utils/payment.enum';

export interface Payment {
    type: PaymentType;
    value: any;
}

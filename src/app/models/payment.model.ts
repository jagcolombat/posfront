import {PaymentOpEnum} from '../utils/operations/payment.enum';

export interface Payment {
    type: PaymentOpEnum;
    value: any;
}

import {PaymentOpEnum} from '../utils/operations/payment.enum';
import { PaymentMethodEnum } from '../utils/operations/payment-method.enum';

export interface Payment {
    type: PaymentMethodEnum;
    name: string;
    total: number;
}

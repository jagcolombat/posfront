import {PaymentStatus} from "../utils/payment-status.enum";
import {CardTypes} from "../utils/card-payment-types.enum";

/*export interface CreditCard {
    amount?: number;
    tip?: number;
    receiptNumber: string;
    transferType: PaymentStatus;
}*/

export interface CreditCard {
  amount?: number;
  tip?: number;
  receiptNumber: string;
  transferType: PaymentStatus;

  // Solo llenar cuando el metodo es manual
  account?: string; //numero de la cuenta. Probar con: 4484600024444444
  cvv?: string;     //Probar con: 437
  expDate?: string;  //Probar con 1219
  swipeMethod?: SwipeMethod; //enumerativo para manual: 2
  zipCode?: string;  //Probar con 12345
  street?: string;  //Probar con 12345

}

export interface ICardManualPayment extends CreditCard {
  cardType: string | CardTypes;
  authCode: string;
  accountNumber: string;
}

export interface CreditCardManual extends CreditCard {
  account?: string; //numero de la cuenta. Probar con: 4484600024444444
  cvv?: string;     //Probar con: 437
  expDate?: string;  //Probar con 1219
  swipeMethod?: SwipeMethod; //enumerativo para manual: 2
  zipCode?: string;  //Probar con 12345
  street?: string;  //Probar con 12345
}

export enum SwipeMethod {
  SWIPE = 1,
  MANUAL,
}

export class CreditCardModel implements CreditCard{
  constructor(public amount: number, public tip: number=0, public receiptNumber: string,
              public transferType: PaymentStatus=PaymentStatus.SALE, public account?: string, public cvv?: string,
              public expDate?: string, public swipeMethod?: SwipeMethod, public zipCode?: string, public street?: string) {}
}

export class CardManualPayment implements ICardManualPayment{
  constructor(public amount: number, public transferType: PaymentStatus=PaymentStatus.SALE,
              public receiptNumber: string, public accountNumber: string,
              public authCode: string, public cardType: string | CardTypes) {}
}


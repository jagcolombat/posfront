export interface CreditCard {
    name?: string;
    cc?: string;
    cvv?: string;
    expDate?: string;
}

export class CreditCardModel implements CreditCard{
  constructor(public name: string, public cc: string) {}
}


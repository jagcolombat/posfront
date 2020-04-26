export interface IClientModel {
    firstName: string;
    lastName?: string;
    address?: any;
    phone?: string;
    email?: string;
    company?: string;
    accountNumber?: number;
    balance?: number;
    creditLimit?: number;
}

export class ClientModel implements IClientModel{
  constructor(public firstName:string, public creditLimit?: number, public address?: string, public phone?: string,
              public email?: string, public company?: string, public accountNumber?: number, public balance?: number){}
}

import {Table} from "./table.model";
import {ETXType} from "../utils/delivery.enum";

class Client {
  name: string;
  telephone: string;
  address?: string;
}

export interface IOrderType {
  type: ETXType;
  client?: Client;
  table?: Table;
  description?: string;
}

export interface IOrder {
  id: string;
  invoiceId: string;
  type?: IOrderType;
}

export class OrderType implements IOrderType {
  constructor(public type: ETXType, public client?: Client, public table?: Table, public description?: string) {}
}

export class Order implements IOrder {
  id: string;
  constructor(public invoiceId: string, public type?: OrderType) {}
}

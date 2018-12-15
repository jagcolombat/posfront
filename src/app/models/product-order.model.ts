/**
 * Created by tony on 23/10/2018.
 */
import {Product} from "./product.model";

export interface IProductOrder {
  id: number;
  quantity: number;
  unitCost: number;
  total: number;
  tax: number;
  product: Product;

}

export class ProductOrder implements IProductOrder {
  id: number;
  constructor(public quantity: number, public unitCost: number, public total: number,
              public tax: number, public product: Product) {

  }
}

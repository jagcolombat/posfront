/**
 * Created by tony on 23/10/2018.
 */
import {TypeKey} from "../utils/typekey.enum";

export class ValueCalculator {
  constructor(public value: string | number, public type: TypeKey) { }
}

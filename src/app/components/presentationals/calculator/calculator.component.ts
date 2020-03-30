import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TypeKey} from "../../../utils/typekey.enum";
import {ValueCalculator} from "../../../models/value-calculator.model";
import {OperationsService} from "../../../services/bussiness-logic/operations.service";

@Component({
  selector: 'calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit {
  @Output() evKeys = new EventEmitter<any>();
  @Input() rightOperations=["Clear", "PLU", "Print Check", "Void"];
  @Input() numbers = [1,2,3,4,5,6,7,8,9,0,"00","@/FOR"];
  @Input() leftOperations=["F/S Subtotal", "Subtotal"];
  @Input() valid: boolean;
  space = "10px";

  constructor(private op: OperationsService) { }

  ngOnInit() {
  }

  sendKey(val: string | number, type: string) {
    //console.log(TypeKey[type.toUpperCase()]);
    if(TypeKey[type.toUpperCase()] === TypeKey.NUMBER && val === this.numbers[this.numbers.length-1]) {
      type = "for";
    }
    this.evKeys.emit(new ValueCalculator(val, TypeKey[type.toUpperCase()]));
    this.op.resetInactivity(true, 'calculator ' + val);
  }

}

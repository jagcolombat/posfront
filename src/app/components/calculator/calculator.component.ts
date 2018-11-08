import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {TypeKey} from "../../utils/typekey.enum";
import {ValueCalculator} from "../../models/value-calculator.model";

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent implements OnInit {
  @Output() evKeys = new EventEmitter<any>();
  rightOperations=["Clear", "PLU", "Print Check", "Void"];
  numbers = [1,2,3,4,5,6,7,8,9,0,"00","@/FOR"];
  leftOperations=["F/S Subtotal", "Subtotal"];
  space = "10px";

  constructor() { }

  ngOnInit() {
  }

  sendKey(val: string | number, type: string) {
    console.log(TypeKey[type.toUpperCase()]);
    if(TypeKey[type.toUpperCase()] === TypeKey.NUMBER && val === this.numbers[this.numbers.length-1]) {
      type = "for";
    }
    this.evKeys.emit(new ValueCalculator(val, TypeKey[type.toUpperCase()]));
  }

}

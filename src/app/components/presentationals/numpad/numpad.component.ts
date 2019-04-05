import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {leaveFocusOnButton} from "../../../utils/functions/functions";

@Component({
  selector: 'numpad',
  templateUrl: './numpad.component.html',
  styleUrls: ['./numpad.component.scss']
})
export class NumpadComponent implements OnInit {
  @Input() lastKey: string;
  @Input() colors: string | string[];
  @Input() disableOp = false;
  @Output() evPressKeys = new EventEmitter<any>();
  numbers = [1,2,3,4,5,6,7,8,9,0,"00"];

  constructor() { }

  ngOnInit() {
    this.numbers.push(this.lastKey);
  }

  pressKey(ev, val: string | number) {
    console.log(val);
    leaveFocusOnButton(ev);
    this.evPressKeys.emit(val);
  }

}

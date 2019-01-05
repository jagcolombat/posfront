import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'numpad',
  templateUrl: './numpad.component.html',
  styleUrls: ['./numpad.component.scss']
})
export class NumpadComponent implements OnInit {
  @Input() lastKey: string;
  @Input() colors: string | string[];
  @Output() evPressKeys = new EventEmitter<any>();
  numbers = [1,2,3,4,5,6,7,8,9,0,"00"];

  constructor() { }

  ngOnInit() {
    this.numbers.push(this.lastKey);
  }

  pressKey(val: string | number) {
    console.log(val);
    this.evPressKeys.emit(val);
  }

}

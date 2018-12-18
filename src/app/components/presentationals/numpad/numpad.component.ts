import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-numpad',
  templateUrl: './numpad.component.html',
  styleUrls: ['./numpad.component.css']
})
export class NumpadComponent implements OnInit {
  @Input() lastKey: string;
  @Input() colors: string | string[];
  numbers = [1,2,3,4,5,6,7,8,9,0,"00"];

  constructor() { }

  ngOnInit() {
    this.numbers.push(this.lastKey);
  }

}

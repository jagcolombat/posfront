import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-generic-keyboard',
  templateUrl: './generic-keyboard.component.html',
  styleUrls: ['./generic-keyboard.component.css']
})
export class GenericKeyboardComponent implements OnInit {
  @Input() valid: boolean;
  @Output() evKeys = new EventEmitter<any>();
  input = "";
  operations = ['Clear', 'Enter'];
  numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '00', 'Back'];

  constructor() { }

  ngOnInit() {
  }

  sendKeys(ev) {
    this.evKeys.emit(ev);
  }

}

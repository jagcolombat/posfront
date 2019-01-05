import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'input-calculator',
  templateUrl: './input-calculator.component.html',
  styleUrls: ['./input-calculator.component.scss']
})
export class InputCalculatorComponent implements OnInit {
  @Input() data = "";

  constructor() { }

  ngOnInit() {
  }

}

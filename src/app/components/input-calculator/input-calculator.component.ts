import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-input-calculator',
  templateUrl: './input-calculator.component.html',
  styleUrls: ['./input-calculator.component.css']
})
export class InputCalculatorComponent implements OnInit {
  @Input() data = "";

  constructor() { }

  ngOnInit() {
  }

}

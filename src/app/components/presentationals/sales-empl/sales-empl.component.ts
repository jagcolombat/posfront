import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'sales-empl',
  templateUrl: './sales-empl.component.html',
  styleUrls: ['./sales-empl.component.scss']
})
export class SalesEmplComponent implements OnInit {
  @Input() employes: Array<any>;
  @Input() sales: Array<any>;
  @Output() selectEmployed = new EventEmitter<string>();
  emplSel: any;

  constructor() {}

  ngOnInit() {
  }

  select(ev) {
    this.selectEmployed.emit(ev.value);
  }

}

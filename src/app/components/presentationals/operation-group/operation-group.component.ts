import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'operation-group',
  templateUrl: './operation-group.component.html',
  styleUrls: ['./operation-group.component.scss']
})
export class OperationGroupComponent implements OnInit {
  @Input() operations: string[];
  @Input() colors: string | string[];
  @Input() layout: string;
  @Output() evPressKeys = new EventEmitter<any>();
  @Input() disableOp = false;

  constructor() { }

  ngOnInit() { }

  pressKey(val: string | number) {
    console.log(val);
    this.evPressKeys.emit(val);
  }

  setColor(index) {
    return typeof this.colors === 'string' ? this.colors : this.colors[this.operations.indexOf(index)]
  }
}

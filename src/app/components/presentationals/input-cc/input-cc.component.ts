import {Component, Inject, Input, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'input-cc',
  templateUrl: './input-cc.component.html',
  styleUrls: ['./input-cc.component.scss']
})
export class InputCcComponent implements OnInit {
  @Input() title = 'Input Credit Card Info';
  @Input() label = 'CC Number';
  inputDigits: boolean;
  digits = '';
  maxlength = 16;
  mask = '';

  constructor(public dialogRef: MatDialogRef<InputCcComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    // this.cost = this.data.unitCost.toString();
    if (this.data.name) {
      this.title = this.data.name;
    }
    if (this.data.label) {
      this.label = this.data.label;
    }
    if(this.data.type){
      this.maxlength = this.data.type.max;
      this.mask = (this.data.type.mask)? this.data.type.mask: '';
    }
  }

  getKeys(ev) {
    if (ev.type === 1 && this.digits.length < this.maxlength) {
      this.inputNumber(ev.value);
    } else if (ev.value === 'Clear') {
      this.resetPrice();
    } else if (ev.value === 'Enter') {
      this.sendData();
    } else if (ev.value === 'Back') {
      this.back();
    }
  }

  inputNumber(value) {
    if (!this.inputDigits) {
      this.inputDigits = true;
    }
    this.digits += value + '';
    /*const cost = parseFloat(this.digits) * 0.01;
    if (cost !== 0) {
      this.cost = cost.toPrecision(this.digits.length);
      this.data.unitCost = cost;
    } else {
      this.resetPrice();
    }*/
    if (this.digits !== '') {
      this.data.number = this.digits;
    } else {
      this.resetPrice();
    }
  }

  sendData() {
    // console.log("addGenericProd", this.data);
    this.dialogRef.close(this.data);
  }

  back() {
    if (this.digits.length > 1 ) {
      this.digits = this.digits.slice(0, this.digits.length - 1);
      /*const cost = parseFloat(this.digits) * 0.01;
      this.cost = cost.toPrecision(this.digits.length);
      this.data.unitCost = cost;*/
      this.data.number = this.digits;
    } else {
      this.resetPrice();
    }
  }

  resetPrice() {
    this.data.number = '';
    this.digits = '';
    //this.cost = '0.00';
  }

}

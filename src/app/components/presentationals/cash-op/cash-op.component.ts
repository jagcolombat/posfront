import { Component, OnInit, Inject, Input, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TypeKey } from 'src/app/utils/typekey.enum';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-cash-op',
  templateUrl: './cash-op.component.html',
  styleUrls: ['./cash-op.component.css']
})
export class CashOpComponent implements OnInit {
  @ViewChild('cashForm') cashForm: NgForm;
  @Input() title = 'Enter sale price. Total: ' + this.data;
  inputDigits: boolean;
  digits = '';
  cost = '';
  maxlength = 12;
  valid: boolean = true;
  constructor(public dialogRef: MatDialogRef<CashOpComponent>,
              @Inject(MAT_DIALOG_DATA) public data: number) {
  }

  ngOnInit() {

  }

  getKeys(ev) {
    if (ev.type === 1 && this.digits.length < this.maxlength) {
      this.inputNumber(ev.value);
    } else if (ev.value === 'Clear') {
      this.resetPrice();
    } else if (ev.value === 'Enter') {
      this.addGenericProd();
    } else if (ev.value === 'Back') {
      this.back();
    }
    // this.validTotalToPaid();
  }

  inputNumber(value) {
    if (!this.inputDigits) {
      this.inputDigits = true;
    }
    this.digits += value + '';
    const cost = parseFloat(this.digits) * 0.01;
    if (cost !== 0) {
      this.cost = cost.toPrecision(this.digits.length);

    } else {
      this.resetPrice();
    }
  }

  addGenericProd() {
    this.dialogRef.close(Number.parseFloat(this.cost));
  }

  back() {
    if (this.digits.length > 1 ) {
      this.digits = this.digits.slice(0, this.digits.length - 1);
      const cost = parseFloat(this.digits) * 0.01;
      this.cost = cost.toPrecision(this.digits.length);
    } else {
      this.resetPrice();
    }
  }

  resetPrice() {
    this.digits = '';
    this.cost = '0.00';
  }

  validTotalToPaid(): void {
    if (Number.parseFloat(this.cost) >=  this.data) {
      this.valid = true;
    } else {
      this.valid = false;
    }
  }
}

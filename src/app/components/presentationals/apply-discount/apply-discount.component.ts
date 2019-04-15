import {Component, Input, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material";

@Component({
  selector: 'app-apply-discount',
  templateUrl: './apply-discount.component.html',
  styleUrls: ['./apply-discount.component.scss']
})
export class ApplyDiscountComponent implements OnInit {
  @Input() title = 'Apply discount';
  inputDigits: boolean;
  digits = '';
  cost = 0;
  maxlength = 3;
  min = 1;
  max = 100;
  tryValidation = false;
  valid = false;
  errorMsg: string;

  constructor(public dialogRef: MatDialogRef<ApplyDiscountComponent>) { }

  ngOnInit() {
  }

  getKeys(ev) {
    if (ev.type === 1 && (this.digits.length < this.maxlength)) {
      // Si es una tecla numerica y se cumple la validación
      this.inputNumber(ev.value);
    } else if (ev.value === 'Clear') {
      this.resetPrice();
    } else if (ev.value === 'Enter') {
      this.applyDiscount();
    } else if (ev.value === 'Back') {
      this.back();
    }
  }

  inputNumber(value) {
    if (!this.inputDigits) {
      this.inputDigits = true;
    }
    this.digits += value + '';
    const cost = parseInt(this.digits);
    this.validate(cost);
  }

  applyDiscount() {
    //console.log("apply discount", this.valid, this.tryValidation);
    //console.log("apply discount", this.cost);
    this.validate(parseInt(this.digits));
    if(this.valid && this.tryValidation) {
      this.dialogRef.close(this.cost);
    }
  }

  back() {
    if (this.digits.length > 1 ) {
      let cursor = (this.digits.length > 3) ? 2 : 1;
      this.digits = this.digits.slice(0, this.digits.length - cursor);
      this.valid = true;
      this.tryValidation = true;
      this.cost = parseInt(this.digits);
    } else {
      this.resetPrice();
    }
  }

  resetPrice() {
    this.digits = '';
    this.cost = 0;
    this.valid = false;
    this.tryValidation = true;
  }

  private validate(cost) {
    if (cost >= this.min && cost <= this.max) {
      this.cost = cost;
      this.valid = true;
      this.tryValidation = true;
    } else {
      if(this.digits.length > 2) this.back();
      this.valid = false;
      this.tryValidation = true;
      this.errorMsg = 'Discount must be between 0 to 100';
    }
  }
}

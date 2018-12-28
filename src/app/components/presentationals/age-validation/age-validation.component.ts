import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-age-validation',
  templateUrl: './age-validation.component.html',
  styleUrls: ['./age-validation.component.css']
})
export class AgeValidationComponent implements OnInit {
  data = 'mm/dd/yyyy';
  number = '00000000';
  maxlength = 10;
  index = 0;

  constructor(public dialogRef: MatDialogRef<AgeValidationComponent>) { }

  ngOnInit() {
  }

  onAgeValidation() {
    console.log(this.data);
    const birthday = new Date(this.data);
    const now = new Date();

    console.log(birthday + ':' + birthday.getTime());
    console.log(now + ':' + now.getTime());

    const timediff = Math.abs(Date.now() - birthday.getTime());
    const age = Math.floor((timediff / (1000 * 3600 * 24)) / 365);
    console.log('Age:' + age);
    this.dialogRef.close({age: age, date: birthday.getTime()});
  }

  getKeys(ev) {
    if (ev.type === 1) {
      this.inputNumber(ev.value);
    } else if (ev.value === 'Clear') {
      this.resetPrice();
    } else if (ev.value === 'Enter') {
      this.onAgeValidation();
    } else if (ev.value === 'Back') {
      this.back();
    }
  }

  inputNumber(value) {
    if (this.index < 8) {
      console.log(this.data);
      this.number = this.replaceAt(this.number, this.index, value);
      console.log(this.number);
      this.data = this.insertAt(this.number, 2, '/');
      this.data = this.insertAt(this.data, 5, '/');
      this.index++;
      console.log(this.data);
    }
  }

  back() {
    if (this.index > 0) {
      this.index--;
      this.number = this.replaceAt(this.number, this.index, '0');
      console.log(this.number);

      this.data = this.insertAt(this.number, 2, '/');
      this.data = this.insertAt(this.data, 5, '/');
      console.log(this.data);
    }
  }

  resetPrice() {
    this.data = 'mm/dd/yyyy';
    this.number = '00000000';
    this.index = 0;
  }

  replaceAt(data: string, index: number, replacement: string): string {
    return data.slice(0, index) + replacement + data.slice(index + 1);
  }

  insertAt(data: string, index: number, replacement: string): string {
    return data.slice(0, index) + replacement + data.slice(index);
  }


}

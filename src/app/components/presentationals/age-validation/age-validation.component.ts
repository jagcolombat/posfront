import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-age-validation',
  templateUrl: './age-validation.component.html',
  styleUrls: ['./age-validation.component.scss']
})
export class AgeValidationComponent implements OnInit {
  data = 'mm/dd/yyyy';
  number = '00000000';
  maxlength = 10;
  index = 0;
  regularExpretion = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/((19\d{2})|(20(0[0-9]|1\d)))$/;
  // regularExpretion = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
  isValid: boolean;

  ageForm: FormGroup;
  dateInput: AbstractControl;

  constructor(public dialogRef: MatDialogRef<AgeValidationComponent>) { }

  ngOnInit() {
    this.ageForm = new FormGroup({
      dateInput: new FormControl(null, [Validators.required,
                                       Validators.pattern(this.regularExpretion)])
    });

    this.dateInput = this.ageForm.controls['dateInput'];
  }

  onAgeValidation() {
    console.log(this.data);

    try {
      const birthday = new Date(this.data);

      // Validate correct day
      const day =  birthday.getDate();
      const enterDay = Number.parseInt(this.data.slice(3, 5));
      if (day !== enterDay) {
        throw new Error('Invalid date');
      }

      const now = new Date();

      console.log(birthday + ':' + birthday.getTime());
      console.log(now + ':' + now.getTime());

      /*if (birthday.getTime() > Date.now()) {
        this.isValid = false;
        return;
      }*/

      const timediff = Math.abs(Date.now() - birthday.getTime());
      const age = Math.floor((timediff / (1000 * 3600 * 24)) / 365);
      console.log('Age:' + age);
      this.dialogRef.close({age: age, date: birthday.getTime()});
    } catch (error) {
      console.log('This date is invalid');
      this.isValid = false;
    }
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
      this.isValid = this.regularExpretion.test(this.data);
      console.log(this.isValid);
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

      this.isValid = this.regularExpretion.test(this.data);
      console.log(this.isValid);
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

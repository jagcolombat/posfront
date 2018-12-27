import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-age-validation',
  templateUrl: './age-validation.component.html',
  styleUrls: ['./age-validation.component.css']
})
export class AgeValidationComponent implements OnInit {

  data: string;

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

}

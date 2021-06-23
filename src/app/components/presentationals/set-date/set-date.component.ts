import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDatepickerInputEvent, MatDialogRef} from '@angular/material';
import {from} from 'rxjs';

@Component({
  selector: 'app-set-date',
  templateUrl: './set-date.component.html',
  styleUrls: ['./set-date.component.scss']
})
export class SetDateComponent implements OnInit {

  title = 'Set Date';
  subtitle = 'Choose a date:';
  date: any;
  minDate  = new Date(2020, 0, 1);
  maxDate  = new Date();
  response = {lastClose: false, date: null};

  constructor(
    public dialogRef: MatDialogRef<SetDateComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data.title) { this.title = data.title; }
    if (data.subtitle) { this.subtitle = data.subtitle; }
    this.date = (data.cleanDate) ? '' : new Intl.DateTimeFormat('en-US').format(new Date());
  }

  ngOnInit() {
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    console.log('setDate addEvent', type, event.value);
    this.date = event.value;
  }

  lastClose() {
    this.response.lastClose = true;
    this.dialogRef.close(this.response);
  }

  dateClose() {
    this.response.date = { from: '', to: ''};
    if (this.date) {
      this.response.date['from'] = this.getFormatDate(new Date(this.date), true);
      this.response.date['to'] = this.getFormatDate(new Date(this.date), false);
    }
    this.dialogRef.close(this.response);
  }

  dateTimeWorked() {
    this.dialogRef.close(this.getFormatOnlyDate(new Date(this.date)));
  }

  getFormatDate(date: Date, start?: boolean) {
    return date.toISOString().split('T')[0] + ((start) ? ' 00:00:00' : ' 23:59:59');
  }

  getFormatOnlyDate(date: Date) {
    return date.toISOString().split('T')[0];
  }

}

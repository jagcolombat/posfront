import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDatepickerInputEvent, MatDialogRef} from '@angular/material';
import { DataStorageService } from 'src/app/services/api/data-storage.service';
import { CashService } from 'src/app/services/bussiness-logic/cash.service';
import { OperationsService } from 'src/app/services/bussiness-logic/operations.service';
import { InformationType } from 'src/app/utils/information-type.enum';

@Component({
  selector: 'app-range-date',
  templateUrl: './range-date.component.html',
  styleUrls: ['./range-date.component.scss']
})
export class RangeDateComponent implements OnInit {
  title = 'Range Date';
  subtitle = 'Choose a date:';
  startdate: any;
  enddate: any;
  startClose: any;
  endClose: any;  
  minDate  = new Date(2020, 0, 1);
  maxDate  = new Date();
  minEndDate  = new Date(2020, 0, 1);
  maxStartDate  = new Date();
  response = {startCloseDate: '', endCloseDate: ''};
  enddisabled: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<RangeDateComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private dataStorage: DataStorageService, private operationService: OperationsService, 
    private cashService: CashService) {
    if (data.title) { this.title = data.title; }
    if (data.subtitle) { this.subtitle = data.subtitle; }
    this.startdate = (data.cleanDate) ? '' : new Intl.DateTimeFormat('en-US').format(new Date());
    this.enddate = (data.cleanDate) ? '' : new Intl.DateTimeFormat('en-US').format(new Date());
  }
  ngOnInit() {
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    console.log('setDate addEvent', type, event.value);
    if(type === 'start') { 
      this.startdate = event.value;
      this.enddisabled = false;
      this.minEndDate = event.value;
      this.showCloseReports(this.startdate, true);
    } else {
      this.enddate = event.value;
      this.maxStartDate = event.value;
      this.showCloseReports(this.getFormatDate(new Date(this.enddate), false), false);
    }
  }

  showCloseReports(date: string, start: boolean) {
    //const closeReports = new Array<any>({value: '1000', date: date+'-12:00'});
    const from= this.getFormatDate(new Date(this.startdate), true);
    const to= this.getFormatDate(new Date(this.startdate), false);
    this.dataStorage.getCloseReportsByDate(from, to).subscribe(
        next => {
          console.log(next);
          const closeReports = next.map(close => new Object({
            total: close.saleTax + '',
            range: this.removeTFromISODate(close.openingTime) + ' - ' + this.removeTFromISODate(close.closeTime),
            id: close.id,
            date: start ? close.openingTime : close.closeTime,
          }));
          this.operationService.openDialogWithPag(closeReports, 
            (e) => this.selectedCloseReport(e, start), 'Close reports',
            'Select a close report:', 'date', 'total','', '', 40);
        },
        error => this.cashService.openGenericInfo(InformationType.ERROR, error)
      );
    /*this.operationService.openDialogWithPag(closeReports, (e) => this.selectedCloseReport(e, start), 'Close reports',
        'Select a close report:', 'date', 'value');*/
  }       
  
  selectedCloseReport(report: any, start: boolean) {
    console.log('selectedCloseReport', report, start);
    start ? this.startClose = report: this.endClose = report;
  }

  getCloseReport() {
    this.response.startCloseDate = this.startClose.date;
    this.response.endCloseDate = this.endClose.date;
    this.dialogRef.close(this.response);
  }

  getFormatDate(date: Date, start?: boolean) {
    return date.toISOString().split('T')[0] + ((start) ? ' 00:00:00' : ' 23:59:59');
  }

  getFormatOnlyDate(date: Date) {
    return date.toISOString().split('T')[0];
  }

  removeTFromISODate(date: string) {
    return date.split('.')[0].replace('T', ' ');
  }

}

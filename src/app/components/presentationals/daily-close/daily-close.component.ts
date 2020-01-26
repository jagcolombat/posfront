import {Component, Inject, OnInit} from '@angular/core';
import {AdminOptionsService} from "../../../services/bussiness-logic/admin-options.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

@Component({
  selector: 'app-daily-close',
  templateUrl: './daily-close.component.html',
  styleUrls: ['./daily-close.component.scss']
})
export class DailyCloseComponent implements OnInit {

  employeeId: string;

  constructor(public dialogRef: MatDialogRef<DailyCloseComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any/*, private adminOpServ: AdminOptionsService*/) { }

  ngOnInit() {
    console.log('employId', this.employeeId);
  }

  setEmployee(ev: any){
    console.log('setEmployee', ev);
    this.employeeId = ev;
  }

  print(){
    console.log('setEmployee', 'print', this.employeeId);
    //this.employeeId ? this.adminOpServ.dayClosePrint(this.employeeId) : this.adminOpServ.dayClosePrint();
    this.dialogRef.close({employee: this.employeeId, closeDay: false})
  }

  close(){
    console.log('setEmployee', 'print', this.employeeId);
    //this.employeeId ? this.adminOpServ.confirmDayClose(this.employeeId) : this.adminOpServ.confirmDayClose();
    this.dialogRef.close({employee: this.employeeId, closeDay: true})
  }

}

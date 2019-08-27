import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {DataStorageService} from "../../../services/api/data-storage.service";
import {AdminOpEnum} from "../../../utils/operations/admin-op.enum";
import {CloseBatch} from "../../../utils/close.batch.enum";
import { GridOptions, GridApi } from 'ag-grid-community';
import {Report} from "../../../models/report.model";
import {transformCBReport} from "../../../utils/functions/functions";

@Component({
  selector: 'admin-config',
  templateUrl: './admin-config.component.html',
  styleUrls: ['./admin-config.component.scss']
})
export class AdminConfigComponent implements OnInit {
  timeLogout: number;
  adminClearVoid: boolean;
  closeBatch:boolean;
  typeCloseBatch:number;
  cb = CloseBatch;
  cbReport: Report;
  public gridOptionsSummary: GridOptions;
  public gridOptionsDetails: GridOptions;
  loading = false;
  colDefsSummary = [
    {
      headerName: 'Type',
      field: 'type',
      width: 150
    },
    {
      headerName: 'Count',
      field: 'count',
      type: 'numericColumn'
    },
    {
      headerName: 'Amount',
      field: 'amount',
      type: 'numericColumn'
    }
  ];
  colDefsDetails = [
    {
      headerName: 'Card Type',
      field: 'cardType',
      width: 200
    },
    {
      headerName: 'Card Number',
      field: 'cardNumber',
      width: 220
    },
    {
      headerName: 'Payment Type',
      field: 'paymentType',
      width: 220
    },
    {
      headerName: 'Amount',
      field: 'amount',
      type: 'numericColumn'
    },
    {
      headerName: 'Ref Number',
      field: 'refNumber',
      type: 'numericColumn'
    }
  ];

  constructor( public dialogRef: MatDialogRef<AdminConfigComponent>,
               @Inject(MAT_DIALOG_DATA) public data: any, private dataStorage: DataStorageService) {
    this.updateGridOptionsSummary();
    this.updateGridOptionsDetails();
  }

  ngOnInit() {
    this.closeBatch = this.data.title=== AdminOpEnum.CLOSE_BATCH;
    // if((this.closeBatch && this.cbReport) || !this.closeBatch) this.enableBtns = true;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  setTime4Logout($event:any) {
    console.log('setTime4Logout', $event, this.timeLogout)
  }

  setAdmin4ClearVoid($event: any) {
    console.log('setAdmin4ClearVoid', $event, this.adminClearVoid)
  }

  setTypeCloseBatch($event: any) {
    console.log('setTypeCloseBatch', $event, this.typeCloseBatch);
    this.loading = true;
    if(!this.cbReport){
      this.dataStorage.getCloseBatchReport(this.typeCloseBatch).subscribe(
        next => {
          console.log(next);
          this.loading = false;
          this.cbReport = next;
          this.setDataByType();
        },
        err => console.error(err));
    } else {
      this.setDataByType();
    }
  }

  setDataByType(){
    if(this.typeCloseBatch == CloseBatch.SUMMARY){
      this.cbReport.paymentDetailLookups.forEach((v, i) => this.cbReport.paymentDetailLookups[i].amount =
        Number((v.amount).toFixed(2)));
      this.setData(this.cbReport.paymentDetailLookups, this.gridOptionsSummary);
    } else {
      this.cbReport.reportDetailLookups.forEach((v, i) => this.cbReport.reportDetailLookups[i].amount =
        Number((v.amount).toFixed(2)))
      this.setData(this.cbReport.reportDetailLookups, this.gridOptionsDetails);
    }
  }

  done(){
    if(this.closeBatch)
      this.dialogRef.close(this.typeCloseBatch);
    else {
      this.dialogRef.close();
    }
  }

  updateGridOptionsSummary(){
    this.gridOptionsSummary = <GridOptions>{
      rowData: [],
      onGridReady: () => {
        this.gridOptionsSummary.api.sizeColumnsToFit();
      },
      onBodyScroll: (ev) => {
        this.gridOptionsSummary.api.sizeColumnsToFit();
      },
      rowHeight: 60,
      rowStyle: {'font-size': '16px'}
    };
  }

  updateGridOptionsDetails(){
    this.gridOptionsDetails = <GridOptions>{
      rowData: [],
      onGridReady: () => {
        this.gridOptionsDetails.api.sizeColumnsToFit();
      },
      onBodyScroll: (ev) => {
        this.gridOptionsDetails.api.sizeColumnsToFit();
      },
      rowHeight: 60,
      rowStyle: {'font-size': '16px'}
    };
  }

  private setData(data, grid) {
    grid.api.setRowData(data);
    grid.api.sizeColumnsToFit();
  }
}

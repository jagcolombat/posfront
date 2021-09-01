import {Component, Inject, OnInit} from '@angular/core';
import {CloseBatch} from "../../../utils/close.batch.enum";
import {Report} from "../../../models/report.model";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {DataStorageService} from "../../../services/api/data-storage.service";
import {CashService} from "../../../services/bussiness-logic/cash.service";
import { GridOptions, GridApi } from 'ag-grid-community';

@Component({
  selector: 'app-close-batch',
  templateUrl: './close-batch.component.html',
  styleUrls: ['./close-batch.component.scss']
})
export class CloseBatchComponent implements OnInit {
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

  constructor(public dialogRef: MatDialogRef<CloseBatchComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private dataStorage: DataStorageService,
              private cashService: CashService) {
    this.updateGridOptionsSummary();
    this.updateGridOptionsDetails();
  }

  ngOnInit() {
  }

  setTypeCloseBatch($event: any) {
    console.log('setTypeCloseBatch', $event, this.typeCloseBatch);
    this.loading = true;
    if(this.typeCloseBatch !== undefined){
      //if(!this.cbReport){
        this.dataStorage.getCloseBatchReport(this.typeCloseBatch).subscribe(
          next => {
            console.log(next);
            this.loading = false;
            this.cbReport = next;
            this.setDataByType();
          },
          err => {
            console.error(err);
            this.loading = false;
            this.cashService.openGenericInfo('Error', err);
          });
      /*} else {
        this.setDataByType();
      }*/
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
    this.loading = false;
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

  done(){
    this.dialogRef.close(this.typeCloseBatch);
  }

}

import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {DataStorageService} from "../../../services/api/data-storage.service";
import {AdminOpEnum} from "../../../utils/operations/admin-op.enum";
import {CloseBatch} from "../../../utils/close.batch.enum";
import { GridOptions, GridApi } from 'ag-grid-community';

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
  public gridOptions: GridOptions;
  private gridApi: GridApi;
  columnDefs: any;

  constructor( public dialogRef: MatDialogRef<AdminConfigComponent>,
               @Inject(MAT_DIALOG_DATA) public data: any, private dataStorage: DataStorageService) {
    this.updateGridOptions();
  }

  ngOnInit() {
    this.closeBatch = this.data.title=== AdminOpEnum.CLOSE_BATCH;
    this.gridApi = this.gridOptions.api;
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
    this.dataStorage.getCloseBatchReport(this.typeCloseBatch).subscribe(
      next => {
        console.log(next);

      },
      err => console.error(err));
  }

  done(){
    if(this.closeBatch)
      this.dialogRef.close(this.typeCloseBatch);
    else {
      this.dialogRef.close();
    }
  }

  private createColumnDefs() {
    this.columnDefs = [
      {
        headerName: 'Receipt number',
        field: 'receiptNumber',
        width: 250
      },
      {
        headerName: 'Total',
        field: 'total',
        type: 'numericColumn'
      }
    ];
  }

  updateGridOptions(){
    this.gridOptions = <GridOptions>{
      rowData: [],
      onGridReady: () => {
        this.gridOptions.api.sizeColumnsToFit();
      }/*,
      onRowClicked: (ev) => {
        // this.invoiceService.invoiceProductSelected = this.gridOptions.api.getSelectedRows().length > 0;
        if(ev.data.receiptNumber)
          this.selectInvoice.emit(ev.data.receiptNumber);
        else
          console.error('Receipt number not specified')
      }*/,
      onBodyScroll: (ev) => {
        this.gridOptions.api.sizeColumnsToFit();
      },
      rowHeight: 60,
      rowStyle: {'font-size': '16px'}
    };
    this.createColumnDefs();
  }
}

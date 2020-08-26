import {Component, Input, OnInit} from '@angular/core';
import { GridOptions, GridApi } from 'ag-grid-community';
import {dateFormatter} from "../../../utils/functions/transformers";

@Component({
  selector: 'time-worked',
  templateUrl: './time-worked.component.html',
  styleUrls: ['./time-worked.component.scss']
})
export class TimeWorkedComponent implements OnInit {
  // Worker records
  private _records: Array<any>;
  @Input()
  set records(data) {
    this._records = data;
    if(this._records) this.setData();
  }
  get records(){
    return this._records;
  }
  //Time worked
  private _time: string;
  @Input()
  set time(data) {
    this._time = data;
    if(this._time) this.setTotal();
  }
  get time(){
    return this._time;
  }
  // Worker
  @Input() emplSel: any;

  public gridOptions: GridOptions;
  private gridApi: GridApi;
  columnDefs: any;

  bottomData = [{
    recordType: 'Time worked',
    date: ''
  }]

  constructor() {
    this.updateGridOptions();
  }

  ngOnInit() {
    this.gridApi = this.gridOptions.api;
  }

  private createColumnDefs() {
    this.columnDefs = [
      {
        headerName: 'Record Type',
        field: 'recordType',
        width: 210
      },
      {
        headerName: 'Datetime',
        field: 'date',
        width: 220,
        valueFormatter: this.dateFormatter
      }
    ];
  }

  dateFormatter(params){
    return dateFormatter(params.value)
    //params.value !== '' ? new Date(params.value).toLocaleString('en-US', {hour12: false}) : '';
  }

  updateGridOptions(){
    this.gridOptions = <GridOptions>{
      rowData: [],
      onGridReady: () => {
        this.gridOptions.api.sizeColumnsToFit();
      },
      onBodyScroll: (ev) => {
        this.gridOptions.api.sizeColumnsToFit();
      },
      rowHeight: 50,
      rowStyle: {'font-size': '16px'}
    };
    this.createColumnDefs();
  }

  private setData() {
    console.log('setData', this.records);
    this.gridOptions.api.setRowData(this.records);
    this.gridOptions.api.sizeColumnsToFit();
  }

  private setTotal() {
    console.log('setData', this.time);
    this.bottomData[0].date = this.time;
  }

  /*onPrint() {
    console.log('Print invoices by user', this.emplSel);
    if(this.emplSel){
      this.dataStorage.printInvoiceByUser(this.emplSel.id).subscribe(next => {
        console.log(next);
      }, error1 => {
        console.error('getSales', error1);
      });
    } else {
      console.log('Debe seleccionar un empleado');
    }
  }*/
}

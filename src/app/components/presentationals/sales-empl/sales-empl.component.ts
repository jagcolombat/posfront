import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { GridOptions, GridApi } from 'ag-grid-community';

@Component({
  selector: 'sales-empl',
  templateUrl: './sales-empl.component.html',
  styleUrls: ['./sales-empl.component.scss']
})
export class SalesEmplComponent implements OnInit {
  @Input() employes: Array<any>;
  private _sales: Array<any>;
  @Input()
  set sales(data) {
    this._sales = data;
    if(this._sales) this.setData();
  }
  get sales(){
    return this._sales;
  }
  @Output() selectEmployed = new EventEmitter<string>();
  @Output() selectInvoice = new EventEmitter<string>();
  emplSel: any;
  public gridOptions: GridOptions;
  private gridApi: GridApi;
  columnDefs: any;

  constructor() {
    this.updateGridOptions();
  }

  ngOnInit() {
    this.gridApi = this.gridOptions.api;
  }

  select(ev) {
    this.selectEmployed.emit(ev.value);
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
      },
      onRowClicked: (ev) => {
        // this.invoiceService.invoiceProductSelected = this.gridOptions.api.getSelectedRows().length > 0;
        if(ev.data.receiptNumber)
          this.selectInvoice.emit(ev.data.receiptNumber);
        else
          console.error('Receipt number not specified')
      },
      onBodyScroll: (ev) => {
        this.gridOptions.api.sizeColumnsToFit();
      },
      rowHeight: 60,
      rowStyle: {'font-size': '16px'}
    };
    this.createColumnDefs();
  }

  private setData() {
    console.log('setData', this.sales);
    this.gridOptions.api.setRowData(this.sales);
    this.gridOptions.api.sizeColumnsToFit();
  }
}

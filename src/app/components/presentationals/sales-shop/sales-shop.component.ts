import {Component, Input, OnInit} from '@angular/core';
import { GridOptions, GridApi } from 'ag-grid-community';

@Component({
  selector: 'sales-shop',
  templateUrl: './sales-shop.component.html',
  styleUrls: ['./sales-shop.component.scss']
})
export class SalesShopComponent implements OnInit {
  private _sales: Array<any>;
  private gridReady: boolean;
  @Input()
  set sales(data) {
    this._sales = data;
    if(this._sales && this.gridReady) this.setData();
  }
  get sales(){
    return this._sales;
  }
  public gridOptions: GridOptions;
  private gridApi: GridApi;
  columnDefs: any;

  constructor() {
    this.updateGridOptions();
  }

  ngOnInit() {
    this.gridApi = this.gridOptions.api;
  }

  private createColumnDefs() {
    this.columnDefs = [
      {
        headerName: 'Payment type',
        field: 'type',
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
        this.setData();
        this.gridOptions.api.sizeColumnsToFit();
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
    this.sales.forEach((v, i) => this.sales[i].total = Number((v.total).toFixed(2)))
    this.gridOptions.api.setRowData(this.sales);
    this.gridOptions.api.sizeColumnsToFit();
  }

}

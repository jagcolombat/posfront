import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { GridOptions, GridApi } from 'ag-grid-community';
import { DataStorageService } from 'src/app/services/api/data-storage.service';
import {CompanyType} from "../../../utils/company-type.enum";
import {CashService} from "../../../services/bussiness-logic/cash.service";

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
  @Input() emplSel: any;
  public gridOptions: GridOptions;
  private gridApi: GridApi;
  columnDefs: any;
  /*bottomOptions = <GridOptions>{
    alignedGrids: [],
    suppressHorizontalScroll: true,
    rowStyle: {fontWeight: 'bold', fontSize: '16px'}
  };

  @ViewChild('topGrid') topGrid;
  @ViewChild('bottomGrid') bottomGrid;*/

  bottomData = [{
    receiptNumber: 'Total',
    date: '',
    total: 0,
    tips: 0
  }]

  constructor(private dataStorage: DataStorageService, private cashService: CashService) {
    this.updateGridOptions();
  }

  ngOnInit() {
    this.gridApi = this.gridOptions.api;
  }

  select(ev) {
    //if(ev.value !== undefined) this.selectEmployed.emit(ev.value);
    this.selectEmployed.emit(ev.value);
  }

  private createColumnDefs() {
    this.columnDefs = [
      {
        headerName: 'Receipt number',
        field: 'receiptNumber',
        width: 210
      },
      {
        headerName: 'Datetime',
        field: 'date',
        width: 220,
        valueFormatter: this.dateFormatter
      },
      {
        headerName: 'Total',
        field: 'total',
        type: 'numericColumn',
        width: 120,
        valueFormatter: this.thousandFormatter
      },
      {
        headerName: 'Tips',
        field: 'tips',
        type: 'numericColumn',
        width: 100
      }
    ];
  }

  thousandFormatter(params){
    return Number(params.value).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }

  dateFormatter(params){
    return params.value !== '' ? new Date(params.value).toLocaleString('en-US', {hour12: false}) : '';
  }

  updateGridOptions(){
    this.gridOptions = <GridOptions>{
      rowData: [],
      onGridReady: () => {
        if(this.cashService.systemConfig.companyType !== CompanyType.RESTAURANT) {
          this.showTip(false);
        }
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
      rowHeight: 50,
      rowStyle: {'font-size': '16px'}
    };
    this.createColumnDefs();
  }

  private setData() {
    console.log('setData', this.sales);
    let salesTotal = 0;
    let tipsTotal = 0;
    this.sales.forEach((v, i) => {
      this.sales[i].total = (v.total).toFixed(2);
      salesTotal += +this.sales[i].total;
      this.sales[i]['tips']= (v.tips ? v.tips : 0.00).toFixed(2);
      tipsTotal += +this.sales[i]['tips'];
    });
    this.bottomData[0].total = +salesTotal.toFixed(2);
    this.bottomData[0].tips = +tipsTotal.toFixed(2);
    this.gridOptions.api.setRowData(this.sales);
    this.gridOptions.api.sizeColumnsToFit();
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

  showTip(show: boolean) {
    this.gridOptions.columnApi.setColumnVisible('tips', show);
    this.gridOptions.api.sizeColumnsToFit();

    //this.gridOptions.columnApi.setColumnVisible('tips', show);
    //this.gridOptions.api.sizeColumnsToFit();
    //this.gridOptions.alignedGrids.push(this.gridOptions);
  }
}

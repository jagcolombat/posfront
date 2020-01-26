import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
  emplSel: any;
  public gridOptions: GridOptions;
  private gridApi: GridApi;
  columnDefs: any;

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
        width: 200
      },
      {
        headerName: 'Total',
        field: 'total',
        type: 'numericColumn',
        width: 120
      },
      {
        headerName: 'Tips',
        field: 'tips',
        type: 'numericColumn',
        width: 120
      }
    ];
  }

  updateGridOptions(){
    this.gridOptions = <GridOptions>{
      rowData: [],
      onGridReady: () => {
        if(this.cashService.systemConfig.companyType === CompanyType.MARKET) {
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
      rowHeight: 60,
      rowStyle: {'font-size': '16px'}
    };
    this.createColumnDefs();
  }

  private setData() {
    console.log('setData', this.sales);
    this.sales.forEach((v, i) => {
      this.sales[i].total = (v.total).toFixed(2);
      this.sales[i]['tips']= (v.tips ? v.tips : 0.00).toFixed(2);
    });
    this.gridOptions.api.setRowData(this.sales);
    this.gridOptions.api.sizeColumnsToFit();
  }

  onPrint() {
    console.log('Print invoices by user', this.emplSel);
    if(this.emplSel){
      this.dataStorage.printInvoiceByUser(this.emplSel).subscribe(next => {
        console.log(next);
      }, error1 => {
        console.error('getSales', error1);
      });
    } else {
      console.log('Debe seleccionar un empleado');
    }

  }

  showTip(show: boolean) {
    this.gridOptions.columnApi.setColumnVisible('tips', show);
    this.gridOptions.api.sizeColumnsToFit();
  }
}

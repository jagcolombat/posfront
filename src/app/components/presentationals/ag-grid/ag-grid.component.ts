import {Component, EventEmitter, OnInit, Output, OnDestroy, Input, SimpleChanges, OnChanges} from '@angular/core';
import { GridOptions, GridApi, ColDef } from 'ag-grid-community';
import { InvoiceService } from '../../../services/bussiness-logic/invoice.service';
import { ProductOrder } from '../../../models/product-order.model';
import { Subscription } from 'rxjs';
import { CustomHeaderComponent } from './custom-header.component';
import { CustomNameupcCellComponent } from './custom-nameupc-cell.component';
import { CashService } from '../../../services/bussiness-logic/cash.service';
import {InvoiceStatus} from '../../../utils/invoice-status.enum';
import { error } from 'protractor';
import { InformationType } from 'src/app/utils/information-type.enum';

@Component({
  selector: 'ag-grid',
  templateUrl: './ag-grid.component.html',
  styleUrls: ['./ag-grid.component.scss']
})
export class AgGridComponent implements OnInit, /*OnChanges,*/ OnDestroy {
  @Output() updateData = new EventEmitter<boolean>();
  // @Input() products: ProductOrder[];
  @Input() frameworkComponents: any;
  public gridOptions: GridOptions;
  private gridApi: GridApi;
  public context: any;
  private subscriptions: Subscription[] = [];
  public selectableProd = true;
  columnDefs: any;

  constructor(private invoiceService: InvoiceService, private cashService: CashService) {
    this.updateGridOptions();
    this.context = { componentParent: this };
    this.frameworkComponents = {
      nameUpcRenderer: CustomNameupcCellComponent
    };
    // this.subscriptions.push(this.invoiceService.evAddProd.subscribe(po => this.onAddRow(po)));
    this.subscriptions.push(this.invoiceService.evDelAllProds.subscribe(ev => this.clearData()));
    this.subscriptions.push(this.invoiceService.evDelProd.subscribe(ev => this.onRemoveSelected(ev)));
    this.subscriptions.push(this.invoiceService.evUpdateProds.subscribe(ev => this.updateItems(ev)));
    this.subscriptions.push(this.invoiceService.evAddProd.subscribe(ev => this.onAddRow(ev)));
    this.subscriptions.push(this.cashService.evReviewEnableState.subscribe(ev => this.updateSelectable(ev)));
  }

  /*ngOnChanges(sc: SimpleChanges){
    console.log('onchanges ag-grid', sc);
    if(sc['products']){
      console.log('onchanges ag-grid products', sc['products'].currentValue);
      /!*let po = sc['products'].map(p => console.log(p))*!/
      this.updateItems(<ProductOrder[]>sc['products'].currentValue);
    }
  }*/

  ngOnInit() {
    // this.gridApi = this.gridOptions.api;
  }

  onGridReady(params) {
    this.gridApi = params.api;
  }

  private createColumnDefs() {
    this.columnDefs = [
      {
        field: 'number_item',
        headerCheckboxSelection: this.selectableProd,
        checkboxSelection: this.selectableProd,
        width: 300,
        cellRendererFramework: CustomNameupcCellComponent,
        headerComponentFramework: CustomHeaderComponent,
        headerComponentParams: { displayName: 'Product' }
      }/*,
      {
        headerComponentFramework: CustomHeaderComponent,
        headerComponentParams: { displayName: 'Name' },
        field: 'name',
        width: 155
      }*/,
      {
        headerComponentFramework: CustomHeaderComponent,
        headerComponentParams: { displayName: 'Price' },
        field: 'unitCost',
        type: 'numericColumn',
        width: 95
      },
      {
        headerComponentFramework: CustomHeaderComponent,
        headerComponentParams: { displayName: 'Quantity' },
        field: 'quantity',
        type: 'numericColumn',
        width: 95
      },
      {
        headerComponentFramework: CustomHeaderComponent,
        headerComponentParams: { displayName: 'Discount' },
        field: 'discount',
        type: 'numericColumn',
        width: 95
      },
      {
        headerComponentFramework: CustomHeaderComponent,
        headerComponentParams: { displayName: 'Amount' },
        field: 'total',
        type: 'numericColumn',
        width: 95
      }
    ];
  }

  getRowData() {
    const rowData = [];
    this.gridOptions.api.forEachNode(function(node) {
      rowData.push(node.data);
    });
    console.log('Row Data:', rowData);
    return rowData;
  }

  clearData() {
    this.gridOptions.api.setRowData([]);
    // this.showDiscount(false);
    this.invoiceService.setTotal();
    this.updateData.emit(true);
  }

  onAddRow(data: ProductOrder) {
    const allowFoodStampMark = this.cashService.config.sysConfig ? this.cashService.config.sysConfig.allowFoodStampMark : true;

    const formatNumber = (number) => Number.isInteger(number) ? number : Number(number).toFixed(2);
    const newData = {
      id: data.id,
      number_item: data.productUpc + ':' + data.productName,
      name: data.productName,
      unitCost: Number(data.unitCost).toFixed(2),
      quantity: formatNumber(data.quantity),
      total: Number(data.subTotal).toFixed(2),
      tax: Number(data.tax).toFixed(2),
      isRefund: data.isRefund,
      isFoodStamp: data.foodStamp && allowFoodStampMark,
      discount: formatNumber(data.discount),
      productId: data.productId
    };
    console.log('onAddRow', newData, this.gridOptions.api.getDisplayedRowCount());
    // (newData.discount !== undefined) ? this.showDiscount(true) : this.showDiscount(false);
    const res = this.gridOptions.api.updateRowData({ add: [newData] });
    this.gridOptions.api.ensureIndexVisible(this.gridOptions.api.getDisplayedRowCount() - 1);
    this.updateData.emit(true);
  }

  updateItems(arrPO: ProductOrder[]) {
    this.clearData();
    arrPO.map(data => {
      console.log('updateItems', data);
      this.onAddRow(data);
    });
  }

  onRemoveSelected(ev?: any) {
    const selectedData = this.gridOptions.api.getSelectedRows();
    console.log('items to remove', selectedData, 'token', ev);
    if (selectedData.length > 0 && this.selectableProd) {
      console.log('remove selected');
      const dialog = this.cashService.openGenericInfo(InformationType.INFO, 'Removing products...');

      this.invoiceService.delPOFromInvoice(selectedData, ev ? this.invoiceService.cashier: '')
        .subscribe(data => {
            console.log('delPOFromInvoice', data);
            dialog.close();
            if(ev) {
              /* this.cashService.authServ.logout(true).subscribe(
                next => {
                  console.log('Set token after logout', ev, 'previousToken', this.cashService.authServ.token);
                  this.cashService.authServ.token = ev;
                }, error => {
                  this.cashService.evLogout.emit(true);
                }
              ) */
              this.cashService.authServ.token = this.cashService.authServ.decodeToken(data.token);
            }
            if (data.status === InvoiceStatus.PAID) {
              this.invoiceService.warnInvoicePaid();
            } else {
              console.log('Set invoice after delete items');
              this.invoiceService.setInvoice(data);
              this.invoiceService.invoiceProductSelected.splice(0);
              this.invoiceService.setTotal();
              const res = this.gridOptions.api.updateRowData({ remove: selectedData });
            }

          },
          err => {
            console.log(err);
            dialog.close();
            if(ev) this.cashService.authServ.token = ev;
            this.cashService.openGenericInfo('Error', err);
          });

      // printResult(res);
      // this.invoiceService.setTotal();
      this.updateData.emit(true);
      // this.deleteOnInvoice();
    } else {
      if(ev) this.cashService.authServ.token = ev;
    }
    
  }

  deleteOnInvoice() {
    // console.log('before', this.invoiceService.invoice.productsOrders);
    this.invoiceService.invoice.productOrders = <ProductOrder[]>[...this.getRowData()];
    // console.log('later', this.invoiceService.invoice.productsOrders);
  }

  selectOrDeselectAll() {
    if (this.selectableProd) {
      if (this.gridOptions.api.getSelectedNodes().length !== this.gridOptions.api.getDisplayedRowCount()) {
        this.gridOptions.api.selectAll();
      } else {
        this.gridOptions.api.deselectAll();
      }
    }
  }

  updateGridOptions() {
    this.gridOptions = <GridOptions>{
      rowData: [],
      rowSelection: 'multiple',
      rowClassRules: {
        'refund-prod': 'data.isRefund === true',
        'foodstamp-prod': 'data.isFoodStamp === true'
      },
      onGridReady: () => {
        this.gridOptions.api.sizeColumnsToFit();
        // this.showDiscount(false);
      },
      onRowSelected: (ev) => {
          this.invoiceService.invoiceProductSelected = this.gridOptions.api.getSelectedRows();
      },
      onRowClicked: (ev) => {
        this.invoiceService.invoiceProductSelected = this.gridOptions.api.getSelectedRows();
      },
      onBodyScroll: (ev) => {
        this.gridOptions.api.sizeColumnsToFit();
      },
      onGridColumnsChanged: () => {
        this.gridOptions.api.sizeColumnsToFit();
      },
      rowHeight: 60,
      rowStyle: {'font-size': '16px'}
    };
    this.createColumnDefs();
  }

  private updateSelectable(ev) {
    console.log('updateSelectable', !ev);
    this.selectableProd = !ev;
    this.createColumnDefs();
    this.gridOptions.api.sizeColumnsToFit();
  }

  showDiscount(show: boolean) {
    this.gridOptions.columnApi.setColumnVisible('discount', show);
    this.gridOptions.api.sizeColumnsToFit();
    /*this.gridOptions.api.refreshCells();
    this.gridOptions.api.redrawRows();
    this.gridApi.refreshView();
    this.gridApi.doLayout();*/
  }

  ngOnDestroy() {
    this.subscriptions.map(sub => sub.unsubscribe());
  }

  private addItem(ev: any) {

  }
}

import {Component, EventEmitter, OnInit, Output, OnDestroy, Input} from '@angular/core';
import { GridOptions, GridApi } from 'ag-grid-community';
import { InvoiceService } from "../../../services/bussiness-logic/invoice.service";
import { ProductOrder } from "../../../models/product-order.model";
import { Subscription } from "rxjs";
import { CustomHeaderComponent } from "./custom-header.component";
import {CashService} from "../../../services/bussiness-logic/cash.service";

@Component({
  selector: 'ag-grid',
  templateUrl: './ag-grid.component.html',
  styleUrls: ['./ag-grid.component.scss']
})
export class AgGridComponent implements OnInit, OnDestroy {
  @Output() updateData = new EventEmitter<boolean>();
  public gridOptions: GridOptions;
  private gridApi: GridApi;
  public context: any;
  private subscriptions: Subscription[] = [];
  public selectableProd = true;
  columnDefs: any;

  constructor(private invoiceService: InvoiceService, private cashService: CashService) {
    this.updateGridOptions();
    this.context = { componentParent: this };
    // this.subscriptions.push(this.invoiceService.evAddProd.subscribe(po => this.onAddRow(po)));
    this.subscriptions.push(this.invoiceService.evDelAllProds.subscribe(ev => this.clearData()));
    this.subscriptions.push(this.invoiceService.evDelProd.subscribe(ev => this.onRemoveSelected()));
    this.subscriptions.push(this.invoiceService.evUpdateProds.subscribe(ev => this.updateItems(ev)));
    this.subscriptions.push(this.cashService.evReviewEnableState.subscribe(ev => this.updateSelectable(ev)));
  }

  ngOnInit() {
    this.gridApi = this.gridOptions.api;
  }

  private createColumnDefs() {
    this.columnDefs = [
      {
        field: 'number_item',
        headerCheckboxSelection: this.selectableProd,
        checkboxSelection: this.selectableProd,
        width: 170,
        headerComponentFramework: CustomHeaderComponent,
        headerComponentParams: { displayName: 'Number Item' }
      },
      {
        headerComponentFramework: CustomHeaderComponent,
        headerComponentParams: { displayName: 'Name' },
        field: 'name',
        width: 180
      },
      {
        headerComponentFramework: CustomHeaderComponent,
        headerComponentParams: { displayName: 'Price' },
        field: 'unitCost',
        type: 'numericColumn',
        width: 90
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
        headerComponentParams: { displayName: 'Amount' },
        field: 'total',
        type: 'numericColumn'
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
    this.invoiceService.setTotal();
    this.updateData.emit(true);
  }

  onAddRow(data: ProductOrder) {
    const newData = {
      id: data.id,
      number_item: data.productUpc,
      name: data.productName,
      unitCost: Number(data.unitCost).toFixed(2),
      quantity: data.quantity,
      total: Number(data.subTotal).toFixed(2),
      tax: Number(data.tax).toFixed(2),
      isRefund: data.isRefund,
      // product: data.product
    };
    console.log('onAddRow', this.gridOptions.api.getDisplayedRowCount());
    const res = this.gridOptions.api.updateRowData({ add: [newData] });
    this.gridOptions.api.ensureIndexVisible(this.gridOptions.api.getDisplayedRowCount()-1);
    this.updateData.emit(true);
  }

  updateItems(arrPO: ProductOrder[]) {
    this.clearData();
    arrPO.map(data => {
      console.log('updateItems', data);
      this.onAddRow(data);
    });
  }

  onRemoveSelected() {
    const selectedData = this.gridOptions.api.getSelectedRows();
    console.log('selectedData', selectedData);
    if(selectedData.length > 0 && this.selectableProd){
      console.log('remove selected');
      this.invoiceService.delPOFromInvoice(selectedData);
      const res = this.gridOptions.api.updateRowData({ remove: selectedData });
      // printResult(res);
      this.invoiceService.setTotal();
      this.updateData.emit(true);
      this.deleteOnInvoice();
    }
  }

  deleteOnInvoice(){
    // console.log('before', this.invoiceService.invoice.productsOrders);
    this.invoiceService.invoice.productOrders = <ProductOrder[]>[...this.getRowData()];
    // console.log('later', this.invoiceService.invoice.productsOrders);
  }

  selectOrDeselectAll() {
    if(this.selectableProd){
      if (this.gridOptions.api.getSelectedNodes().length !== this.gridOptions.api.getDisplayedRowCount()) {
        this.gridOptions.api.selectAll();
      } else {
        this.gridOptions.api.deselectAll();
      }
    }
  }

  updateGridOptions(){
    this.gridOptions = <GridOptions>{
      rowData: [],
      rowSelection: 'multiple',
      rowClassRules: { 'refund-prod': 'data.isRefund === true' },
      onGridReady: () => {
        this.gridOptions.api.sizeColumnsToFit();
      },
      onRowSelected: (ev) => {
          this.invoiceService.invoiceProductSelected = this.gridOptions.api.getSelectedRows().length > 0;
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

  ngOnDestroy() {
    this.subscriptions.map(sub => sub.unsubscribe());
  }
}

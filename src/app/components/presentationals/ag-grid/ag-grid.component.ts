import { Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { GridOptions, GridApi } from 'ag-grid-community';
import { InvoiceService } from "../../../services/bussiness-logic/invoice.service";
import { ProductOrder } from "../../../models/product-order.model";
import { Subscription } from "rxjs";

@Component({
  selector: 'ag-grid',
  templateUrl: './ag-grid.component.html',
  styleUrls: ['./ag-grid.component.scss']
})
export class AgGridComponent implements OnInit, OnDestroy {
  @Output() updateData = new EventEmitter<boolean>();
  public gridOptions: GridOptions;
  private gridApi: GridApi;
  private subscriptions: Subscription[] = [];

  constructor(private invoiceService: InvoiceService) {
    this.gridOptions = <GridOptions>{
      rowData: [],
      rowSelection: 'multiple',
      columnDefs: this.createColumnDefs(),
      onGridReady: () => {
        this.gridOptions.api.sizeColumnsToFit();
      },
      onRowSelected: (ev) => {
        this.invoiceService.invoiceProductSelected = this.gridOptions.api.getSelectedRows().length > 0;
      },
      rowHeight: 42
    };
    this.subscriptions.push(this.invoiceService.evAddProd.subscribe(po => this.onAddRow(po)));
    this.subscriptions.push(this.invoiceService.evDelAllProds.subscribe(ev => this.clearData()));
    this.subscriptions.push(this.invoiceService.evDelProd.subscribe(ev => this.onRemoveSelected()));
    this.subscriptions.push(this.invoiceService.evUpdateProds.subscribe(ev => this.updateItems(ev)));
  }

  ngOnInit() {
    this.gridApi = this.gridOptions.api;
  }

  private createColumnDefs() {
    return [
      {
        headerName: 'Number Item',
        field: 'number_item',
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
        width: 150
      },
      {
        headerName: 'Name',
        field: 'name',
        width: 210
      },
      {
        headerName: 'Price',
        field: 'unitCost',
        width: 90
      },
      {
        headerName: 'Quantity',
        field: 'quantity',
        width: 95
      },
      {
        headerName: 'Amount',
        field: 'total',
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
    this.invoiceService.setTotal();
    this.updateData.emit(true);
  }

  onAddRow(data: ProductOrder) {
    const newData = {
      id: data.id,
      number_item: data.product.upc,
      name: data.product.name,
      unitCost: data.unitCost,
      quantity: data.quantity,
      total: data.total,
      tax: data.tax,
      product: data.product
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
    this.invoiceService.delPOFromInvoice(selectedData);
    const res = this.gridOptions.api.updateRowData({ remove: selectedData });
    // printResult(res);
    this.invoiceService.setTotal();
    this.updateData.emit(true);
    this.deleteOnInvoice();
  }

  deleteOnInvoice(){
    // console.log('before', this.invoiceService.invoice.productsOrders);
    this.invoiceService.invoice.productsOrders = <ProductOrder[]>[...this.getRowData()];
    // console.log('later', this.invoiceService.invoice.productsOrders);
  }

  ngOnDestroy() {
    this.subscriptions.map(sub => sub.unsubscribe());
  }

}

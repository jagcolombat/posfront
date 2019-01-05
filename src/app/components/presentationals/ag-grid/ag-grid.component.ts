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
      rowHeight: 42
    };
    this.subscriptions.push(this.invoiceService.evAddProd.subscribe(po => this.onAddRow(po)));
    this.subscriptions.push(this.invoiceService.evDelAllProds.subscribe(ev => this.clearData()));
    this.subscriptions.push(this.invoiceService.evDelProd.subscribe(ev => this.onRemoveSelected()));
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
        headerName: 'Description',
        field: 'description',
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
    this.updateData.emit(true);
  }

  onAddRow(data: ProductOrder) {
    const newData = {
      number_item: data.product.upc,
      description: data.product.description,
      unitCost: data.unitCost,
      quantity: data.quantity,
      total: data.total,
      tax: data.tax,
      product: data.product
    };
    //console.log('createNewRowData', newData);
    const res = this.gridOptions.api.updateRowData({ add: [newData] });
    // printResult(res);
    // this.getRowData();
    this.updateData.emit(true);
  }

  updateItems() {
    const itemsToUpdate = [];
    this.gridApi.forEachNodeAfterFilterAndSort(function(rowNode, index) {
      if (index >= 5) {
        return;
      }
      const data = rowNode.data;
      data.price = Math.floor(Math.random() * 20000 + 20000);
      itemsToUpdate.push(data);
    });
    const res = this.gridApi.updateRowData({ update: itemsToUpdate });
    // printResult(res);
    this.updateData.emit(true);
  }

  onRemoveSelected() {
    const selectedData = this.gridOptions.api.getSelectedRows();
    const res = this.gridOptions.api.updateRowData({ remove: selectedData });
    // printResult(res);
    this.updateData.emit(true);
    this.deleteOnInvoice();
  }

  deleteOnInvoice(){
    console.log('before', this.invoiceService.invoice.productsOrders);
    // this.invoiceService.invoice.productsOrders.length = 0;
    // Object.assign(this.invoiceService.invoice.productsOrders, this.getRowData());
    this.invoiceService.invoice.productsOrders = <ProductOrder[]>[...this.getRowData()];
    console.log('later', this.invoiceService.invoice.productsOrders);
  }

  ngOnDestroy() {
    this.subscriptions.map(sub => sub.unsubscribe());
  }

}

import { Component, OnInit } from '@angular/core';
import { GridOptions, GridApi } from 'ag-grid-community';
import { InvoiceService } from "../../../services/bussiness-logic/invoice.service";
import { ProductOrder } from "../../../models/product-order.model";

@Component({
  selector: 'ag-grid',
  templateUrl: './ag-grid.component.html',
  styleUrls: ['./ag-grid.component.css']
})
export class AgGridComponent implements OnInit {
  public gridOptions: GridOptions;
  private gridApi: GridApi;

  constructor(private invoiceService: InvoiceService) {
    this.gridOptions = <GridOptions>{
      rowSelection: 'multiple',
      columnDefs: this.createColumnDefs(),
      onGridReady: () => {
        this.gridOptions.api.sizeColumnsToFit();
      },
      rowHeight: 42
    };
    this.invoiceService.evAddProd.subscribe(po => this.onAddRow(po));
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
        field: 'price',
        width: 90
      },
      {
        headerName: 'Quantity',
        field: 'quantity',
        width: 95
      },
      {
        headerName: 'Amount',
        field: 'amount',
        width: 95
      }
    ];
  }

  removeItem(start?: number, limit?: number) {
    // this.gridOptions.rowData.splice(start, limit);
    console.log('remove', this.gridOptions.rowData, this.gridOptions.rowSelection);
    this.gridApi.refreshInfiniteCache();
  }

  getRowData() {
    const rowData = [];
    this.gridApi.forEachNode(function(node) {
      rowData.push(node.data);
    });
    console.log('Row Data:', rowData);
  }

  clearData() {
    this.gridOptions.api.setRowData([]);
  }

  onAddRow(data: ProductOrder) {
    const newData = {
      number_item: data.product.upc,
      description: data.product.description,
      price: data.unitCost,
      quantity: data.quantity,
      amount: data.total
    };
    //console.log('createNewRowData', newData);
    const res = this.gridOptions.api.updateRowData({ add: [newData] });
    // printResult(res);
    this.gridOptions.api.sizeColumnsToFit();
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
  }

  onRemoveSelected() {
    const selectedData = this.gridOptions.api.getSelectedRows();
    const res = this.gridOptions.api.updateRowData({ remove: selectedData });
    // printResult(res);
  }

}

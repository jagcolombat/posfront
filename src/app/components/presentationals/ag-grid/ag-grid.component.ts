import { Component, OnInit } from '@angular/core';
import { GridOptions, GridApi } from 'ag-grid-community';

@Component({
  selector: 'ag-grid',
  templateUrl: './ag-grid.component.html',
  styleUrls: ['./ag-grid.component.css']
})
export class AgGridComponent implements OnInit {
  public gridOptions: GridOptions;
  private gridApi: GridApi;
  private newCount = 1;

  constructor() {
    this.gridOptions = <GridOptions>{
      rowData: this.createRowData(),
      rowSelection: 'multiple',
      columnDefs: this.createColumnDefs(),
      onGridReady: () => {
        this.gridOptions.api.sizeColumnsToFit();
      },
      rowHeight: 48
    };
  }

  ngOnInit() {
    this.gridApi = this.gridOptions.api;
  }

  private createColumnDefs() {
    return [
      {
        headerName: 'Full Name (popup input editor)',
        field: 'full_name',
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true
      },
      {
        headerName: 'Fruit (popup radio editor)',
        field: 'fruit'
      },
      {
        headerName: 'Vegetables (popup select editor)',
        field: 'vegetable'
      }
    ];
  }

  private createRowData() {
    return [
      {
        full_name: 'Sean Landsman',
        fruit: 'Apple',
        vegetable: 'Carrot',
        percentage: 5
      },
      {
        full_name: 'Niall Crosby',
        fruit: 'Apple',
        vegetable: 'Potato',
        percentage: 35
      },
      {
        full_name: 'Alberto Guiterzzz',
        fruit: 'Orange',
        vegetable: 'Broccoli',
        percentage: 78
      },
      {
        full_name: 'John Masterson',
        fruit: 'Banana',
        vegetable: 'Potato',
        percentage: 98
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
    console.log('Row Data:');
    console.log(rowData);
  }

  clearData() {
    this.gridOptions.api.setRowData([]);
  }

  onAddRow() {
    const newItem = this.createNewRowData();
    const res = this.gridOptions.api.updateRowData({ add: [newItem] });
    // printResult(res);
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

  createNewRowData() {
    const newData = {
      full_name: 'Pepe',
      fruit: 'Uva',
      on_off: 'Off',
      vegetable: 'Tomato',
      percentage: 60
    };
    this.newCount++;
    return newData;
  }

}

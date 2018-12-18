import { NgModule } from '@angular/core';
import { SharedModule } from "../shared/shared.module";
import { RouterModule, Routes } from "@angular/router";
/*import { AgGridModule } from "ag-grid-angular";*/
import { AgGridComponent } from '../../components/presentationals/ag-grid/ag-grid.component';
import { CashViewComponent } from "../../components/containers/cash-view/cash-view.component";
import { OperationsComponent } from "../../components/containers/operations/operations.component";
import { StockComponent } from "../../components/containers/stock/stock.component";
import { InvoiceComponent } from "../../components/containers/invoice/invoice.component";
import { OperationGroupComponent } from '../../components/presentationals/operation-group/operation-group.component';
import { NumpadComponent } from '../../components/presentationals/numpad/numpad.component';

const routes: Routes = [
  { path: '',  component: CashViewComponent}
];

@NgModule({
  imports: [
    SharedModule,
    // AgGridModule.withComponents([null]),
    RouterModule.forChild(routes)
  ],
  declarations: [
    CashViewComponent,
    InvoiceComponent,
    StockComponent,
    OperationsComponent,
    OperationGroupComponent,
    NumpadComponent,
    AgGridComponent
  ]
})
export class CashModule { }

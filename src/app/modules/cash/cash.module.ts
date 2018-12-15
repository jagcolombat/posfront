import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {CashViewComponent} from "../../components/containers/cash-view/cash-view.component";
import {SharedModule} from "../shared/shared.module";
import {OperationsComponent} from "../../components/containers/operations/operations.component";
import {StockComponent} from "../../components/containers/stock/stock.component";
import {InvoiceComponent} from "../../components/containers/invoice/invoice.component";
const routes: Routes = [
  { path: '',  component: CashViewComponent}
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    CashViewComponent,
    InvoiceComponent,
    StockComponent,
    OperationsComponent,
  ]
})
export class CashModule { }

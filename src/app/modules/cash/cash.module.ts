import { NgModule } from '@angular/core';
import { SharedModule } from "../shared/shared.module";
import { RouterModule, Routes } from "@angular/router";
import { MaterialModule } from "../../modules/material/material.module";
import { NgxPaginationModule } from "ngx-pagination";

import { AgGridComponent } from '../../components/presentationals/ag-grid/ag-grid.component';
import { CashViewComponent } from "../../components/containers/cash-view/cash-view.component";
import { OperationsComponent } from "../../components/containers/operations/operations.component";
import { StockComponent } from "../../components/containers/stock/stock.component";
import { InvoiceComponent } from "../../components/containers/invoice/invoice.component";
import { OperationGroupComponent } from '../../components/presentationals/operation-group/operation-group.component';
import { NumpadComponent } from '../../components/presentationals/numpad/numpad.component';
import { InfoPosComponent } from '../../components/presentationals/info-pos/info-pos.component';
import { InputCalculatorComponent } from "../../components/presentationals/input-calculator/input-calculator.component";
import { ListDptoComponent } from "../../components/presentationals/list-dpto/list-dpto.component";
import {ListProdComponent} from "../../components/presentationals/list-prod/list-prod.component";
import {AdminOptionsComponent} from "../../components/presentationals/admin-options/admin-options.component";
import { PaginatorComponent } from '../../components/presentationals/paginator/paginator.component';

const routes: Routes = [
  { path: '',  component: CashViewComponent,
    children: [
      { path: '', redirectTo: 'dptos', pathMatch: 'full' },
      { path: 'options', component: AdminOptionsComponent },
      { path: 'dptos', component: ListDptoComponent },
      { path: 'products', component: ListProdComponent },
      { path: 'products/:dpto/:tax', component: ListProdComponent },
      { path: 'filteredproducts/:filter', component: ListProdComponent },
    ]   }
];

@NgModule({
  imports: [
    SharedModule,
    MaterialModule,
    NgxPaginationModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    CashViewComponent,
    InvoiceComponent,
    StockComponent,
    OperationsComponent,
    AgGridComponent,
    InfoPosComponent,
    InputCalculatorComponent,
    ListDptoComponent,
    ListProdComponent,
    AdminOptionsComponent,
    PaginatorComponent
  ],
  entryComponents: []
})
export class CashModule { }

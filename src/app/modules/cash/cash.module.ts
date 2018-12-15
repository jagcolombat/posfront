import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {CashViewComponent} from "../../components/containers/cash-view/cash-view.component";

const routes: Routes = [
  { path: '',  component: CashViewComponent}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CashViewComponent]
})
export class CashModule { }

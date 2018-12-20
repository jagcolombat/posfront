import { Routes } from '@angular/router';

import {ListProdComponent} from "../../components/presentationals/list-prod/list-prod.component";
import {ListDptoComponent} from "../../components/presentationals/list-dpto/list-dpto.component";
import {InitViewComponent} from "../../components/containers/init-view/init-view.component";
import {AuthGuard} from "../../services/guards/auth.guard";

export const routes: Routes = [
  { path: 'init',     component: InitViewComponent },
  { path: 'cash',  loadChildren: '../cash/cash.module#CashModule', canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dptos', pathMatch: 'full' },
      { path: 'dptos', component: ListDptoComponent },
      { path: 'products', component: ListProdComponent },
      { path: 'products/:dpto/:tax', component: ListProdComponent },
    ],  },
  { path: '', redirectTo: '/init', pathMatch: 'full' }
];

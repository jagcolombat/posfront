import { Routes } from '@angular/router';

import {InitViewComponent} from "../../components/containers/init-view/init-view.component";
import {AuthGuard} from "../../services/guards/auth.guard";

export const routes: Routes = [
  { path: 'init',     component: InitViewComponent },
  { path: 'cash',  loadChildren: '../cash/cash.module#CashModule', canActivate: [AuthGuard] },
  { path: '', redirectTo: '/init', pathMatch: 'full' }
];

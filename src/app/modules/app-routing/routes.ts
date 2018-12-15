import { Routes } from '@angular/router';

/*import { HomeComponent } from '../components/home/home.component';
import {ListProdComponent} from "../components/list-prod/list-prod.component";
import {ListDptoComponent} from "../components/list-dpto/list-dpto.component";
import {GeneralLoginComponent} from "../components/general-login/general-login.component";*/
import {InitViewComponent} from "../../components/containers/init-view/init-view.component";

export const routes: Routes = [
  { path: 'init',     component: InitViewComponent },
  { path: 'cash',  loadChildren: '../cash/cash.module#CashModule'  },
  { path: '', redirectTo: '/init', pathMatch: 'full' }
];

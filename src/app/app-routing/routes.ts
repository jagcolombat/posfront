import { Routes } from '@angular/router';

import { HomeComponent } from '../components/home/home.component';
import {ListProdComponent} from "../components/list-prod/list-prod.component";
import {ListDptoComponent} from "../components/list-dpto/list-dpto.component";
import {GeneralLoginComponent} from "../components/general-login/general-login.component";

export const routes: Routes = [
  { path: 'home',  component: HomeComponent,
    children: [
      { path: '', redirectTo: 'dptos', pathMatch: 'full' },
      { path: 'dptos', component: ListDptoComponent },
      { path: 'products', component: ListProdComponent },
      { path: 'products/:dpto/:tax', component: ListProdComponent },
    ]
  },
  { path: 'login',     component: GeneralLoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

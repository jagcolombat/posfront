import { Routes } from '@angular/router';

import { HomeComponent } from '../components/home/home.component';
import { LoginComponent } from '../components/login/login.component';
import {ListProdComponent} from "../components/list-prod/list-prod.component";
import {ListDptoComponent} from "../components/list-dpto/list-dpto.component";

export const routes: Routes = [
  { path: 'home',  component: HomeComponent,
    children: [
      { path: '', redirectTo: 'dptos', pathMatch: 'full' },
      { path: 'dptos', component: ListDptoComponent },
      { path: 'products', component: ListProdComponent },
      { path: 'products/:dpto/:tax', component: ListProdComponent },
    ]
  },
  { path: 'login',     component: LoginComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

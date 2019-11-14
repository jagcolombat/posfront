import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ClientViewComponent} from "../../components/containers/client-view/client-view.component";
import {RouterModule, Routes} from "@angular/router";
import {SharedModule} from "../shared/shared.module";

const routes: Routes = [
  { path: '',  component: ClientViewComponent}
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    ClientViewComponent
  ],
  exports: [ ClientViewComponent ]
})
export class ClientModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalculatorComponent } from "../../components/presentationals/calculator/calculator.component";
import { GenericKeyboardComponent } from "../../components/presentationals/generic-keyboard/generic-keyboard.component";
import { MaterialModule } from "../material/material.module";
import { AgGridModule } from 'ag-grid-angular';
import { NgxPaginationModule } from "ngx-pagination";
import {NumpadComponent} from "../../components/presentationals/numpad/numpad.component";
import {OperationGroupComponent} from "../../components/presentationals/operation-group/operation-group.component";
import {AdminConfigComponent} from "../../components/presentationals/admin-config/admin-config.component";
import {FilterComponent} from "../../components/presentationals/filter/filter.component";
import {AdminOptionsComponent} from "../../components/presentationals/admin-options/admin-options.component";
import {PaginatorComponent} from "../../components/presentationals/paginator/paginator.component";
import {IConfig, NgxMaskModule} from "ngx-mask";
import {InvoiceComponent} from "../../components/containers/invoice/invoice.component";
import {AgGridComponent} from "../../components/presentationals/ag-grid/ag-grid.component";
import {InfoPosComponent} from "../../components/presentationals/info-pos/info-pos.component";
import {InputCalculatorComponent} from "../../components/presentationals/input-calculator/input-calculator.component";
import {LoginComponent} from "../../components/presentationals/login/login.component";
import {AnnounceComponent} from "../../components/presentationals/announce/announce.component";
import {PromotionsComponent} from "../../components/presentationals/promotions/promotions.component";
import {SlideshowModule} from "ng-simple-slideshow";

// export const options: Partial<IConfig>| (() => Partial<IConfig>);

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialModule,
    AgGridModule.withComponents([null]),
    NgxPaginationModule,
    NgxMaskModule.forRoot(),
    SlideshowModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialModule,
    AgGridModule,
    NgxPaginationModule,
    NgxMaskModule,
    SlideshowModule,
    GenericKeyboardComponent,
    CalculatorComponent,
    NumpadComponent,
    OperationGroupComponent,
    FilterComponent,
    PaginatorComponent,
    InvoiceComponent,
    AgGridComponent,
    InfoPosComponent,
    InputCalculatorComponent,
    AnnounceComponent,
    PromotionsComponent
  ],
  declarations: [CalculatorComponent,
    GenericKeyboardComponent,
    NumpadComponent,
    OperationGroupComponent,
    FilterComponent,
    PaginatorComponent,
    InvoiceComponent,
    AgGridComponent,
    InfoPosComponent,
    InputCalculatorComponent,
    AnnounceComponent,
    PromotionsComponent]
})
export class SharedModule { }

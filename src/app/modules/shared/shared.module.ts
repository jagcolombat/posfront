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
    NgxMaskModule.forRoot()
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
    GenericKeyboardComponent,
    CalculatorComponent,
    NumpadComponent,
    OperationGroupComponent,
    FilterComponent,
    PaginatorComponent
  ],
  declarations: [CalculatorComponent, GenericKeyboardComponent, NumpadComponent, OperationGroupComponent,
    FilterComponent,
    PaginatorComponent ]
})
export class SharedModule { }

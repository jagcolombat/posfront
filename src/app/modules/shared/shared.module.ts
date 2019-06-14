import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalculatorComponent } from "../../components/presentationals/calculator/calculator.component";
import { GenericKeyboardComponent } from "../../components/presentationals/generic-keyboard/generic-keyboard.component";
import { MaterialModule } from "../material/material.module";
import { AgGridModule } from 'ag-grid-angular';
import {NumpadComponent} from "../../components/presentationals/numpad/numpad.component";
import {OperationGroupComponent} from "../../components/presentationals/operation-group/operation-group.component";
import {AdminConfigComponent} from "../../components/presentationals/admin-config/admin-config.component";
import {FilterComponent} from "../../components/presentationals/filter/filter.component";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialModule,
    AgGridModule.withComponents([null]),
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialModule,
    AgGridModule,
    GenericKeyboardComponent,
    CalculatorComponent,
    NumpadComponent,
    OperationGroupComponent,
    FilterComponent
  ],
  declarations: [CalculatorComponent, GenericKeyboardComponent, NumpadComponent, OperationGroupComponent,
    FilterComponent ]
})
export class SharedModule { }

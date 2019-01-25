import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalculatorComponent } from "../../components/presentationals/calculator/calculator.component";
import { GenericKeyboardComponent } from "../../components/presentationals/generic-keyboard/generic-keyboard.component";
import {MaterialModule} from "../material/material.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialModule,
    GenericKeyboardComponent,
    CalculatorComponent
  ],
  declarations: [CalculatorComponent, GenericKeyboardComponent ]
})
export class SharedModule { }

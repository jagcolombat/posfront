import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {CalculatorComponent} from "../../components/presentationals/calculator/calculator.component";
import {GenericKeyboardComponent} from "../../components/presentationals/generic-keyboard/generic-keyboard.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    GenericKeyboardComponent,
    CalculatorComponent
  ],
  declarations: [CalculatorComponent, GenericKeyboardComponent ]
})
export class SharedModule { }

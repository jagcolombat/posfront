import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import {CalculatorComponent} from "../../components/presentationals/calculator/calculator.component";
@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule
  ],
  exports: [
    CommonModule,
    FlexLayoutModule,
    CalculatorComponent
  ],
  declarations: [CalculatorComponent]
})
export class SharedModule { }

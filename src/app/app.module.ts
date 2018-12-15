import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './modules/app-routing/app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { AuthInterceptor } from "./services/interceptors/auth.interceptor";

import { AppComponent } from './app.component';
import { InitViewComponent } from './components/containers/init-view/init-view.component';
import { LoginComponent } from "./components/presentationals/login/login.component";
import { GenericKeyboardComponent } from "./components/presentationals/generic-keyboard/generic-keyboard.component";
import { SharedModule } from "./modules/shared/shared.module";
/*
import { ShoppingCarComponent } from './components/shopping-car/shopping-car.component';
import { ListDptoComponent } from './components/list-dpto/list-dpto.component';
import { FinancialOpComponent } from './components/financial-op/financial-op.component';
import { PosProductsTableComponent } from './components/pos-products-table/pos-products-table.component';
import { InfoPosComponent } from './components/info-pos/info-pos.component';
import { ListProdComponent } from './components/list-prod/list-prod.component';
import { ToggleFullscreenDirective } from './directives/toggle-fullscreen.directive';
import { PaymentOpsComponent } from './components/payment-ops/payment-ops.component';
import { InputCalculatorComponent } from './components/input-calculator/input-calculator.component';
import { DialogInvoiceComponent } from "./components/dialog-invoice/dialog-invoice.component";
import { ProductGenericComponent } from './components/product-generic/product-generic.component';
import { GenericInfoModalComponent } from './components/generic-info-modal/generic-info-modal.component';
import { GeneralLoginComponent } from './components/general-login/general-login.component';
import { GenericKeyboardComponent } from './components/generic-keyboard/generic-keyboard.component';
import { CashOpComponent } from './components/cash-op/cash-op.component';
import { CashPaymentComponent } from './components/cash-payment/cash-payment.component';
import { AgeValidationComponent } from './components/age-validation/age-validation.component';
import { CashValidationDirective } from './directives/cash-validation.directive';*/

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    MatToolbarModule,
    MatListModule,
    MatGridListModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  declarations: [
    AppComponent,
    InitViewComponent,
    LoginComponent,
    GenericKeyboardComponent,
    /*
    ShoppingCarComponent,
    ListDptoComponent,
    FinancialOpComponent,
    PosProductsTableComponent,
    InfoPosComponent,
    ListProdComponent,
    ToggleFullscreenDirective,
    PaymentOpsComponent,
    InputCalculatorComponent,
    DialogInvoiceComponent,
    ProductGenericComponent,
    GenericInfoModalComponent,
    GeneralLoginComponent,
    GenericKeyboardComponent,
    CashOpComponent,
    CashPaymentComponent,
    AgeValidationComponent,
    CashValidationDirective*/
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  entryComponents: [
    /*DialogInvoiceComponent,
    ProductGenericComponent,
    GenericInfoModalComponent,
    LoginComponent,
    CashOpComponent,
    CashPaymentComponent,
    AgeValidationComponent*/],
  bootstrap: [AppComponent]
})
export class AppModule { }

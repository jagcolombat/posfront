import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CdkTableModule } from '@angular/cdk/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { AuthInterceptor } from "./services/connection/interceptors/auth.interceptor";

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { CalculatorComponent } from './components/calculator/calculator.component';
import { ShoppingCarComponent } from './components/shopping-car/shopping-car.component';
import { AppRoutingModule } from './app-routing/app-routing.module';
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
import { CashValidationDirective } from './directives/cash-validation.directive';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    HomeComponent,
    CalculatorComponent,
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
    CashValidationDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FlexLayoutModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    NgxDatatableModule,
    CdkTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatIconModule,
    MatToolbarModule,
    MatListModule,
    MatGridListModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true }],
  entryComponents: [
    DialogInvoiceComponent,
    ProductGenericComponent,
    GenericInfoModalComponent,
    LoginComponent,
    CashOpComponent,
    CashPaymentComponent,
    AgeValidationComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }

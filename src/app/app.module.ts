import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

// import { AppRoutingModule } from './modules/app-routing/app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { AuthInterceptor } from "./services/interceptors/auth.interceptor";
import { AppComponent } from './app.component';
// import { InitViewComponent } from './components/containers/init-view/init-view.component';
import { SharedModule } from "./modules/shared/shared.module";
import { MaterialModule } from "./modules/material/material.module";

import { ProductGenericComponent } from "./components/presentationals/product-generic/product-generic.component";
import { AgeValidationComponent } from "./components/presentationals/age-validation/age-validation.component";
import { GenericInfoModalComponent } from "./components/presentationals/generic-info-modal/generic-info-modal.component";
import { DialogLoginComponent } from './components/containers/dialog-login/dialog-login.component';
import { DialogInvoiceComponent } from "./components/presentationals/dialog-invoice/dialog-invoice.component";
import { CashPaymentComponent } from "./components/presentationals/cash-payment/cash-payment.component";
import { CashOpComponent } from "./components/presentationals/cash-op/cash-op.component";
import { HomeModule } from "./modules/home/home.module";

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    MaterialModule,
    HttpClientModule,
    HomeModule
  ],
  declarations: [
    AppComponent,
    AgeValidationComponent,
    GenericInfoModalComponent,
    ProductGenericComponent,
    DialogLoginComponent,
    CashOpComponent,
    CashPaymentComponent,
    DialogInvoiceComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

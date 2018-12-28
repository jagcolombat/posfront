import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './modules/app-routing/app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { AuthInterceptor } from "./services/interceptors/auth.interceptor";

import { AppComponent } from './app.component';
import { InitViewComponent } from './components/containers/init-view/init-view.component';
import { LoginComponent } from "./components/presentationals/login/login.component";
import { SharedModule } from "./modules/shared/shared.module";
import { MaterialModule } from "./modules/material/material.module";
import { ProductGenericComponent } from "./components/presentationals/product-generic/product-generic.component";
import { AgeValidationComponent } from "./components/presentationals/age-validation/age-validation.component";
import { GenericInfoModalComponent } from "./components/presentationals/generic-info-modal/generic-info-modal.component";
import { DialogLoginComponent } from './components/containers/dialog-login/dialog-login.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    MaterialModule,
    HttpClientModule
  ],
  declarations: [
    AppComponent,
    InitViewComponent,
    LoginComponent,
    AgeValidationComponent,
    GenericInfoModalComponent,
    ProductGenericComponent,
    DialogLoginComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  entryComponents: [
    ProductGenericComponent,
    GenericInfoModalComponent,
    AgeValidationComponent,
    DialogLoginComponent,
    /*CashOpComponent,
    CashPaymentComponent,
    DialogInvoiceComponent,*/
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

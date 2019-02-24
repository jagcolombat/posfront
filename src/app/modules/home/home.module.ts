import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { LoginComponent } from "../../components/presentationals/login/login.component";
import { AnnounceComponent } from "../../components/presentationals/announce/announce.component";
import { PromotionsComponent } from "../../components/presentationals/promotions/promotions.component";
import { SlideshowModule } from "ng-simple-slideshow";
import {InitViewComponent} from "../../components/containers/init-view/init-view.component";
import {AgeValidationComponent} from "../../components/presentationals/age-validation/age-validation.component";
import {GenericInfoModalComponent} from "../../components/presentationals/generic-info-modal/generic-info-modal.component";
import {ProductGenericComponent} from "../../components/presentationals/product-generic/product-generic.component";
import {DialogLoginComponent} from "../../components/containers/dialog-login/dialog-login.component";
import {CashOpComponent} from "../../components/presentationals/cash-op/cash-op.component";
import {CashPaymentComponent} from "../../components/presentationals/cash-payment/cash-payment.component";
import {DialogInvoiceComponent} from "../../components/presentationals/dialog-invoice/dialog-invoice.component";
import {SharedModule} from "../shared/shared.module";
import {DebitCardComponent} from "../../components/presentationals/debit-card/debit-card.component";
import { GenericInfoEventsComponent } from 'src/app/components/presentationals/generic-info-events/generic-info-events.component';
import {CustomHeaderComponent} from "../../components/presentationals/ag-grid/custom-header.component";

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    SlideshowModule,
    SharedModule
  ],
  exports: [
    HomeRoutingModule,
    LoginComponent,
    AnnounceComponent,
    PromotionsComponent
  ],
  declarations: [
    InitViewComponent,
    LoginComponent,
    AnnounceComponent,
    PromotionsComponent,
    AgeValidationComponent,
    GenericInfoModalComponent,
    ProductGenericComponent,
    DialogLoginComponent,
    CashOpComponent,
    CashPaymentComponent,
    DialogInvoiceComponent,
    DebitCardComponent,
    GenericInfoEventsComponent,
    CustomHeaderComponent
  ],
  entryComponents: [
    AgeValidationComponent,
    GenericInfoModalComponent,
    ProductGenericComponent,
    DialogLoginComponent,
    CashOpComponent,
    CashPaymentComponent,
    DialogInvoiceComponent,
    DebitCardComponent,
    GenericInfoEventsComponent,
    CustomHeaderComponent
  ],
})
export class HomeModule { }

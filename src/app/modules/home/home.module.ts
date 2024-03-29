import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { LoginComponent } from "../../components/presentationals/login/login.component";
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
import {CustomNameupcCellComponent} from '../../components/presentationals/ag-grid/custom-nameupc-cell.component';
import {PaidOutComponent} from "../../components/presentationals/paid-out/paid-out.component";
import {ApplyDiscountComponent} from "../../components/presentationals/apply-discount/apply-discount.component";
import {GenericSalesComponent} from "../../components/presentationals/generic-sales/generic-sales.component";
import {SalesShopComponent} from "../../components/presentationals/sales-shop/sales-shop.component";
import {SalesEmplComponent} from "../../components/presentationals/sales-empl/sales-empl.component";
import {AdminConfigComponent} from "../../components/presentationals/admin-config/admin-config.component";
import {DialogFilterComponent} from "../../components/containers/dialog-filter/dialog-filter.component";
import {FilterComponent} from "../../components/presentationals/filter/filter.component";
import {DialogPaidoutComponent} from "../../components/containers/dialog-paidout/dialog-paidout.component";
import {DialogDeliveryComponent} from "../../components/presentationals/dialog-delivery/dialog-delivery.component";
import {ListInvoicesComponent} from "../../components/presentationals/list-invoices/list-invoices.component";
import {CloseBatchComponent} from "../../components/presentationals/close-batch/close-batch.component";
import {ListTablesComponent} from "../../components/presentationals/list-tables/list-tables.component";
import {InputCcComponent} from "../../components/presentationals/input-cc/input-cc.component";
import {OrderInfoComponent} from "../../components/presentationals/order-info/order-info.component";
import {OrderInfoDetailsComponent} from "../../components/presentationals/order-info-details/order-info-details.component";
import {EbtInquiryInfoComponent} from "../../components/presentationals/ebt-inquiry-info/ebt-inquiry-info.component";
import {SwipeCredentialCardComponent} from "../../components/presentationals/swipe-credential-card/swipe-credential-card.component";
import {DailyCloseComponent} from "../../components/presentationals/daily-close/daily-close.component";
import {SetDateComponent} from "../../components/presentationals/set-date/set-date.component";
import {ClockInOutComponent} from "../../components/presentationals/clock-in-out/clock-in-out.component";
import {LoginClockComponent} from "../../components/containers/login-clock/login-clock.component";
import {TimeWorkedComponent} from "../../components/presentationals/time-worked/time-worked.component";

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule
  ],
  exports: [
    HomeRoutingModule,
    LoginComponent
  ],
  declarations: [
    InitViewComponent,
    LoginClockComponent,
    LoginComponent,
    ClockInOutComponent,
    AgeValidationComponent,
    GenericInfoModalComponent,
    ProductGenericComponent,
    EbtInquiryInfoComponent,
    DialogLoginComponent,
    CashOpComponent,
    CashPaymentComponent,
    DialogInvoiceComponent,
    ListInvoicesComponent,
    ListTablesComponent,
    DialogDeliveryComponent,
    DebitCardComponent,
    GenericInfoEventsComponent,
    CustomHeaderComponent,
    CustomNameupcCellComponent,
    PaidOutComponent,
    ApplyDiscountComponent,
    GenericSalesComponent,
    SalesShopComponent,
    SalesEmplComponent,
    AdminConfigComponent,
    DialogFilterComponent,
    DialogPaidoutComponent,
    CloseBatchComponent,
    InputCcComponent,
    OrderInfoComponent,
    OrderInfoDetailsComponent,
    SwipeCredentialCardComponent,
    DailyCloseComponent,
    SetDateComponent,
    TimeWorkedComponent
  ],
  entryComponents: [
    AgeValidationComponent,
    GenericInfoModalComponent,
    ProductGenericComponent,
    EbtInquiryInfoComponent,
    DialogLoginComponent,
    CashOpComponent,
    CashPaymentComponent,
    DialogInvoiceComponent,
    ListInvoicesComponent,
    ListTablesComponent,
    DialogDeliveryComponent,
    DebitCardComponent,
    GenericInfoEventsComponent,
    CustomHeaderComponent,
    CustomNameupcCellComponent,
    PaidOutComponent,
    ApplyDiscountComponent,
    GenericSalesComponent,
    AdminConfigComponent,
    FilterComponent,
    DialogFilterComponent,
    DialogPaidoutComponent,
    CloseBatchComponent,
    InputCcComponent,
    OrderInfoComponent,
    OrderInfoDetailsComponent,
    SwipeCredentialCardComponent,
    DailyCloseComponent,
    SetDateComponent
  ],
})
export class HomeModule { }

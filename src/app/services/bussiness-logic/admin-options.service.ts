import {Injectable} from '@angular/core';
import {InvoiceService} from "./invoice.service";
import {CashService} from "./cash.service";
import {ApplyDiscountComponent} from "../../components/presentationals/apply-discount/apply-discount.component";
import {EOperationType} from "../../utils/operation.type.enum";
import {InvoiceStatus} from "../../utils/invoice-status.enum";
import {OperationsService} from "./operations.service";
import {DataStorageService} from "../api/data-storage.service";
import {GenericSalesComponent} from "../../components/presentationals/generic-sales/generic-sales.component";
import {environment} from "../../../environments/environment";
import {AuthService} from "../api/auth.service";
import {AdminConfigComponent} from "../../components/presentationals/admin-config/admin-config.component";
import {AdminOpEnum} from "../../utils/operations/admin-op.enum";
import {Invoice} from "../../models/invoice.model";
import {ETransferType} from "../../utils/transfer-type.enum";
import {DialogInvoiceComponent} from "../../components/presentationals/dialog-invoice/dialog-invoice.component";
import {DialogDeliveryComponent} from "../../components/presentationals/dialog-delivery/dialog-delivery.component";
import {EApplyDiscount} from "../../utils/apply-discount.enum";
import {ProductGenericComponent} from "../../components/presentationals/product-generic/product-generic.component";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AdminOptionsService {
  private cancelCheckLoaded: boolean;
  private removeHoldLoaded: boolean;

  constructor(private invoiceService: InvoiceService, public cashService: CashService, private auth: AuthService,
              private operationService: OperationsService, private dataStorage: DataStorageService, private router: Router) {

    this.operationService.evCancelCheck.subscribe(next => {
      next ? this.cancelCheck(): this.cancelCheckLoaded=false;
    });

    this.operationService.evRemoveHold.subscribe(next => {
      this.removeHoldLoaded=false;
    });
  }

  setApplyDiscountType() {
    let adTypes = new Array<any>({value: EApplyDiscount.PERCENT, text: EApplyDiscount[EApplyDiscount.PERCENT]},
      {value: EApplyDiscount.AMOUNT, text: EApplyDiscount[EApplyDiscount.AMOUNT]});
    this.cashService.dialog.open(DialogDeliveryComponent,
      {
        width: '600px', height: '340px', data: {name: 'Apply Discount Types', label: 'Select a type', arr: adTypes},
        disableClose: true
      })
      .afterClosed().subscribe(next => {
      console.log(next);
      switch (next) {
        case 1:
          this.applyDiscount(EApplyDiscount.PERCENT);
          break;
        default:
          this.applyDiscount(EApplyDiscount.AMOUNT);
      }
    });
  }

  applyDiscount(type: EApplyDiscount){
    // if(this.invoiceService.invoice.productOrders.length > 0){
      const dialogRef = (type === EApplyDiscount.PERCENT)?
        this.cashService.dialog.open(ApplyDiscountComponent,
        {
          width: '480px', height: '600px', disableClose: true
        }):
        this.cashService.dialog.open(ProductGenericComponent,
      {
        width: '480px', height: '650px', data: {name: 'Apply Discount', label: 'Discount (amount)', unitCost: 0},
        disableClose: true
      });
        dialogRef.afterClosed().subscribe((data: any) => {
          console.log('apply discount', data);
          if(type === EApplyDiscount.AMOUNT ) data = (data['unitCost'])? Number(data['unitCost']).toFixed(2): 0;
          this.invoiceService.applyDiscountInvoice(data, type).subscribe(next => {
            this.invoiceService.setInvoice(next);
            this.invoiceService.invoiceProductSelected.splice(0);
          }, err => {
            this.cashService.openGenericInfo('Error', 'Can\'t apply discount')
          })
        });
    /*} else {
      this.cashService.openGenericInfo('Error', 'Can\'t apply discount without products')
    }*/

  }

  cancelCheck() {
    console.log('cancelCheck');
    this.operationService.currentOperation = AdminOpEnum.CANCEL_CHECK;
    if(this.invoiceService.invoice.status !== InvoiceStatus.IN_PROGRESS) {
      (this.invoiceService.digits || this.cancelCheckLoaded) ?
        this.cancelCheckOp()
        : this.operationService.keyboard(AdminOpEnum.CANCEL_CHECK);
      // this.cashService.openGenericInfo('Error', 'Please input receipt number of check');

    } else {
      console.error('Can\'t complete cancel check operation');
      this.invoiceService.resetDigits();
      this.cashService.openGenericInfo('Error', 'Can\'t complete cancel check operation because check is in progress');
    }
  }

  cancelCheckOp(){
    this.cancelCheckLoaded ?
      this.doCancelCheck():
    this.invoiceService.getInvoicesById(EOperationType.CancelCheck)
      .subscribe(next => {
        this.invoiceService.setInvoice(next);
        this.cancelCheckLoaded= true;
        this.cashService.cancelCheckEnableState();
        //this.operationService.currentOperation = FinancialOpEnum.REVIEW;
      }),err => this.cashService.openGenericInfo('Error', 'Can\'t complete cancel check operation');
  }

  doCancelCheck(){
    this.invoiceService.cancelCheck();
    this.cancelCheckLoaded= false;
  }

  sysZ() {
    this.dataStorage.getPaymentByType().subscribe(next =>  {
      console.log(AdminOpEnum.SYSZ, next);
      this.cashService.dialog.open(GenericSalesComponent,
        {
          width: '480px', height: '640px', disableClose: true, data: {title: AdminOpEnum.SYSZ, content: next }
        })
    }, error1 => {
      this.cashService.openGenericInfo('Error', 'Can\'t complete '+ AdminOpEnum.SYSZ +' operation')
    });
  }

  emplZ() {
    this.dataStorage.getApplicationUsers().subscribe(next =>  {
      console.log(AdminOpEnum.EMPLZ, next);
      next.unshift({id: "-1", userName: "All employees"});
      this.cashService.dialog.open(GenericSalesComponent,
        {
          width: '480px', height: '640px', disableClose: true, data: {title: AdminOpEnum.EMPLZ, empl: next }
        })
    }, error1 => {
      this.cashService.openGenericInfo('Error', 'Can\'t complete '+ AdminOpEnum.EMPLZ +' operation')
    });
  }

  systemVersion() {
    this.cashService.openGenericInfo('System Version', environment.version);
  }

  backToUser() {
    if(this.auth.initialLogin){
      this.auth.restoreInitialLogin();
      this.router.navigateByUrl('/cash/dptos');
      this.invoiceService.getCashier();
    } else {
      this.cashService.openGenericInfo('Information', 'Any user was logged previously')
    }
  }

  configOption() {
    /*this.dataStorage.getConfiguration().subscribe(next =>  {
      console.log('configOption', next);*/
      this.cashService.dialog.open(AdminConfigComponent,
        {
          width: '480px', height: '600px', disableClose: true, data: {title: 'Configuration'}
        }).afterClosed().subscribe(next => {
          if(next){
            console.log('configOption', next);
            this.operationService.inactivityTime = +next;
            this.operationService.resetInactivity(true);
          }
      })/*
    }, error1 => {
      this.cashService.openGenericInfo('Error', 'Can\'t complete Configuration operation', error1);
    });*/
  }

  removeAHold() {
    this.operationService.currentOperation = AdminOpEnum.REMOVE_HOLD;
    if(this.invoiceService.invoice.status !== InvoiceStatus.IN_PROGRESS) {
      if(!this.removeHoldLoaded){
        this.invoiceService.getInvoiceByStatus(EOperationType.RemoveHold, InvoiceStatus.IN_HOLD)
          .subscribe(next => {
            this.operationService.openDialogInvoices(next, i => this.removeHoldOp(i))
          },err => this.cashService.openGenericInfo('Error', 'Can\'t complete remove a hold operation'));
      } else {
        this.removeHoldOp();
      }
    } else {
      this.cashService.openGenericInfo('Error', 'Can\'t complete remove a hold operation because check is in progress');
    }
  }

  removeHoldOp(i?:Invoice){
    console.log('removeHold', i);
    if(this.removeHoldLoaded){
      this.doRemoveHold();
    } else {
      this.invoiceService.setInvoice(i);
      this.removeHoldLoaded= true;
      this.cashService.removeHoldEnableState();
    }
  }

  doRemoveHold(){
    this.invoiceService.removeHoldOrder(this.invoiceService.invoice);
    this.removeHoldLoaded= false;
  }

  closeBatch() {
    this.cashService.dialog.open(AdminConfigComponent,
      {
        width: '750px', height: '600px', disableClose: true, data: {title: AdminOpEnum.CLOSE_BATCH}
      }).afterClosed().subscribe(
        next => {
          if(next){
            this.dataStorage.closeBatch(next).subscribe(
            next => console.log('closeBatch', next),
            err => this.cashService.openGenericInfo('Error','Can\'t complete close batch operation'))
          };
        },err=> console.error(err));
  }

  doDayClose() {
    this.cashService.dayCloseEnableState();
    let dialogEv = this.cashService.openGenericInfo('Information', 'Closing day...');

    this.dataStorage.dayClose().subscribe(
      next => {
        console.log(AdminOpEnum.WTDZ);
        this.cashService.openGenericInfo('Day Close', 'Complete '+AdminOpEnum.WTDZ.toLowerCase()+' operation');
      },
      err => {
        this.cashService.openGenericInfo('Error', 'Can\'t complete '+
        AdminOpEnum.WTDZ.toLowerCase()+' operation')},
      () => {
        dialogEv.close();
        this.cashService.resetEnableState();
      }
    );
  }

  authPending() {
    this.operationService.currentOperation = AdminOpEnum.AUTH_PENDING;
    if(this.invoiceService.invoice.status !== InvoiceStatus.IN_PROGRESS) {
      //if(!this.removeHoldLoaded){
        this.dataStorage.getInvoiceByTransferType(EOperationType.AuthPending, ETransferType.Auth)
          .subscribe(next => {
            this.operationService.openDialogInvoices(next, i => this.authPendingOp(i))
          },err => this.cashService.openGenericInfo('Error', 'Can\'t complete ' +
            AdminOpEnum.AUTH_PENDING.toLowerCase()+' operation'));
      /*} else {
        this.removeHoldOp();
      }*/
    } else {
      this.cashService.openGenericInfo('Error', 'Can\'t complete remove a hold operation because check is in progress');
    }
  }

  authPendingOp(i:Invoice){
    console.log('authPendentOp', i);
    this.invoiceService.setInvoice(i);
  }

  setUserToOrder() {
    this.dataStorage.getApplicationUsers().subscribe(next => {
      console.log(AdminOpEnum.SET_USER, next);
      let users = new Array<any>();
      next.map(user => users.push(user));
      this.cashService.dialog.open(DialogInvoiceComponent,
        { width: '780px', height: '660px', data: {invoice: users, detail:'userName', title: 'Users', subtitle: 'Select a user'}
          , disableClose: true }).afterClosed().subscribe(userSelected => {
        console.log('dialog delivery', userSelected);
        if (userSelected) {
          this.invoiceService.setUser(userSelected['id']).subscribe(
            user => {
              console.log('setUserToOrder', user);
              this.invoiceService.invoice.applicationUserId = user['applicationUserId'];
              this.cashService.openGenericInfo('Information', 'The user '+userSelected['userName']
                +' was assigned to this invoice');
            },
            err => {
              console.error('setUserToOrder', err);
              this.cashService.openGenericInfo('Error', 'Can\'t complete set user operation');
            }
          );
        }
      });
    });
  }
}

import {EventEmitter, Injectable, Output} from '@angular/core';
import {InvoiceService} from './invoice.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../api/auth.service';
import {DialogLoginComponent} from '../../components/containers/dialog-login/dialog-login.component';
import {Invoice} from '../../models/invoice.model';
import {DialogInvoiceComponent} from '../../components/presentationals/dialog-invoice/dialog-invoice.component';
import {CashOpComponent} from '../../components/presentationals/cash-op/cash-op.component';
import {CashPaymentComponent} from '../../components/presentationals/cash-payment/cash-payment.component';
import {InvoiceStatus} from '../../utils/invoice-status.enum';
import {EOperationType} from '../../utils/operation.type.enum';
import {CashService} from './cash.service';
import {Product, Token} from '../../models';
import {FinancialOpEnum, InvioceOpEnum, PaymentOpEnum, TotalsOpEnum} from '../../utils/operations';
import {PaidOutComponent} from '../../components/presentationals/paid-out/paid-out.component';
import {DialogPaidoutComponent} from '../../components/containers/dialog-paidout/dialog-paidout.component';
import {DialogFilterComponent} from '../../components/containers/dialog-filter/dialog-filter.component';
import {MatDialogRef} from '@angular/material';
import {CompanyType} from '../../utils/company-type.enum';
import {PaymentStatus} from '../../utils/payment-status.enum';
import {ProductGenericComponent} from '../../components/presentationals/product-generic/product-generic.component';
import {AdminOpEnum} from '../../utils/operations/admin-op.enum';
import {ETXType} from '../../utils/delivery.enum';
import {DialogDeliveryComponent} from '../../components/presentationals/dialog-delivery/dialog-delivery.component';
import {Table} from '../../models/table.model';
import {Observable, of, Subscription} from 'rxjs';
import {InputCcComponent} from '../../components/presentationals/input-cc/input-cc.component';
import {dataValidation, operationsWithClear} from '../../utils/functions/functions';
import {Order} from '../../models/order.model';
import {OtherOpEnum} from '../../utils/operations/other.enum';
import {EFieldType} from '../../utils/field-type.enum';
import {OrderInfoComponent} from '../../components/presentationals/order-info/order-info.component';
import {EBTTypes} from '../../utils/card-payment-types.enum';
import {CustomerOpEnum} from '../../utils/operations/customer.enum';
import {ClientService} from './client.service';
import {InformationType} from '../../utils/information-type.enum';
import {SwipeCredentialCardComponent} from '../../components/presentationals/swipe-credential-card/swipe-credential-card.component';
import {PAXConnTypeEnum} from '../../utils/pax-conn-type.enum';
import {UserrolEnum} from '../../utils/userrol.enum';
import {PaymentMethodEnum} from '../../utils/operations/payment-method.enum';
import {InitViewService} from './init-view.service';
import {ScanOpEnum} from '../../utils/operations/scanner-op.enum';
import {ClientModel} from '../../models/client.model';
import {debounceTime} from 'rxjs/operators';
import { Department } from 'src/app/models/department.model';

@Injectable({
  providedIn: 'root'
})
export class OperationsService {
  inactivityTime = 60;
  timer: any;
  currentOperation: string;
  invTotalsBeforeFSSubTotal = {total: 0, tax: 0, subtotal: 0};
  @Output() evCancelCheck = new EventEmitter<any>();
  @Output() evRemoveHold = new EventEmitter<any>();
  @Output() evCleanAdminOperation = new EventEmitter<any>();
  @Output() evAddProdByUPC = new EventEmitter<any>();
  @Output() evAddProdGen = new EventEmitter<Product>();
  @Output() evBackUserOperation = new EventEmitter<any>();

  constructor(private invoiceService: InvoiceService, public cashService: CashService,
              private authService: AuthService, private clientService: ClientService,
              private initService: InitViewService,
              private router: Router, private route: ActivatedRoute) {
    // console.log('OperationService', this.inactivityTime);
    this.invoiceService.evAddProd.subscribe(() => this.onAddProduct());
    // If section products is showing
    this.invoiceService.evCreateInvoice.subscribe(next => next ? this.navigateToDept() : this.logoutOp());
    // If was added a product update inactivity time
    this.invoiceService.evUpdateProds.subscribe(ev => this.resetInactivity(true));
    //
    this.cashService.evLogout.subscribe(ev => this.logout(ev));
    this.cashService.evResetEnableState.subscribe(ev => this.resetCurrentOperation());
    this.counterInactivity();
  }

  navigateToDept() {
    this.resetInactivity(true);
    if (this.router.url.includes('products')) {
      this.router.navigateByUrl('/cash/dptos', { replaceUrl: true });
    }
  }

  counterInactivity() {
    this.timer = setTimeout(() => {
      if (this.letLogout(this.invoiceService.invoice.status) && this.currentOperation !== AdminOpEnum.CLOSE_BATCH) {
        this.logout(true);
      } else {
        this.resetInactivity(true);
      }
    }, this.getInactivityTime() * 60000);
  }

  getInactivityTime(): number {
    return (this.cashService.config.sysConfig) ? this.cashService.config.sysConfig.inactivityTime : 60;
  }

  resetInactivity(cont: boolean, msg?: string) {
    console.log('resetInactivity', cont, msg);
    clearTimeout(this.timer);
    if (cont) { this.counterInactivity(); }
  }

  clear() {
    console.log('clear');
    // this.currentOperation = 'clear';
    /*this.cashService.openGenericInfo('Confirm', 'Do you want clear?', null,true)
      .afterClosed().subscribe(next => {
      if (next !== undefined && next.confirm) {*/
        if (this.invoiceService.invoiceProductSelected.length <= 0 ||
          operationsWithClear.filter(i => i === this.currentOperation).length > 0) {
          this.clearOp(false);
        } else {
          /*this.cashService.getSystemConfig().subscribe(config => {
            config.allowClear ? this.clearOp() :
              this.authService.adminLogged() ? this.clearOp() : this.manager('clear');
          }, err => {
            this.cashService.openGenericInfo('Error', 'Can\'t get configuration');
          });*/
          this.clearOp();
        }
      /*}
    })*/
    this.resetInactivity(true);
  }

  clearOp(total: boolean = true) {
    if (operationsWithClear.filter(i => i === this.currentOperation).length > 0) {
        this.invoiceService.isReviewed = false;
        if (this.currentOperation === FinancialOpEnum.REVIEW ||
          this.currentOperation === FinancialOpEnum.REPRINT ||
          this.currentOperation === AdminOpEnum.CANCEL_CHECK ||
          this.currentOperation === AdminOpEnum.REMOVE_HOLD) {
          this.invoiceService.createInvoice();
          if (this.currentOperation === AdminOpEnum.CANCEL_CHECK) {
            this.evCancelCheck.emit(false);
          }
          if (this.currentOperation === AdminOpEnum.REMOVE_HOLD) {
            this.evRemoveHold.emit(false);
          }
        }
        if (this.currentOperation === TotalsOpEnum.FS_SUBTOTAL) {
          this.resetTotalFromFS();
          this.resetSubTotalState();
        }
      if (this.currentOperation === TotalsOpEnum.SUBTOTAL) {
        console.log('Clear of Subtotal');
        // if(this.invoiceService.invoice.isRefund || this.invoiceService.invoice.isPromotion){
          this.resetSubTotalState();
        // }
      }
      this.currentOperation = '';
      this.cashService.resetEnableState();
    } else if (this.invoiceService.invoiceProductSelected.length <= 0 && !this.invoiceService.digits &&
      this.currentOperation === FinancialOpEnum.RECALL) {
      this.invoiceService.createInvoice();
    } else if (this.invoiceService.invoiceProductSelected.length > 0 || this.invoiceService.digits) {
      if (this.invoiceService.invoiceProductSelected.length > 0) {
        this.cashService.openGenericInfo('Confirm', 'Do you want clear?', null, true)
          .afterClosed().subscribe(next => {
          if (next !== undefined && next.confirm) {
            // If clear need manager auth
            // console.log('clear config', config);
            if (this.cashService.config.sysConfig.allowLastProdClear === undefined) {
              this.cashService.config.sysConfig.allowLastProdClear = false;
            }
            if (this.cashService.config.sysConfig.allowClear) {
              this.deleteSelectedProducts();
            } else if (this.cashService.config.sysConfig.allowLastProdClear && this.invoiceService.lastProdAdd) {
              this.deleteLastProduct();
            } else {
              this.delSelProdByAdmin();
            }
          }
        });
      } else {
        this.invoiceService.evDelProd.emit();
      }

    }
    this.evCleanAdminOperation.emit();
  }

  resetSubTotalState() {
    console.log('Call clear API for update invoice');
    this.invoiceService.clear().subscribe(
      next => this.invoiceService.setInvoice(next),
      error1 => this.cashService.openGenericInfo(InformationType.ERROR, error1)
    );
  }

  delSelProdByAdmin() {
    console.log('Delete products by admin');
    this.authService.adminLogged() ? this.deleteSelectedProducts() : this.manager('clear');
  }

  deleteSelectedProducts(token?: any) {
    console.log('deleteSelected', token);
    this.invoiceService.evDelProd.emit(token); /*
    this.invoiceService.invoiceProductSelected.splice(0);
    this.invoiceService.setTotal();*/
  }

  private deleteLastProduct() {
    if (this.invoiceService.invoiceProductSelected.length === 1) {
      const prodSel = this.invoiceService.invoiceProductSelected[0];
      if (prodSel.id === this.invoiceService.lastProdAdd.id) {
        this.deleteSelectedProducts();
      } else {
        this.delSelProdByAdmin();
      }
    } else {
      this.delSelProdByAdmin();
    }
  }

  void() {
    console.log('void', this.invoiceService.invoice.productOrders);
    if ((this.invoiceService.invoice.status === InvoiceStatus.IN_PROGRESS &&
      this.invoiceService.invoice.productOrders.length > 0 ) ||
      this.invoiceService.invoice.status === InvoiceStatus.IN_HOLD ||
      this.invoiceService.invoice.isRefund ) {
      this.cashService.openGenericInfo('Confirm', 'Do you want void?', null, true)
        .afterClosed().subscribe(next => {
        if (next !== undefined && next.confirm) {
          this.currentOperation = 'void';
          this.authService.adminLogged() ? this.cancelCheck() : this.manager('void');
        }
      });
    } else {
      this.cashService.openGenericInfo('Error', 'Void operation is only for invoice with products, in hold or in progress');
    }
    this.resetInactivity(true);
  }

  plu() {
    console.log('plu');
    this.currentOperation = InvioceOpEnum.PLU;
    this.addProduct(EOperationType.Plu);
  }

  addProduct(op: EOperationType) {
    // If is a weight format product
    const origUPC = this.invoiceService.numbers;
    const isWFormat = this.isWeightFormatProduct();
    if (isWFormat) {
      this.getPriceAndUPCOfWFP();
    }
    // Consume servicio addProduct con this.digits esto devuelve ProductOrder
    this.invoiceService.addProductByUpc(EOperationType.Plu)
      .pipe(debounceTime(this.cashService.config.sysConfig.debounceTime * 100))
      .subscribe(prods => {
        this.selectProd(prods).subscribe(prod => {
          console.log(EOperationType[op], prod, this.invoiceService.qty);
          this.initService.setOperation(op, 'Product', 'Get product id: ' + prod.id);
          if(prod) {
            this.initService.setOperation(op, 'Product', 'Emit add product id: ' + prod.id);
            this.evAddProdByUPC.emit(prod); 
          } else {
            this.invoiceService.resetDigits(); 
          }
        });
      }, err => {
        console.error('addProductByUpc', err);
        if (isWFormat) {
          this.invoiceService.numbers = origUPC;
          this.invoiceService.addProductByUpc(op).subscribe(prods => {
            this.selectProd(prods).subscribe(prod => {
              console.log(EOperationType[op], prod, this.invoiceService.qty);
              this.initService.setOperation(op, 'Product', 'Get product id: ' + prod.id);
              prod ? this.evAddProdByUPC.emit(prod) : this.invoiceService.resetDigits();
            });
          }, err => {
            console.error('addProductByUpc', err);
            this.invoiceService.resetDigits();
            this.cashService.openGenericInfo('Error', 'Can\'t complete get product by plu');
          });
        } else {
          this.invoiceService.resetDigits();
          this.cashService.openGenericInfo('Error', 'Can\'t complete get product by plu');
        }
      });
      this.resetInactivity(false);
  }

  selectProd(prods: Product[]): Observable<Product> {
    let $prod: Observable<Product>;
    if (prods.length > 1) {
      $prod = this.cashService.dialog.open(DialogInvoiceComponent,
        { width: '780px', height: '660px',
          data: {invoice: prods, label: 'name', detail: 'unitCost', title: 'Products', subtitle: 'Select a product', filter: false},
          disableClose: true }).afterClosed();
    } else {
      $prod = of(prods[0]);
    }
    return $prod;
  }

  priceCheck() {
    console.log('priceCheck');
    (this.currentOperation !== InvioceOpEnum.PRICE) ? this.currentOperation = InvioceOpEnum.PRICE : this.currentOperation = '';
    if (this.invoiceService.digits) {
      this.invoiceService.getProductByUpc(EOperationType.PriceCheck).subscribe(prods => {
        this.selectProd(prods).subscribe( prod => {
          if (prod) {
            this.cashService.openGenericInfo('Price check', 'Do you want add ' + prod.name + ' to the invoice',
              prod.unitCost, true)
              .afterClosed().subscribe(next => {
              console.log(next);
              if (next !== undefined && next.confirm ) {
                // Logout
                this.evAddProdByUPC.emit(prod);
              }
            });
          } else {
            this.invoiceService.resetDigits();
          }
        });
      }, err => {
        this.cashService.openGenericInfo('Error', 'Can\'t found this product ' +
          this.invoiceService.digits); });
      this.invoiceService.resetDigits();
    }
    this.resetInactivity(true);
  }

  numpadInput(ev) {
    this.invoiceService.evNumpadInput.emit(ev);
  }

  actionByManager(action: string, token: any, data?: any) {
    switch (action) {
      case 'void':
        this.cancelCheckByAdmin(token);
        break;
      case 'clear':
        this.clearCheckByAdmin(token);
        break;
      case 'refund':
        this.refundCheckByAdmin(token);
        break;
      case 'prodGen':
        this.prodGenCheckByAdmin(token, data);
        break;
    }
  }

  manager(action?: string, data?: any) {
    console.log('manager', action, data);
    // this.currentOperation = 'manager';
    this.authService.initialLogin = this.authService.token;
    if (this.authService.adminLogged()) {
      if (action) {
        this.actionByManager(action, this.authService.token, data);
      } else {
        this.authService.token.rol === UserrolEnum.ADMIN ?
          this.router.navigateByUrl('/cash/options', { replaceUrl: true }) :
          this.adminLogin().subscribe( res => this.adminLoginOp(res));
      }
    } else {
      // this.authService.initialLogin = this.authService.token;
      this.adminLogin().subscribe(loginValid => this.adminLoginOp(loginValid, action, data));
    }
    this.resetInactivity(true);
  }

  adminLogin() {
    return this.cashService.dialog.open(DialogLoginComponent, { width: '530px', height: '580px', 
      disableClose: true, autoFocus: false})
      .afterClosed();
  }

  adminLoginOp(response, action?: any, data?: any) {
    console.log('The dialog was closed', response);
    if (response.valid) {
      if (action) {
        this.actionByManager(action, response.token, data);
      } else {
        this.invoiceService.getCashier();
        this.router.navigateByUrl('/cash/options', { replaceUrl: true });
      }
    }
  }

  hold() {
    console.log('hold');
    this.currentOperation = 'hold';
    if (this.invoiceService.invoice.productOrders.length > 0) {
      if (this.cashService.config.sysConfig.companyType === CompanyType.BAR) {
        this.getHoldOrderUser();
      } else {
        this.holdOp();
      }
    } else {
      this.cashService.openGenericInfo('Error', 'Not possible Hold Order without products in this Invoice');
    }
    this.resetInactivity(true);
  }

  getHoldOrderUser() {
    if (this.cashService.config.sysConfig.companyType === CompanyType.BAR) {
      this.getField(EOperationType[EOperationType.HoldOlder], 'Client Name', EFieldType.NAME).subscribe((name) => {
        console.log('pick up modal', name);
        if (name.text) {
          this.holdOp(name.text);
        }
      });
    }
  }

  holdOp(user?: string){
    this.invoiceService.holdOrder(user).subscribe(
      next => this.invoiceService.createInvoice(),
      err => this.cashService.openGenericInfo('Error', 'Can\'t complete hold order operation'));
  }

  recallCheck() {
    console.log('recallCheck');
    this.currentOperation = FinancialOpEnum.RECALL;
    this.invoiceService.isReviewed = true;
    this.resetInactivity(true);
    if (this.invoiceService.invoice.status !== InvoiceStatus.IN_PROGRESS) {
      this.invoiceService.digits ?
        /*this.getCheckById(EOperationType.RecallCheck,i => {
          i.status === InvoiceStatus.IN_HOLD ? this.invoiceService.setInvoice(i) :
            this.cashService.openGenericInfo('Error', 'Can\'t complete recall check operation because invoice is not in hold');
        })*/
        this.invoiceService.recallCheck().subscribe(i => {
          i.status === InvoiceStatus.IN_HOLD ? this.invoiceService.setInvoice(i) :
            this.cashService.openGenericInfo('Error', 'Can\'t complete recall check operation because invoice is not in hold');
        })
        :
        this.invoiceService.getInvoiceByStatus(EOperationType.RecallCheck, InvoiceStatus.IN_HOLD)
          .subscribe(next => this.openDialogInvoices(next, i => {
              this.invoiceService.setInvoice(i); }),
            err => this.cashService.openGenericInfo('Error', 'Can\'t complete recall check operation'));
    } else {
      console.error('Can\'t complete recall check operation');
      this.cashService.openGenericInfo('Error', 'Can\'t complete recall check operation because check is in progress');
    }
  }

  reviewCheck() {
    console.log('reviewCheck');
    this.currentOperation = FinancialOpEnum.REVIEW;
    this.invoiceService.isReviewed = true;
    this.resetInactivity(true);

    if (this.invoiceService.invoice.status !== InvoiceStatus.IN_PROGRESS) {
      if (this.invoiceService.digits) {
        this.getCheckById(EOperationType.ReviewCheck, i => {
          this.invoiceService.setInvoice(i);
          this.cashService.reviewEnableState();
        });
      } else {
        this.keyboard(FinancialOpEnum.REVIEW);
      }
    } else {
      console.error('Can\'t complete review check operation');
      this.cleanCurrentOp();
      this.invoiceService.resetDigits();
      this.cashService.openGenericInfo('Error', 'Can\'t complete review check operation because check is in progress');
    }
  }

  subTotal() {
    console.log('subTotal', this.currentOperation);
    const refund = this.currentOperation === FinancialOpEnum.REFUND;
    if (this.invoiceService.invoice.productOrders.length > 0 || ( this.cashService.config.sysConfig.fullRefund && refund )) {
      this.currentOperation = TotalsOpEnum.SUBTOTAL;
      const refundOrRefunSale = this.invoiceService.invoice.isRefund || this.invoiceService.invoice.isRefundSale;
      this.cashService.totalsDisabled(refundOrRefunSale, this.cashService.config.sysConfig.allowEBT);
      this.cashService.setOperation(EOperationType.Subtotal, 'Invoice', 'Before operation Subtotal by ' + 
        this.cashService.authServ.token.user_id);
      const paymentStatus = this.invoiceService.invoice.paymentStatus;
      this.invoiceService.subTotal().subscribe(
        next => {
          /*next.isPromotion = true;
          next.total = this.invoiceService.invoice.total - 0.50;*/
          // console.log('promoTotal', next.total, this.invoiceService.invoice.total);
          // Calculate total discount by promotion
          if (next.isPromotion && !(next.isRefund || next.isRefundSale)) {
            next.totalPromo = this.invoiceService.invoice.total - next.total;
          }
          if(paymentStatus === PaymentStatus.AUTH) next.paymentStatus = paymentStatus;
          this.invoiceService.setInvoice(next);
          if (this.invoiceService.invoice.status === InvoiceStatus.PAID && 
            this.invoiceService.invoice.paymentStatus !== PaymentStatus.AUTH) {
            this.invoiceService.warnInvoicePaid();
          } else {
            (this.invoiceService.invoice.productOrders.length > 0) ?
              this.cashService.totalsEnableState(false, refund || (next.isRefund || next.isRefundSale)) :
              this.cashService.resetEnableState();
          }
        },
        err => {
          this.cashService.openGenericInfo(InformationType.ERROR, err);
          this.cashService.resetEnableState();
        }
      );
    }
  }

  ebtSubTotal() {
    console.log('ebtSubTotal', this.currentOperation);
    const refund = this.currentOperation === FinancialOpEnum.REFUND;
    if (this.invoiceService.invoice.productOrders.length > 0 || ( this.cashService.config.sysConfig.fullRefund && refund )) {
      this.currentOperation = TotalsOpEnum.FS_SUBTOTAL;
      this.cashService.totalsDisabled();
      this.invoiceService.fsSubTotal().subscribe(
        next => {
          // Calculate total discount by promotion
          if (next.isPromotion && !next.isRefund) {
            next.totalPromo = this.invoiceService.invoice.total - next.total;
          }
          this.invoiceService.setInvoice(next);
          if (this.invoiceService.invoice.status === InvoiceStatus.PAID) {
            this.invoiceService.warnInvoicePaid();
          } else {
            this.invoiceService.invoice.productOrders.length > 0 ?
              this.cashService.totalsEnableState(this.invoiceService.invoice.fsTotal > 0, refund || (next.isRefund || next.isRefundSale)) :
              this.cashService.resetEnableState();
          }
        },
        err => {
          this.cashService.openGenericInfo(InformationType.ERROR, err);
          this.cashService.resetEnableState();
        }
      );
    }
  }

  fsSubTotal() {
    console.log('fsSubTotal');
    if (this.invoiceService.invoice.productOrders.length > 0) {
      this.currentOperation = TotalsOpEnum.FS_SUBTOTAL;
      // Send invoice for calculate totals
      // Receive updated invoice and execute this.invoiceService.setInvoice
      this.saveStateTotals();
      this.invoiceService.invoice.productOrders.filter(po => {
        if (po.foodStamp) {
          // this.invoiceService.invoice.subTotal = this.invoiceService.invoice.subTotal - po.subTotal;
          // this.invoiceService.invoice.tax -= po.tax;
          this.invoiceService.invoice.fsTotal = this.invoiceService.invoice.fsTotal ?
            this.invoiceService.invoice.fsTotal + po.subTotal : 0 + po.subTotal;
          // this.invoiceService.invoice.total -= po.total;
          this.invoiceService.evUpdateTotals.emit();
        }
        console.log('fsTotal', this.invoiceService.invoice.fsTotal);
        if (!this.invoiceService.invoice.fsTotal) {
          this.cashService.totalsEnableState();
        } else {
          this.cashService.totalsEnableState(true);
        }
      });
    }
    this.resetInactivity(true);
  }

  getCheckById(typeOp: EOperationType, action: (i: Invoice) => void) {
    this.invoiceService.getInvoicesById(typeOp)
      .subscribe(next => action(next),
        (err) => {
          this.cashService.openGenericInfo('Error', err);
          this.invoiceService.resetDigits();
          this.cleanCurrentOp();
        });
  }

  openDialogInvoices(inv: Invoice[], action: (i: any) => void, noSelectionMsg?: string, title?: string, subTitle?: string) {
    this.openDialogWithPag(inv, action, title, subTitle, 'receiptNumber', 'total', 'orderInfo');
  }

  openDialogTables(tabs?: Table[]) {
    this.invoiceService.tables().subscribe(tables => {
      /*if (tables.length > 0) {
        const dialogRef = this.cashService.dialog.open(DialogInvoiceComponent,
          { width: '780px', height: '660px', data: {invoice: tables, detail:'label', title: 'Tables', subtitle: 'Select a table'}
            , disableClose: true });
        dialogRef.afterClosed().subscribe(table => {
          console.log('The tables dialog was closed', table);
          if(table){
            this.invoiceService.setDineIn(<Table> table).subscribe(next => {
              if(next) {
                this.invoiceService.order = next;
                this.cashService.openGenericInfo('Information', 'The "' +table['label'] + '" was assigned to this order');
              } else {
                this.cashService.openGenericInfo('Error', 'Can\'t complete dine in operation')
              }}, err => {
              this.cashService.openGenericInfo('Error', 'Can\'t complete dine in operation')
            })
          }
        });
      } else {
        this.cashService.openGenericInfo('Information', 'There are not tables');
      }*/
      this.openDialogWithPag(tables, t => this.setDineIn(t), 'Tables', 'Select a table', null,
        'label');
    }, err => {
      console.error('Error getting tables', err);
      this.cashService.openGenericInfo('Error', 'Can\'t complete get tables operation');
    });
    // let tables = tabs? tabs : [{id:"0", number: 1, label: 'Table 1'}];

  }

  setDineIn(table: any) {
    if (table) {
      this.invoiceService.setDineIn(<Table> table).subscribe(next => {
        if (next) {
          this.invoiceService.order = next;
          this.cashService.openGenericInfo('Information', 'The "' + table['label'] + '" was assigned to this order');
        } else {
          this.cashService.openGenericInfo('Error', 'Can\'t complete dine in operation');
        }}, err => {
        this.cashService.openGenericInfo('Error', 'Can\'t complete dine in operation');
      });
    }
  }

  openDialogWithPag(dataArr: Array<any>, action: (i: any) => void, title: string, subTitle: string, label: string,
                       detail?: string, subdetail?: string, noSelectionMsg?: string) {
    if (dataArr.length > 0) {
      const dialogRef = this.cashService.dialog.open(DialogInvoiceComponent,
        {
          width: '780px', height: '680px',
          data: {invoice: dataArr, title: title, subtitle: subTitle, label: label, detail: detail, subdetail: subdetail},
          disableClose: true
        });
      dialogRef.afterClosed().subscribe(order => {
        console.log('The dialog with pagination was closed', order);
        if (order) { action(order); 
        } else {
          if (noSelectionMsg) { this.cashService.openGenericInfo('Error', noSelectionMsg); }
          // this.cashService.resetEnableState();
        }
      });
    } else {
      this.cashService.openGenericInfo('Information', 'There aren\'t elements to select');
      this.cashService.resetEnableState();
    }
  }

  openDialogWithPagObs(dataArr: Array<any>, title: string, subTitle: string, label: string,
                    detail?: string, subdetail?: string, noSelectionMsg?: string): Observable<any> {
      return this.cashService.dialog.open(DialogInvoiceComponent,
        {
          width: '780px', height: '680px',
          data: {invoice: dataArr, title: title, subtitle: subTitle, label: label, detail: detail, subdetail: subdetail},
          disableClose: true
        }).afterClosed();
  }

  refund() {
    console.log('refund');
    this.currentOperation = FinancialOpEnum.REFUND;
    if (this.invoiceService.invoice.status !== InvoiceStatus.IN_PROGRESS) {
      this.invoiceService.digits ?
        this.authService.adminLogged() ? this.refundOp() : this.manager('refund')
        /*this.invoiceService.refund().subscribe(i => {
            this.invoiceService.setInvoice(i);
          },
          err => {
            console.error(err);
            this.invoiceService.resetDigits();
            this.cashService.openGenericInfo('Error', 'Can\'t complete refund operation');
          }
        )*/
        :
        this.keyboard(FinancialOpEnum.REFUND);
        // this.cashService.openGenericInfo('Error', 'Please input receipt number of check');

    } else {
      console.error('Can\'t complete refund operation');
      this.invoiceService.resetDigits();
      this.cashService.openGenericInfo('Error', 'Can\'t complete refund operation because check is in progress');
    }

  }

  refundOp() {
    this.invoiceService.refund().subscribe(i => {
        console.log('refund', i);
        this.invoiceService.setInvoice(i);
        this.evBackUserOperation.emit();
      },
      err => {
        console.error(err);
        this.invoiceService.resetDigits();
        // this.cashService.openGenericInfo('Error', 'Can\'t complete refund operation');
        this.cashService.openGenericInfo('Error', err);
      }
    );
  }

  letLogout(status: InvoiceStatus) {
    const noLogoutStates = [InvoiceStatus.IN_PROGRESS, InvoiceStatus.PENDENT_FOR_PAYMENT];
    return !noLogoutStates.includes(status);
  }

  logout(direct?: boolean) {
    console.log('logout');
    this.currentOperation = 'logout';
    if (!this.invoiceService.isCreating && this.invoiceService.invoice !== undefined &&
      !this.letLogout(this.invoiceService.invoice.status)) {
      this.cashService.openGenericInfo('Error', 'Can\'t complete logout operation because check is in progress');
    } else {
      this.invoiceService.isCreating = false;
      direct ? this.logoutOp() :
        this.cashService.openGenericInfo('Confirm', 'Do you want logout?', null, true)
          .afterClosed().subscribe(next => {
            console.log(next);
            if (next !== undefined && next.confirm ) {
              // Logout
              this.logoutOp();
            }
        });
    }
    this.resetInactivity(false);
  }

  logoutOp() {
    this.authService.logout().subscribe(value => {
      console.log('logoutOp', value);
      this.logoutOpResponse();
    }, error1 => {
      console.error('LogoutOp', error1);
      (error1.includes('Timeout trying connect with server')) ? this.logoutOpResponse() :
        this.cashService.openGenericInfo(InformationType.ERROR, error1);
    });
  }

  logoutOpResponse() {
    this.authService.token = this.authService.initialLogin = undefined;
    this.cashService.dialog.closeAll();
    this.invoiceService.resetDigits();
    this.invoiceService.removeInvoice();
    this.cashService.resetEnableState();
    this.cashService.evResetStock.emit();
    this.router.navigateByUrl('/init', { replaceUrl: true });
    this.resetInactivity(false);
  }

  cancelCheck() {
    console.log('cancelar factura');
    const dialog = this.cashService.openGenericInfo(InformationType.INFO, 'Voiding transaction');
    this.invoiceService.cancelInvoice().subscribe(next => {
      dialog.close();
      this.invoiceService.createInvoice();
    }, err => {
      console.error('cancelCheck failed');
      dialog.close();
      this.cashService.openGenericInfo('Error', 'Can\'t complete void operation');
    });
    this.resetInactivity(true);
  }

  opByAdminLogout(t: Token, callback?: () => void) {
    this.authService.logout(true).subscribe(
      next => {
        this.authService.token = t;
        callback();
      },
      error => {
        this.cashService.openGenericInfo(InformationType.ERROR, error).afterClosed().subscribe(
          next => this.logoutOp()
        );
      }  
    )
  }

  cancelCheckByAdmin(t?: Token) {
    console.log('cancelCheckByAdmin', t);
    const dialog = this.cashService.openGenericInfo(InformationType.INFO, 'Voiding transaction');
    this.invoiceService.cancelInvoice(t ? this.invoiceService.cashier: null).subscribe(next => {
      console.log('cancelChekByAdmin', next);
      dialog.close();
      // this.opByAdminLogout(t, () => this.afterCancel());
      this.authService.token = this.authService.decodeToken(next);
      this.afterCancel();
    }, err => {
      console.error('cancelCheck failed');
      dialog.close();
      if (t) this.authService.token = t;
      this.cashService.openGenericInfo('Error', 'Can\'t complete void operation');
    });
    this.resetInactivity(true);
  }

  afterCancel(){
    this.cashService.setOperation(EOperationType.CreateInvoice, 'Invoice', 
      'Before create invoice after void by ' + this.cashService.authServ.token.user_id);
    this.invoiceService.createInvoice();
  }

  clearCheckByAdmin(t?: Token) {
    console.log('clearCheckByAdmin', t);
    this.deleteSelectedProducts(t);
    // this.authService.token = t;
    this.resetInactivity(true);
  }

  refundCheckByAdmin(t?: Token) {
    console.log('refundCheckByAdmin', t);
    this.refundOp();
    this.authService.token = t;
    this.resetInactivity(true);
  }

  prodGenCheckByAdmin(t?: Token, data?: Product) {
    console.log('prodGenCheckByAdmin', t, data);
    this.evAddProdGen.emit(<Product> data);
    this.authService.token = t;
    this.resetInactivity(true);
  }

  openInfoEventDialog(title: string): MatDialogRef<any, any> {
    const infoEventDialog = this.cashService.openGenericInfo(InformationType.INFO, title, null, false,
      true);
      infoEventDialog.afterClosed().subscribe(() => this.cashService.resetEnableState());
      return infoEventDialog;
  }

  getTotalToPaid() {
    return this.invoiceService.invoice.balance !== undefined ?
      this.invoiceService.invoice.balance : this.invoiceService.invoice.total;
  }

  cash(opType?: PaymentOpEnum) {
    console.log('cash');
    const totalToPaid = this.getTotalToPaid();
    if ((totalToPaid !== 0 || (totalToPaid === 0 && this.cashService.config.sysConfig.fullRefund) )
      && (this.invoiceService.invoice.isRefund || this.invoiceService.invoice.isRefundSale)) {
      console.log('paid refund, open cash!!!');
      this.invoiceService.cash(totalToPaid, totalToPaid, opType)
        .subscribe(
          data => {
            console.log(data);
            this.paymentReturn(totalToPaid).subscribe((result: any) => {
              (result.closeAutomatic) ?
                this.logoutOp() :
                this.invoiceService.createInvoice();
            });
          },
          err => this.cashService.openGenericInfo('Error', err),
          () => this.cashService.resetEnableState());
    } else if (totalToPaid > 0 || this.payZeroByDiscount(totalToPaid)) {
      this.invoiceService.digits ?
        this.totalFromDigits(this.invoiceService.digits, totalToPaid) : this.totalFromField(totalToPaid);
    }
    this.currentOperation = opType;
    this.resetInactivity(true);
  }

  totalFromDigits(paid, total) {
    const cost = +(parseFloat(paid) * 0.01).toFixed(2);
    this.cashPaid(cost, total);
  }

  totalFromField(total) {
    this.getTotalField(total).subscribe(data => {
      this.cashPaid(data, total);
    });
  }

  cashMoney(paid) {
    this.currentOperation = PaymentOpEnum.CASH;
    this.cashPaid(paid);
  }

  cashPaid(paid, totalToPaid?: number) {
    this.invoiceService.resetDigits();
    const total2Paid = (totalToPaid) ? totalToPaid : this.getTotalToPaid();
    if (paid > 0 || this.payZeroByDiscount(paid)) {
      const valueToReturn = paid - total2Paid;
      if (valueToReturn < 0) {
        this.invoiceService.invoice.balance = valueToReturn * -1;
      } else {
        this.invoiceService.invoice.balance = undefined;
      }
      // this.cashReturn(valueToReturn, paid, total2Paid);
      this.cashOp(valueToReturn, paid, total2Paid);
    } else {
      this.currentOperation = TotalsOpEnum.SUBTOTAL;
    }
  }

  cashOp(valueToReturn, payment, totalToPaid) {
    console.log('cash', this.currentOperation);
    const opMsg = 'cash payment';
    const dialogInfoEvents = this.cashService.openGenericInfo('Cash', 'Paying by cash...', undefined,
      undefined, true);

    const $cashing = this.invoiceService.cash(payment, totalToPaid, <PaymentOpEnum>this.currentOperation)
      .subscribe(data => {
          console.log(data);
          dialogInfoEvents.close();
          clearTimeout(timeOut);
          if (valueToReturn > 0) {
            this.paymentReturn(valueToReturn).subscribe((result: any) => {
              // if (result !== '') {
              // this.paymentReturn(totalToPaid).subscribe((result: any) => {
              if (result.closeAutomatic) {
                this.logoutOp();
              } else if (+valueToReturn >= 0 || data.status === InvoiceStatus.PAID) {
                this.invoiceService.createInvoice();
              } else {
                console.log('Invoice not is paid', data, valueToReturn);
              }
              // }
            });
          } else if (valueToReturn === 0 || data.status === InvoiceStatus.PAID) {
            this.invoiceService.createInvoice();
          } else {
            console.log('Invoice not is paid', data, valueToReturn);
            this.invoiceService.setInvoice(data);
          }
        },
        err => {
          console.error(err);
          this.cashService.openGenericInfo('Error', err);
          dialogInfoEvents.close();
          clearTimeout(timeOut);
        },
        () => { this.cashService.resetEnableState(); clearTimeout(timeOut); });

    const timeOut = this.paxTimeOut($cashing, dialogInfoEvents, opMsg);
  }

  paxTimeOut($op: Subscription, dialogInfoEvents: MatDialogRef<any, any>, opMsg: string): number {
    // @ts-ignore
    return setTimeout(() => {
      dialogInfoEvents.close();
      $op.unsubscribe();
      this.cashService.openGenericInfo('Error', 'Can\'t complete ' + opMsg + ' operation because timeout. ' +
        'Please press SUBTOTAL operation again.');
      this.cashService.resetEnableState();
    }, this.cashService.config.sysConfig.paxTimeout * 1000);
  }

  paymentReturn(valueToReturn, close?: boolean) {
    close = this.cashService.config.sysConfig.closeChange;
    return this.cashService.dialog.open(CashPaymentComponent,
      {
        width: '350px', height: '260px', data: {value: valueToReturn, close: close, closeAutomatic: false}, disableClose: true
      }).afterClosed();
  }

  /*cashReturn(valueToReturn, payment, totalToPaid) {
    const dialogRef = this.cashService.dialog.open(CashPaymentComponent,
      {
        width: '300px', height: '240px', data: valueToReturn > 0 ? valueToReturn : 0, disableClose: true
      })
      .afterClosed().subscribe((result: string) => {
        if (result !== '') {
          console.log('cash', this.currentOperation);
          this.invoiceService.cash(payment, totalToPaid, <PaymentOpEnum>this.currentOperation)
            .subscribe(data => {
                console.log(data);
                if(+valueToReturn >= 0 || data.status === InvoiceStatus.PAID) this.invoiceService.createInvoice();
              },
              err => {
                console.log(err); this.cashService.openGenericInfo('Error', 'Can\'t complete cash operation')
              },
              () => this.cashService.resetEnableState())
        }
      });
  }*/

  reprint() {
    console.log('reprint');
    if (this.invoiceService.invoice.status !== InvoiceStatus.IN_PROGRESS) {
      if (this.invoiceService.digits) {
        this.getCheckById(EOperationType.Reprint, i => {
          this.invoiceService.resetDigits();
          this.print(i);
        });
      } else if (this.invoiceService.isReviewed) {
        this.print(this.invoiceService.invoice);
      } else {
        this.keyboard(FinancialOpEnum.REPRINT);
      }

    } else {
      console.error('Can\'t complete print operation');
      this.cashService.openGenericInfo('Error', 'Can\'t complete print operation');
      this.invoiceService.resetDigits();
    }

  }

  private print (i: Invoice) {
    this.currentOperation = FinancialOpEnum.REPRINT;
    this.invoiceService.print(i).subscribe(
      data => this.cashService.openGenericInfo('Print', 'Print is finish'),
      err => this.cashService.openGenericInfo('Error', 'Can\'t complete print operation'));
  }

  onAddProduct() {
    this.resetInactivity(true);
    // this.invoiceService.invoice.status = InvoiceStatus.IN_PROGRESS;
  }

  scanProduct() {
    this.currentOperation = ScanOpEnum.SCAN_PROD;
    this.addProduct(EOperationType.Scanner);
  }

  isWeightFormatProduct(): boolean {
    return this.invoiceService.numbers.length === 12 && this.invoiceService.numbers.startsWith('2') &&
      this.invoiceService.numbers.substring(7, 11) !== '0000';
  }

  getPriceAndUPCOfWFP() {
    this.invoiceService.priceWic = this.invoiceService.numbers.substring(7, 11);
    const upc = this.invoiceService.numbers.substring(0, 6);
    this.invoiceService.numbers = upc + '000000';
  }

  ebt(type?: number, splitAmount?: number) {
    console.log('EBT Card');
    this.currentOperation = 'EBT Card';
    let amount2Paid;
    if (this.invoiceService.invoice.total !== 0 || this.invoiceService.invoice.fsTotal !== 0) {
      const dialogInfoEvents = this.openInfoEventDialog('Paying by EBT card');

      amount2Paid = (type === EBTTypes.EBT_CASH && this.invoiceService.invoice.fsTotal === 0) ?
        this.invoiceService.invoice.balance : this.invoiceService.invoice.fsTotal;
      this.invoiceService.ebt(splitAmount ? splitAmount : amount2Paid, type)
        .subscribe(data => {
          console.log(data);
          if (data.status === InvoiceStatus.PAID) {
            this.invoiceService.createInvoice();
            this.cashService.resetEnableState();
          } else {
            this.invoiceService.setInvoice(data);
            this.cashService.ebtEnableState();
          }
        }, err => {
          console.log(err);
          this.resetTotalFromFS();
          dialogInfoEvents.close();
          this.cashService.openGenericInfo('Error', err);
          this.cashService.resetEnableState();
        }, () => dialogInfoEvents.close());
    }
    this.resetInactivity(true);
  }

  payZeroByDiscount(total?: number) {
    return this.invoiceService.invoice.isDiscount && (total ? total === 0 : this.invoiceService.invoice.total === 0);
  }

  debit() {
    if (this.invoiceService.invoice.isRefund) {
      this.cash();
    } else if (this.invoiceService.invoice.total !== 0) {
      this.setTip(this.debitOp, null, this);
    }
    this.resetInactivity(true);
  }

  setTip(action?: (i?: any, j?: any, k?: any) => void, op?: PaymentOpEnum, context?: any) {
    if (this.cashService.config.sysConfig.companyType === CompanyType.RESTAURANT &&
      this.invoiceService.invoice.paymentStatus === PaymentStatus.AUTH) {
      this.cashService.dialog.open(ProductGenericComponent,
        {
          width: '480px', height: '650px', data: {unitCost: 0, name: 'Tip', label: 'Tip'},
          disableClose: true
        }).afterClosed().subscribe(
        next => {
          console.log(next);
          this.invoiceService.invoice.tip = next.unitCost;
          (op === PaymentOpEnum.CREDIT_CARD) ? 
            action(null, context, PaymentStatus.ADJUST) : action(context, PaymentStatus.ADJUST);
        },
        err => {console.error(err); });
    } else {
      (op === PaymentOpEnum.CREDIT_CARD) ? this.setCreditCardType() : action(context);
    }
  }

  debitOp(context?: any, transferType?: PaymentStatus) {
    if (!context) { context = this; }
    context.currentOperation = PaymentOpEnum.DEBIT_CARD;
    const opMsg = 'debit card payment';
    const dialogInfoEvents = context.openInfoEventDialog('Paying by debit card');
    const $debit = context.invoiceService.debit(context.invoiceService.invoice.balance, 
      context.invoiceService.invoice.tip, transferType)
      .subscribe(data => {
        context.closeTimeout(dialogInfoEvents, timeOut, data);
        context.setOrCreateInvoice(data);
      }, err => {
        context.closeTimeout(dialogInfoEvents, timeOut, err);
        context.cashService.openGenericInfo('Error', err);
        context.cashService.resetEnableState();
      });

    const timeOut = context.paxTimeOut($debit, dialogInfoEvents, opMsg);
  }

  closeTimeout(dialog: MatDialogRef<any>, timeOut: number, data?: any) {
    console.log(data);
    dialog.close();
    clearTimeout(timeOut);
  }

  credit() {
    console.log('Credit Card');
    // this.currentOperation = 'Credit Card';
    if (this.invoiceService.invoice.total !== 0) {
      this.setTip(this.creditOp, PaymentOpEnum.CREDIT_CARD, this);
    }
    this.resetInactivity(true);
  }

  private creditOp(splitAmount?: number, context?: any, transferType?: PaymentStatus) {
    if (!context) { context = this; }
    context.currentOperation = PaymentOpEnum.CREDIT_CARD;
    const opMsg = 'credit card payment';
    const dialogInfoEvents = context.openInfoEventDialog('Paying by credit card');
    const $credit = context.invoiceService.credit(splitAmount ? splitAmount : context.invoiceService.invoice.balance,
      context.invoiceService.invoice.tip, transferType)
      .subscribe(data => {
          context.closeTimeout(dialogInfoEvents, timeOut, data);
          context.setOrCreateInvoice(data);
        },
        err => {
          context.closeTimeout(dialogInfoEvents, timeOut, err);
          context.cashService.openGenericInfo('Error', err);
          context.cashService.resetEnableState();
        });

    const timeOut = context.paxTimeOut($credit, dialogInfoEvents, opMsg);
  }

  private creditManualOp(title, splitAmount?: number) {
    this.getNumField(title, 'Number', EFieldType.CARD_NUMBER).subscribe((number) => {
      console.log('cc manual modal', number);
      if (number.number) {
        this.getNumField(title, 'CVV', EFieldType.CVV).subscribe(cvv => {
          if (cvv.number) {
            this.getNumField(title, 'Exp. Date', EFieldType.EXPDATE).subscribe(date => {
              if (date.number) {
                this.getNumField(title, 'Zip Code', EFieldType.ZIPCODE).subscribe(zipcode => {
                  if (zipcode.number) {
                    this.currentOperation = PaymentOpEnum.CREDIT_CARD_MANUAL;
                    this.invoiceService.creditManual(splitAmount ? splitAmount : this.invoiceService.invoice.balance,
                      this.invoiceService.invoice.tip, number.number, cvv.number, date.number, zipcode.number)
                      .subscribe(data => {
                          console.log(data);
                          this.setOrCreateInvoice(data);
                          this.cashService.resetEnableState();
                        },
                        err => {
                          console.log(err);
                          this.cashService.openGenericInfo(InformationType.ERROR, err);
                          this.cashService.resetEnableState();
                        }/*,
                        () => this.cashService.resetEnableState()*/);
                  }
                });
              } else {
                /*this.cashService.resetEnableState();
                this.cashService.openGenericInfo('Error', 'Can\'t complete credit card manual operation because no set CC Date')
              */}
            });
          } else {
            /*this.cashService.resetEnableState();
            this.cashService.openGenericInfo('Error', 'Can\'t complete credit card manual operation because no set CVV')
          */}
        });
      } else {
       /* this.cashService.resetEnableState();
        this.cashService.openGenericInfo('Error', 'Can\'t complete credit card manual operation because no set CC Number')
      */}
    });
  }

  externalCardPayment(title= 'External Card', client?: any, op?: PaymentOpEnum, ebtType?: EBTTypes) {
    console.log('External Card');
    const total = ebtType === EBTTypes.EBT ? this.invoiceService.invoice.fsTotal : this.getTotalToPaid().toFixed(2);
    this.getPriceField(title + '. Total: ' +  total, 'Amount')
      .subscribe((amount) => {
      console.log('Amount', amount.unitCost);
      if (amount.unitCost) {
        // Get card number, authorization code and card type
        /*this.getNumField(title, 'Account', EFieldType.NUMBER).subscribe(cardNumber => {
          if (cardNumber.number) {
            this.getNumField(title, 'Auth Code', EFieldType.CVV).subscribe(authCode => {
              if (authCode.number) {
                op === PaymentOpEnum.EBT_CARD ?
                  this.externalCardPaymentOp(amount.unitCost, cardNumber.number, authCode.number, op, client,
                    (ebtType === EBTTypes.EBT ? PaymentMethodEnum.EBT_CARD : PaymentMethodEnum.EBT_CASH)) :
                  this.getCreditCardType(amount.unitCost, cardNumber.number, authCode.number, client,
                    (op === PaymentOpEnum.CREDIT_CARD) ? PaymentMethodEnum.CREDIT_CARD : PaymentMethodEnum.DEBIT_CARD);
              } else {
                /!*this.cashService.openGenericInfo('Error', 'Can\'t complete external card payment operation '
                  + 'because authorization number not was specified');*!/
                //this.cashService.resetEnableState();
              }
            });
          }
        });*/
        // No get card number nor authorization code
        const card = { number: '', authCode: ''};
        op === PaymentOpEnum.EBT_CARD ?
          this.externalCardPaymentOp(amount.unitCost, card.number, card.authCode, '', client,
            (ebtType === EBTTypes.EBT ? PaymentMethodEnum.EBT_CARD : PaymentMethodEnum.EBT_CASH)) :
          this.externalCardPaymentOp(amount.unitCost, card.number, card.authCode, '', client,
            (op === PaymentOpEnum.CREDIT_CARD) ? PaymentMethodEnum.CREDIT_CARD : PaymentMethodEnum.DEBIT_CARD);
      } else {
        /*this.cashService.openGenericInfo('Error', 'Can\'t complete external card payment operation '
          + 'because amount not was specified');*/
        // this.cashService.resetEnableState();
      }
    });

  }

  externalCardPaymentOp(amount, cardNumber, authCode, cardType, client, op?: any) {
    const dialogInfoEvents = this.openInfoEventDialog('Paying by ' + PaymentMethodEnum[op]);
    this.invoiceService.externalCard(amount, cardNumber, authCode, cardType, client, op).subscribe(
      next => {
        dialogInfoEvents.close();
        console.log('External Card', next);
        this.currentOperation = PaymentMethodEnum[op];
        if (!client) {
          (next && next.balance > 0) ? this.invoiceService.setInvoice(next) : this.invoiceService.createInvoice();
        } else {
          console.log('External Card for Account Payment', next);
          this.cashService.openGenericInfo(InformationType.INFO, ' The account client (' + next['name']
            + ') was charged with ' + amount.toFixed(2));
        }
        this.cashService.resetEnableState();
      },
      error1 => {
        dialogInfoEvents.close();
        console.error('External Card', error1);
        this.cashService.openGenericInfo('Error', error1);
        this.cashService.resetEnableState();
      }/*,
      () => this.cashService.resetEnableState()*/
    );
  }

  getCreditCardType(amount, cardNumber, authCode, client?: any, op?: any) {
    this.invoiceService.getExternalCadTypes().subscribe(
      next => {
        const ccTypes = [];
        console.log('getExternalCardTypes', next);
        if (next.length > 0) {
          next.map(val => ccTypes.push({value: val, receiptNumber: val}));
          this.openDialogInvoices(ccTypes, next => {
            /*this.invoiceService.externalCard(amount, cardNumber, authCode, next.value, client).subscribe(
              next => {
                console.log('External Card', next);
                if(!client){
                  (next && next.balance > 0) ? this.invoiceService.setInvoice(next) : this.invoiceService.createInvoice();
                } else {
                  console.log('External Card for Account Payment', next);
                  this.cashService.openGenericInfo(InformationType.INFO, ' The account client ('+ next['name']
                    + ') was charged with ' + amount.toFixed(2));
                }
              },
              error1 => {
                console.error('External Card', error1);
                this.cashService.openGenericInfo('Error', error1);
                this.cashService.resetEnableState();
              },
              () => this.cashService.resetEnableState()
            );*/
            this.externalCardPaymentOp(amount, cardNumber, authCode, next.value, client, op);
          }, 'Can\'t complete external card payment operation because the card type not was selected',
            'Card Payment Types', 'Select a card type:');
        } else {
          this.cashService.openGenericInfo('Error', 'Can\'t complete external card payment '
            + 'operation because there aren\'t card types to select');
          this.cashService.resetEnableState();
        }
      },
      error1 => {
        console.error(error1);
        this.cashService.openGenericInfo('Error', 'Can\'t complete external card payment '
          + 'operation because there aren\'t card types to select');
        this.cashService.resetEnableState();
      });
  }

  private setOrCreateInvoice(data: Invoice) {
    (data && data.balance > 0 && data.status !== InvoiceStatus.PAID) ?
      this.invoiceService.setInvoice(data) : this.invoiceService.createInvoice();
  }

  private resetTotalFromFS() {
    this.invoiceService.invoice.fsTotal = 0;
    this.invoiceService.evUpdateTotals.emit();
  }

  private saveStateTotals() {
    this.invTotalsBeforeFSSubTotal['total'] = this.invoiceService.invoice.total;
    this.invTotalsBeforeFSSubTotal['subtotal']  = this.invoiceService.invoice.subTotal;
    this.invTotalsBeforeFSSubTotal['tax']  = this.invoiceService.invoice.tax;
  }

  public printLast() {
    this.invoiceService.printLastInvoice();
    this.resetInactivity(true);
  }

  scanInvoice() {
    /*if(this.invoiceService.digits) {
      this.getCheckById(EOperationType.ReviewCheck, i => {
        if (i.status === InvoiceStatus.IN_PROGRESS) {
          this.cashService.reviewEnableState();
        } else if (i.status === InvoiceStatus.PAID) {
          this.cashService.reviewPaidEnableState();
        } else if (i.status === InvoiceStatus.IN_HOLD) {
          this.cashService.reviewEnableState();
        } else this.cashService.reviewEnableState();
      });
    }*/
    if (this.invoiceService.invoice.status === InvoiceStatus.IN_PROGRESS) {
      this.cashService.openGenericInfo('Error', 'Scan invoice operation is not allow if a invoice is in progress');
      this.invoiceService.resetDigits();
    }
  }

  paidOut() {
    if (this.invoiceService.invoice.status !== InvoiceStatus.IN_PROGRESS) {
      this.cashService.dialog.open(PaidOutComponent,
        {
          width: '480px', height: '600px', disableClose: true
        })
        .afterClosed().subscribe((data: string) => {
        console.log('paided out modal', data);
        if (data) {
          this.cashService.dialog.open(DialogPaidoutComponent,
            {
              width: '1024px', height: '600px', disableClose: true
            })
            .afterClosed().subscribe(next => {
            this.invoiceService.addPaidOut(data, next.text).subscribe(next => {
              console.log('paided out service', data, next);
            }, error1 => {
              console.error('paid out', error1);
              this.cashService.openGenericInfo('Error', 'Can\'t complete paid out operation');
            });
          });
        }
      });
    } else {
      this.cashService.openGenericInfo('Error', 'Paid out operation is not allow if a invoice is in progress');
    }
    this.resetInactivity(true);
  }

  keyboard(action?: FinancialOpEnum | AdminOpEnum) {
    this.cashService.disabledInputKey = true;
    this.cashService.dialog.open(DialogFilterComponent,
      { width: '1024px', height: '600px', data: {title: 'Enter Receipt Number'} , disableClose: true})
      .afterClosed()
      .subscribe(next => {
        console.log('keyboard', next);
        this.cashService.disabledInputKey = false;
        if (next) {
          this.invoiceService.digits = next.text;
          if (action !== undefined) {
            switch (action) {
              case FinancialOpEnum.REFUND:
                this.refundOp();
                break;
              case FinancialOpEnum.REVIEW:
                this.reviewCheck();
                break;
              case FinancialOpEnum.REPRINT:
                this.reprint();
                break;
              case AdminOpEnum.CANCEL_CHECK:
                this.evCancelCheck.emit(true);
                break;
            }
          }
        } else if (!next && action === FinancialOpEnum.REVIEW || action === FinancialOpEnum.REFUND ||
          action === FinancialOpEnum.REPRINT) {
          this.cleanCurrentOp();
          this.invoiceService.isReviewed = false;
        }
      });
  }

  cleanCurrentOp() {
    this.currentOperation = '';
  }

  txType() {
    const txTypes = new Array<any>(
      { value: 1, text: 'Dine In', color: 'red' },
            { value: 2, text: 'Pick Up', color: 'yellow' },
            { value: 3, text: 'Delivery', color: 'green' },
            { value: 4, text: 'Retail', color: 'blue' }
      );
    this.cashService.dialog.open(DialogDeliveryComponent,
      { width: '420px', height: '340px', data: { arr: txTypes}, disableClose: true })
      .afterClosed().subscribe(next => {
        console.log('dialog delivery', next);
        if (next) {
          this.invoiceService.invoice.type = next;
          switch (this.invoiceService.invoice.type) {
            case ETXType.DINEIN:
              this.dineIn();
              break;
            case ETXType.DELIVERY:
              this.delivery();
              break;
            case ETXType.PICKUP:
              this.pickUp();
              break;
            case ETXType.RETAIL:
              this.retail();
              break;
          }
        } else {
          // this.invoiceService.invoice.type = ETXType.DINEIN;
        }
    });
  }

  setCreditCardType(splitAmount?: number) {
    const ccTypes = new Array<any>({value: 1, text: 'Automatic'}, {value: 2, text: 'Manual'});
    if (this.cashService.config.sysConfig.allowEBT) {
      [{value: 3, text: 'EBT'}, {value: 4, text: 'EBT Cash'}].map(op => ccTypes.push(op));
    }
    this.cashService.dialog.open(DialogDeliveryComponent,
      { width: '600px', height: '340px', data: {name: 'Credit Card Types', label: 'Select a type', arr: ccTypes},
        disableClose: true })
      .afterClosed().subscribe(next => {
      console.log(next);
      switch (next) {
        case 1:
          this.creditOp(splitAmount);
          break;
        case 2:
          this.creditManualOp('Credit Card', splitAmount);
          break;
        case 3:
          this.ebt(EBTTypes.EBT, splitAmount);
          break;
        case 4:
          this.ebt(EBTTypes.EBT_CASH, splitAmount);
          break;
        default:
          this.cashService.resetEnableState();
          this.resetTotalFromFS();
      }
    });
  }

  setEBTCardType() {
    const ccTypes = new Array<any>({value: EBTTypes.EBT, text: 'EBT'}, {value: EBTTypes.EBT_CASH, text: 'EBT Cash'});
    if (this.invoiceService.invoice.fsTotal <= 0) { ccTypes.splice(0, 1); }
    this.cashService.dialog.open(DialogDeliveryComponent,
      { width: '600px', height: '340px', data: {name: 'EBT Card Types', label: 'Select a type', arr: ccTypes},
        disableClose: true })
      .afterClosed().subscribe(next => {
        console.log(next);
        if (next !== '') {
          this.cashService.config.sysConfig.paxConnType === PAXConnTypeEnum.OFFLINE ?
            this.externalCardPayment(undefined, undefined, PaymentOpEnum.EBT_CARD, next) :
            this.ebt(next);
        }
        // this.cashService.resetEnableState();
        // this.resetTotalFromFS();
    });
  }

  retail() {
    console.log('set order to retail');
    this.invoiceService.setRetail().subscribe(next => {
      if (next) {
        this.invoiceService.order = next;
        this.cashService.openGenericInfo('Information', 'This order was set to "Retail"');
      }
    }, err => {
      this.cashService.openGenericInfo('Error', 'Can\'t complete set retail operation');
    });
  }

  dineIn() {
    // if(this.invoiceService.invoice.status !== InvoiceStatus.IN_PROGRESS){
      this.openDialogTables();
    /*} else {
      this.cashService.openGenericInfo('Error', 'Dine in operation is not allow if a invoice is in progress');
    }*/
  }

  pickUp() {
    const title = 'Pick up';
    // if(this.invoiceService.invoice.status !== InvoiceStatus.IN_PROGRESS){
      this.getField(title, 'Client Name', EFieldType.NAME).subscribe((name) => {
        console.log('pick up modal', name);
        if (name.text) {
          this.getNumField(title, 'Client Phone', EFieldType.PHONE).subscribe(phone => {
            if (phone.number) {
              this.getField(title, 'Description', EFieldType.DESC).subscribe(descrip => {
                if (!descrip.text) {
                  console.log('pick up no set description');
                }
                this.invoiceService.setPickUp(name.text, phone.number, descrip.text).subscribe(order => {
                  console.log('pick up this order', order);
                  this.invoiceService.order = order;
                  this.cashService.openGenericInfo('Information', 'This order was set to "Pick up"');
                }, error1 => {
                  console.error('pick upt', error1);
                  this.cashService.openGenericInfo('Error', 'Can\'t complete pick up operation');
                });
              });
            } else {
              this.cashService.openGenericInfo('Error', 'Can\'t complete pick up operation because no set Client Phone');
            }
          });
        } else {
          this.cashService.openGenericInfo('Error', 'Can\'t complete pick up operation because no set Client Name');
        }
      });
    /*} else {
      this.cashService.openGenericInfo('Error', 'Pick up operation is not allow if a invoice is in progress');
    }*/
  }

  delivery() {
    const title = 'Delivery';
    this.getField(title, 'Client Name', EFieldType.NAME).subscribe(name => {
      if (name) {
        // order.type.client.name = name.text;
        this.getField(title, 'Client Address', EFieldType.ADDRESS).subscribe(address => {
          if (address) {
            // order.type.client.address = address.text;
            this.getNumField(title, 'Client Phone', EFieldType.PHONE).subscribe(phone => {
              if (phone) {
                // order.type.client.telephone = phone.text;
                this.getField(title, 'Description', EFieldType.DESC).subscribe(descrip => {
                  if (!descrip.text) {
                    console.log('delivery no set description');
                  }
                  this.invoiceService.setDelivery(name.text, address.text, phone.number, descrip.text).subscribe(order => {
                    console.log('delivery this order', order);
                    this.invoiceService.order = order;
                    this.cashService.openGenericInfo('Information', 'This order was set to "Delivery"');
                  }, err => {
                    console.error('delivery', err);
                    this.cashService.openGenericInfo('Error', 'Can\'t complete delivery operation');
                  });
                });
              } else {
                this.cashService.openGenericInfo('Error', 'Can\'t complete delivery operation because no set Client Phone');
              }
            });
          } else {
            this.cashService.openGenericInfo('Error', 'Can\'t complete delivery operation because no set Client Address');
          }
        });
      } else {
        this.cashService.openGenericInfo('Error', 'Can\'t complete delivery operation because no set Client Name');
      }
    }, err => {
      this.cashService.openGenericInfo('Error', 'Can\'t complete delivery operation');
    });
  }

  getField(title, field, fieldType?: EFieldType): Observable<any> {
    return this.cashService.dialog.open(DialogFilterComponent,
    { width: '1024px', height: '600px', disableClose: true, data: {title: title + ' - ' + field,
        type: dataValidation(fieldType)}}).afterClosed();
  }

  getNumField(name, label, fieldType?: EFieldType, height = '650'): Observable<any> {
    return this.cashService.dialog.open(InputCcComponent,
      { width: '480px', height: height + 'px', data: {number: '', name: name, label: label,
          type: dataValidation(fieldType)}, disableClose: true }).afterClosed();
  }

  getPriceField(name, label) {
    return this.cashService.dialog.open(ProductGenericComponent,
      {
        width: '480px', height: '650px', data: {name: name, label: label, unitCost: 0.00},
        disableClose: true
      }).afterClosed();
  }

  getTotalField(totalToPaid: number) {
    return this.cashService.dialog.open(CashOpComponent,
      {
        width: '480px', height: '660px', data: totalToPaid, disableClose: true
      }).afterClosed();
  }

  openSwipeCredentialCard(title: string, content?: string) {
    return this.cashService.dialog.open(SwipeCredentialCardComponent, {
      width: '400px', height: '350px', data: {
        title: title ? title : 'Swipe card',
        content: content,
        pass: 'test'
      },
      disableClose: true,
      autoFocus: false
    }).afterClosed();
  }

  getOrderInfo()/*: Observable<Order>*/ {
    console.log('getOrderInfo', this.invoiceService.invoice.orderInfo); /*
    this.invoiceService.invoice.subscribe(next => console.log('Invoice', next));*/
    if (this.invoiceService.order && this.invoiceService.order.invoiceId === this.invoiceService.invoice.id) {
      this.showOrderInfo(this.invoiceService.order);
    } else {
      return this.cashService.getOrder(this.invoiceService.invoice.receiptNumber).subscribe(
        next => {
          console.log(next);
          this.invoiceService.order = next;
          this.showOrderInfo(this.invoiceService.order);
        },
        err => {
          console.error(err);
          this.cashService.openGenericInfo('Error', 'Can\'t complete get order operation');
        }
      );
    }
    this.resetInactivity(true);
  }

  showOrderInfo(order: Order) {
    // this.cashService.openGenericInfo(OtherOpEnum.ORDER_INFO, ETXType[order.type.type]);
    this.cashService.dialog.open(OrderInfoComponent,
      { width: '480px', height: '350px', data: {title: OtherOpEnum.ORDER_INFO, subtitle: ETXType[order.type.type],
          type: order.type}, disableClose: true });
  }

  notSale() {
    this.invoiceService.notSale().subscribe(d => {
        console.log('Open cash drawer.', d);
    });
    this.resetInactivity(true);
  }

  /*ebtInquiry() {
    console.log('EBT Inquiry');
    this.currentOperation = 'EBT Inquiry';

    if (this.invoiceService.invoice.total !== 0 || this.invoiceService.invoice.fsTotal !== 0) {
      this.invoiceService.ebtInquiry()
        .subscribe(data => {
          console.log(data);
          if(data.remainingBalance) {
            this.cashService.openGenericInfo('EBT Inquiry', 'Remaining balance:'+ data.remainingBalance,
              'Extra balance:'+ data.extraBalance);
            this.cashService.resetEnableState();
          } else {
            this.cashService.openGenericInfo('Error', 'Can\'t complete ebt inquiry operation');
            this.cashService.ebtEnableState();
          }
        },err => {
          console.log(err);
          this.cashService.openGenericInfo('Error', 'Can\'t complete ebt inquiry operation');
          this.cashService.resetEnableState()
        });
    }
    this.resetInactivity(false);
  }*/

  weightItem() {
    this.cashService.dialog.open(ProductGenericComponent,
      {
        width: '480px', height: '650px', data: {name: 'Weight Item', label: 'Price', unitCost: 0.00},
        disableClose: true
      }).afterClosed().subscribe(
      next => {
        console.log('weightItem', next);
        if (next) {
          this.setWeightedProduct(next['unitCost']);
        }
        /*if(next && !this.cashService.systemConfig.externalScale) {
          this.cashService.dialog.open(ProductGenericComponent,
            {
              width: '480px',
              height: '650px',
              data: {name: 'Set Weight', label: 'Weight (Lbs)', unitCost: 0},
              disableClose: true
            }).afterClosed().subscribe(
            next => {
              this.setWeightedProduct();
            });
          } else {
            this.setWeightedProduct();
          }*/
      });
    this.resetInactivity(true);
  }

  setWeightedProduct(price: number) {
    if (this.invoiceService.digits) {
      // Send scanned product to invoice
      this.invoiceService.getProductByUpc(EOperationType.WeightItem).subscribe(
        next => {
          console.log(next);
          next['unitCost'] = price;
          this.evAddProdByUPC.emit(next);
        },
        err => { this.cashService.openGenericInfo('Error', 'Can\'t get product by upc'); },
        () => this.invoiceService.resetDigits()
      );
    } else {
      // Send misc product to invoice
      // this.cashService.openGenericInfo('Information', 'Send misc product to invoice');
      if (!this.cashService.config.sysConfig.externalScale) {
        this.cashService.dialog.open(ProductGenericComponent,
          {
            width: '480px', height: '650px', data: {name: 'Weight', label: 'Weight (Lbs)', unitCost: 0}, disableClose: true
          }).afterClosed().subscribe( (data: any) => {
          if (data) {
            this.invoiceService.weightItem(price, data.unitCost).subscribe(
              i => {
                this.invoiceService.setInvoice(i);
              },
              err => {
                this.invoiceService.resetDigits();
                this.cashService.openGenericInfo('Error', 'Can\'t complete weight operation');
              }
            );
          } else {
            console.log('Weight not specified');
          }
        });
      } else {
        this.invoiceService.weightItem(price, 0).subscribe(
          i => {
            this.invoiceService.setInvoice(i);
          },
          err => {
            this.invoiceService.resetDigits();
            this.cashService.openGenericInfo('Error', 'Can\'t complete weight operation');
          });
      }
    }
  }

  splitCard() {
    if (this.invoiceService.invoice.balance) {
      this.cashService.dialog.open(ProductGenericComponent,
        {
          width: '480px', height: '650px', data: {
            unitCost: 0, name: OtherOpEnum.SPLIT_CARD, label: 'Amount',
            max: this.invoiceService.invoice.balance
          },
          disableClose: true
        }).afterClosed().subscribe(
        next => {
          console.log(next);
          if (next['unitCost'].toFixed(2) > this.invoiceService.invoice.balance) {
            this.cashService.openGenericInfo('Error', 'The spècified amount is superior to amount to pay');
          } else {
            this.setCreditCardType(next['unitCost'].toFixed(2));
          }
        },
        err => {console.error(err); });
    } else {
      this.cashService.openGenericInfo('Error', 'There is not amount to pay');
    }
    this.resetInactivity(true);
  }

  acctBalance() {
    console.log(CustomerOpEnum.ACCT_BALANCE);
    this.currentOperation = CustomerOpEnum.ACCT_BALANCE;
    this.clientService.getClients().subscribe(
      clients => {
        console.log(CustomerOpEnum.ACCT_BALANCE, clients);
        this.openDialogWithPag(clients, (c) => this.showAccountInfo(c), 'Clients', 'Select a client:',
          '', 'name', 'credit' );
      },
      error1 => {
        this.cashService.openGenericInfo(InformationType.INFO, 'Can\'t get the clients');
      }, () => this.currentOperation = '');
  }

  showAccountInfo(account: ClientModel) {
    const client = { client: { name: account['name'], address: account.address, telephone: account['telephone']}};
    const clientAccount = { balance: account.balance, credit: account.credit, creditLimit: account.creditLimit};
    this.cashService.dialog.open(OrderInfoComponent,
      { width: '480px', height: '450px', data: {title: CustomerOpEnum.ACCT_BALANCE, subtitle: account.accountNumber,
          type: client, account: clientAccount}, disableClose: true }).afterClosed().subscribe(
            next => {
              if (next.print) { this.printBalance(account.id); }
            }
    );
  }

  private showBalance(c: any) {
    this.cashService.openGenericInfo('Balance', 'The balance of client ' + c.name + ' is: $'
      + c.balance.toFixed(2));
  }

  private printBalance(clientId: string) {
    const dialog = this.cashService.openGenericInfo( InformationType.INFO, 'Printing balance');
    this.invoiceService.printAcctBalance(clientId).subscribe(
      next => {
        dialog.close();
        console.log('printBalance', next);
      }, err => {
          dialog.close();
          this.cashService.openGenericInfo(InformationType.ERROR, err);
      }
    );
  }

   acctCharge() {
    console.log(CustomerOpEnum.ACCT_CHARGE);
    this.clientService.getClients().subscribe(
      clients => {
        this.openDialogWithPag(clients, (c) => this.setAmount(CustomerOpEnum.ACCT_CHARGE,
            a => this.acctChargeOp(c.id, a)), 'Clients', 'Select a client:', null, 'name',
          'balance');
      },
      error1 => {
        this.cashService.openGenericInfo(InformationType.INFO, 'Can\'t get the clients');
        this.cashService.resetEnableState();

      }/*, () => this.currentOperation = ''*/);

  }

  private setAmount(titleOp: string, action: (i: any) => void) {
    this.getPriceField(titleOp + '. Total: ' +  this.getTotalToPaid().toFixed(2), 'Amount')
      .subscribe(
      amount => {
        console.log('setAmount', amount);
        action(amount.unitCost);
      }
    );
  }

  private setDescription(titleOp: string, action: (i: any) => void) {
    console.log('setDescription');
    this.getField(titleOp, 'Description', EFieldType.DESC)
      .subscribe(
        descrip => {
          console.log('setDescription', descrip);
          action(descrip.text);
        }
      );
  }

  private acctChargeOp(client, amount) {
    if (amount) {
      this.currentOperation = CustomerOpEnum.ACCT_CHARGE;
      this.invoiceService.acctCharge(client, amount).subscribe(
        next => {
          console.log('setAmount', next);
          (next && next.balance > 0) ? this.invoiceService.setInvoice(next) : this.invoiceService.createInvoice();
          this.cashService.resetEnableState();
        }, error1 => {
          console.error('setAmount', error1);
          this.cashService.openGenericInfo(InformationType.ERROR, error1);
          this.cashService.resetEnableState();
        }/*, () => this.cashService.resetEnableState()*/
      );
    } else {
      // this.cashService.openGenericInfo(InformationType.INFO, 'Can\'t charge account because the amount not was specified');
      // this.cashService.resetEnableState();
    }
  }

  acctPayment() {
    console.log(CustomerOpEnum.ACCT_PAYMENT);
    this.currentOperation = CustomerOpEnum.ACCT_PAYMENT;
    this.clientService.getClients().subscribe(
      clients => {
        this.openDialogWithPag(clients, (c) => this.selectPaymentType(c.id), 'Clients', 'Select a client:', 'name');
      },
      error1 => {
        this.cashService.openGenericInfo(InformationType.INFO, 'Can\'t get the clients');
      }, () => this.currentOperation = '');

  }

  transferPayment() {
    this.setAmount('TRANSFER', (a) => {
      this.setDescription('TRANSFER', (d) => this.paidByTransfer(a, d));
    });
  }

  paidByTransfer( amount: number, descrip: string) {
    this.currentOperation = PaymentOpEnum.TRANSFER;
    const dialogInfoEvents = this.openInfoEventDialog('Paying by ' + PaymentOpEnum.TRANSFER);
    this.invoiceService.paidByTransfer(amount, descrip).subscribe(data => {
        console.log('paidByTransfer', data);
        dialogInfoEvents.close();
        this.setOrCreateInvoice(data);
        this.cashService.resetEnableState();
      },
      err => {
        console.log(err);
        dialogInfoEvents.close();
        this.cashService.openGenericInfo(InformationType.ERROR, err);
        this.cashService.resetEnableState();
      });
  }

  private selectPaymentType(c?: string) {
    this.openDialogWithPag([{label: 'CARD'}, {label: 'CASH'}, {label: 'CHECK'}, {label: 'TRANSFER'}], i => {
      console.log(i);
        switch (i.label) {
          case 'CASH':
            this.setAmount(i.label, (a) => this.acctPaymentCashOp(c, a));
            break;
          case 'CARD':
            this.externalCardPayment(CustomerOpEnum.ACCT_PAYMENT, c);
            break;
          case 'CHECK':
            this.check(c);
            break;
          case 'TRANSFER':
            this.setAmount(i.label, (a) => this.setDescription(i.label, (d) => this.acctPaymentTransferOp(c, a, d)));
            break;
        }
      }, CustomerOpEnum.ACCT_PAYMENT,
      'Select a payment type', 'label');
  }

  acctPaymentCashOp(client: string, amount: number) {
    this.invoiceService.acctPaymentCash(client, amount).subscribe(
      next => {
        console.log('acctPaymentOp', next);
        this.cashService.openGenericInfo(InformationType.INFO, ' The account client (' + next['name']
          + ') was charged with ' + amount.toFixed(2));
      },
      error1 => {
        console.error(error1);
        this.cashService.openGenericInfo(InformationType.ERROR, error1);
      }
    );
  }

  check(client?: string) {
    const title = 'Check Payment';
    this.invoiceService.resetDigits();
    console.log(title);
    this.getPriceField(title + '. Total: ' +  this.getTotalToPaid().toFixed(2), 'Amount')
      .subscribe((amount) => {
        console.log('Amount', amount.unitCost);
        if (amount.unitCost) {
          this.getNumField(title, 'Check number', EFieldType.NUMBER).subscribe(checkNumber => {
            if (checkNumber.number) {
              this.getField(title, 'Description', EFieldType.DESC).subscribe(descrip => {
                this.paidByCheck(amount.unitCost, checkNumber.number, descrip.text, client);
              });
            } else {
              // this.cashService.resetEnableState();
            }
          });
        } else {
          // this.cashService.resetEnableState();
        }
      });
    this.resetInactivity(true);
  }

  private paidByCheck(amount: number, checkNumber: string, descrip?: string, client?: string) {
    const dialogInfoEvents = this.openInfoEventDialog('Paying by ' + PaymentOpEnum.CHECK);
    this.invoiceService.paidByCheck(amount, checkNumber, descrip, client).subscribe(
      next => {
        console.log('paidByCheck', next);
        dialogInfoEvents.close();
        this.currentOperation = PaymentOpEnum.CHECK;
        if (!client) {
          if (next && next.balance > 0) { this.invoiceService.setInvoice(next); } else if (next.change && next.change > 0) {
            this.paymentReturn(next.change).subscribe((result: any) => {
              (result.closeAutomatic) ?
                this.logoutOp() :
                this.invoiceService.createInvoice();
            });
          } else if (next.balance <= 0) {
            this.invoiceService.createInvoice();
          }
        } else {
          console.log('Check for Account Payment', next);
          this.cashService.openGenericInfo(InformationType.INFO, ' The account client (' + next['name']
            + ') was charged with ' + amount.toFixed(2));
        }
        this.cashService.resetEnableState();
      },
      error1 => {
        console.error('paidByCheck', error1);
        dialogInfoEvents.close();
        this.cashService.openGenericInfo('Error', error1);
        this.cashService.resetEnableState();
      }/*,
      () => this.cashService.resetEnableState()*/
    );
  }

  private acctPaymentTransferOp(client: string, amount: any, descrip: any) {
    this.invoiceService.acctPaymentTransfer(client, amount, descrip).subscribe(
      next => {
        console.log('acctPaymentTransferOp', next);
        this.currentOperation = PaymentOpEnum.TRANSFER;
        this.cashService.openGenericInfo(InformationType.INFO, ' The account client (' + next['name']
          + ') was charged with ' + amount.toFixed(2));
        this.cashService.resetEnableState();
      },
      error1 => {
        console.error(error1);
        this.cashService.openGenericInfo(InformationType.ERROR, error1);
        this.cashService.resetEnableState();
      }
    );
  }

  choosePAXConnType(op?: PaymentOpEnum) {
    const ccTypes = new Array<any>({value: 1, text: 'Online'}, {value: 2, text: 'Offline'});
    this.cashService.dialog.open(DialogDeliveryComponent,
      { width: '600px', height: '340px', data: {name: 'PAX Connection Types', label: 'Select a type', arr: ccTypes},
        disableClose: true })
      .afterClosed().subscribe(next => {
      console.log(next);
      switch (next) {
        case 1:
          // op === PaymentOpEnum.CREDIT_CARD ? this.credit() : this.debit();
          this.selectPaymentByOp(op);
          break;
        case 2:
          this.externalCardPayment();
          break;
        default:
          this.cashService.resetEnableState();
          this.resetTotalFromFS();
      }
    });
  }

  detectPAXConn(op?: PaymentOpEnum) {
    this.invoiceService.resetDigits();
    switch (this.cashService.config.sysConfig.paxConnType) {
      case PAXConnTypeEnum.BOTH:
        this.choosePAXConnType(op);
        break;
      case PAXConnTypeEnum.OFFLINE:
        op === PaymentOpEnum.EBT_CARD ? this.setEBTCardType() :
          this.externalCardPayment(undefined, undefined, op);
        break;
      case PAXConnTypeEnum.ONLINE:
        this.selectPaymentByOp(op);
        // op === PaymentOpEnum.CREDIT_CARD ? this.credit() : this.debit();
        break;
    }
  }

  selectPaymentByOp(op: PaymentOpEnum) {
    switch (op) {
      case PaymentOpEnum.CREDIT_CARD:
        this.credit();
        break;
      case PaymentOpEnum.DEBIT_CARD:
        this.debit();
        break;
      case PaymentOpEnum.EBT_CARD:
        this.setEBTCardType();
        break;
    }
  }

  setOtherPaymentType() {
    const ccTypes = new Array<any>(
      {value: PaymentMethodEnum.OTHER, text: 'Others'},
            {value: PaymentMethodEnum.TRANSFER, text: 'Transfer'},
            {value: PaymentMethodEnum.GIFT_CARD, text: 'Gift Card'}
      );
    if (!this.cashService.config.sysConfig.allowGiftCard) { ccTypes.splice(-1); }
    this.cashService.dialog.open(DialogDeliveryComponent, { width: '600px', height: '340px',
      data: {name: 'Other Payment Types', label: 'Select a type', arr: ccTypes},
      disableClose: true }).afterClosed().subscribe(next => {
      console.log(next);
        if (next !== '') {
          switch (next) {
            case PaymentMethodEnum.OTHER:
              this.cash(PaymentOpEnum.OTHER);
              break;
            case PaymentMethodEnum.TRANSFER:
              this.transferPayment();
              break;
            case PaymentMethodEnum.GIFT_CARD:
              this.giftCardPayment();
              break;
          }
        }
    });
  }

  giftCardPayment() {
    this.getTotalField(this.getTotalToPaid()).subscribe(
      amount => {
        console.log('giftCardPayment Amount', amount);
        if (amount) {
          this.cashService.disabledInput = false;
          this.openSwipeCredentialCard(PaymentOpEnum.GIFT_CARD, 'Swipe card')
            .subscribe(
              next => {
                console.log('Swipe card', next);
                if (next) {
                  const passwordByCard = (next) ? next.pass : this.initService.userScanned;
                  if (this.initService.userScanned) { this.initService.cleanUserScanned(); }
                  if (passwordByCard) { this.giftCardPaymentOp(amount, passwordByCard); }
                } else {
                  // this.cashService.resetEnableState();
                }
              }
            );
        } else {
          // this.cashService.resetEnableState();
        }
    });
  }

  giftCardPaymentOp(amount, cardPin) {
    this.currentOperation = PaymentOpEnum.GIFT_CARD;
    const opMsg = 'gift card payment';
    const dialogInfoEvents = this.cashService.openGenericInfo('Gift Card', 'Paying by gift card...',
      undefined, undefined, true);
    const $gift = this.invoiceService.paidByGift(amount, cardPin)
      .subscribe(data => {
          console.log(data);
          dialogInfoEvents.close();
          clearTimeout(timeOut);
          this.setOrCreateInvoice(data);
        },
        err => {
          console.log(err);
          dialogInfoEvents.close();
          clearTimeout(timeOut);
          this.cashService.openGenericInfo('Error', err);
          this.cashService.resetEnableState();
        }, () => {
          clearTimeout(timeOut);
          this.cashService.resetEnableState();
        });

    const timeOut = this.paxTimeOut($gift, dialogInfoEvents, opMsg);
  }

  private resetCurrentOperation() {
    if (this.currentOperation === TotalsOpEnum.SUBTOTAL &&
      this.invoiceService.invoice.status === InvoiceStatus.PENDENT_FOR_PAYMENT) {
      console.log('resetSubTotal');
      this.resetSubTotalState();
    }
    this.currentOperation = '';
  }

  changePriceOp(prod: Product) {
    this.cashService.dialog.open(ProductGenericComponent,
      {
        width: '480px', height: '650px', data: {name: 'Change Price', label: 'Price', unitCost: prod.unitCost.toFixed(2)},
        disableClose: true
      }).afterClosed().subscribe(
      next => {
        if (next) {
          this.invoiceService.updateProductsPrice(prod.upc, next.unitCost, prod.id).subscribe(next => {
              console.log(next);
              this.cashService.openGenericInfo('Information', 'The price of product ' +
                next['upc'] + ' was updated to ' + next['price'].toFixed(2))
                .afterClosed().subscribe(next => this.router.navigateByUrl('/cash/dptos', { replaceUrl: true }));
            },
            err => {
              this.cashService.openGenericInfo('Error', 'Can\'t change price of this product ' + prod.upc);
            },
            () => {
              this.currentOperation = '';
              this.evCleanAdminOperation.emit();
              this.cashService.resetEnableState();
            });
        }
      });
  }

  changeProductOp(item: Product | Department) { 
    this.changeItemOp(item).subscribe(next => {
        console.log(next);
        this.cashService.openGenericInfo('Information', 'The color of ' +
          next['name'] + ' was updated to ' + next['color'].toUpperCase())
          .afterClosed().subscribe(next => this.router.navigateByUrl('/cash/dptos', { replaceUrl: true }));
      },
      err => {
        this.cashService.openGenericInfo('Error', 'Can\'t change color');
      },
      () => {
        this.currentOperation = '';
        this.evCleanAdminOperation.emit();
        this.cashService.resetEnableState();
        this.invoiceService.resetDigits();
      });
  }

  changeItemOp(item: Product | Department): Observable<any> {
    return item['upc'] ? this.invoiceService.updateProductsColor(item['upc'], item.color, item.id):
      this.invoiceService.updateDepartmentColor(item.color, item.id)
  }

}

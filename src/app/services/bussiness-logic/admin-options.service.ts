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
import {EFieldType} from "../../utils/field-type.enum";
import {Observable} from "rxjs";
import {EmployeedModel, IPositionModel} from "../../models/employeed.model";
import {EbtInquiryInfoComponent} from "../../components/presentationals/ebt-inquiry-info/ebt-inquiry-info.component";
import {ClientModel} from "../../models/client.model";
import {InformationType} from "../../utils/information-type.enum";
import {InitViewService} from "./init-view.service";
import {CustomerOpEnum} from "../../utils/operations/customer.enum";
import {ClientService} from "./client.service";
import {CloseBatchComponent} from "../../components/presentationals/close-batch/close-batch.component";

@Injectable({
  providedIn: 'root'
})
export class AdminOptionsService {
  private cancelCheckLoaded: boolean;
  private removeHoldLoaded: boolean;
  currentOperation: AdminOpEnum | string;

  constructor(private invoiceService: InvoiceService, public cashService: CashService, public auth: AuthService,
              private operationService: OperationsService, private dataStorage: DataStorageService,
              private initService: InitViewService, private clientService: ClientService, private router: Router) {

    this.operationService.evCancelCheck.subscribe(next => {
      next ? this.cancelCheck(): this.cancelCheckLoaded=false;
    });

    this.operationService.evRemoveHold.subscribe(next => {
      this.removeHoldLoaded=false;
    });

    this.operationService.evCleanAdminOperation.subscribe(next => {
      this.currentOperation='';
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
        case 2:
          this.applyDiscount(EApplyDiscount.AMOUNT);
          break;
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
          if(type === EApplyDiscount.AMOUNT ){
            data = (data['unitCost']) ? Number(data['unitCost']).toFixed(2) : 0;
            if((this.invoiceService.invoiceProductSelected.length < this.invoiceService.invoice.productOrders.length)
              && (this.invoiceService.invoiceProductSelected.length > 1)){
              this.cashService.openGenericInfo('Information', 'Discount by amount only can apply for a ' +
                'product or full invoice');
            } else {
              this.applyDiscountOp(data, type);
            }
          } else {
            this.applyDiscountOp(data, type);
          }
        });
    /*} else {
      this.cashService.openGenericInfo('Error', 'Can\'t apply discount without products')
    }*/

  }

  applyDiscountOp(data, type: EApplyDiscount){
    this.invoiceService.applyDiscountInvoice(data, type).subscribe(next => {
      this.invoiceService.setInvoice(next);
      this.invoiceService.invoiceProductSelected.splice(0);
    }, err => {
      //this.cashService.openGenericInfo('Error', 'Can\'t apply discount');
      this.cashService.openGenericInfo('Error', err);
    })
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
      next.unshift({id: "-1", userName: "ALL"});
      /*this.cashService.dialog.open(GenericSalesComponent,
        {
          width: '480px', height: '640px', disableClose: true, data: {title: AdminOpEnum.EMPLZ, empl: next }
        })*/
      this.operationService.openDialogWithPag(next, (e)=> this.showSalesByEmployee(e), 'Employees',
        'Select a employee:','', 'userName' );
    }, error1 => {
      this.cashService.openGenericInfo('Error', 'Can\'t complete '+ AdminOpEnum.EMPLZ +' operation')
    });
  }

  showSalesByEmployee(emp: any){
    console.log('showSalesByEmployee', emp);
    this.cashService.dialog.open(GenericSalesComponent,
      {
        width: '480px', height: '640px', disableClose: true, data: {title: AdminOpEnum.EMPLZ, empl: emp }
      })
  }

  systemVersion() {
    this.cashService.openGenericInfo('System Version', environment.version);
  }

  backToUser() {
    console.log('backUser', this.auth.token, this.auth.initialLogin);
    if(this.auth.initialLogin){
      this.auth.restoreInitialLogin();
      this.router.navigateByUrl('/cash/dptos');
      this.invoiceService.getCashier();
      this.invoiceService.setUser(this.invoiceService.getUserId()).subscribe(
        next => console.log(this.invoiceService.cashier + ' was assigned to the invoice ' + next.receiptNumber),
        error1 => this.cashService.openGenericInfo(InformationType.ERROR,
          'Can\'t be assigned the user '+ this.invoiceService.cashier +' to invoice'));
    } else {
      //this.cashService.openGenericInfo('Information', 'Any user was logged previously')
      this.router.navigateByUrl('/cash/dptos');
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
    this.cashService.dialog.open(CloseBatchComponent,
      {
        width: '750px', height: '600px', disableClose: true, data: {title: AdminOpEnum.CLOSE_BATCH}
      }).afterClosed().subscribe(
        next => {
          if(next){
            console.log('closeBatch', next);
            this.dataStorage.closeBatch(next).subscribe(
            next => console.log('closeBatch', next),
            err => this.cashService.openGenericInfo('Error','Can\'t complete close batch operation'))
          };
        },err=> console.error(err));
  }

  closeDay(){
    this.dayCloseType('', AdminOpEnum.WTDZ);
  }

  dayCloseType(emp?: string, op?: AdminOpEnum){
    let dayCloseTypes= new Array<any>({value: 1, text: 'Print'}, {value: 2, text: 'Close'});
    let title = emp ? 'Cashier' : 'Day';
    this.cashService.dialog.open(DialogDeliveryComponent,
      { width: '600px', height: '340px', data: {name: 'Close Types', label: 'Select a type', arr: dayCloseTypes},
        disableClose: true })
      .afterClosed().subscribe(next => {
      console.log(next);
      switch (next) {
        case 1:
          this.dayClosePrint(emp, op, title);
          break;
        case 2:
          this.confirmDayClose(emp, op, title);
          break;
      }
    });
  }

  doDayClose(emp?: string, op?: AdminOpEnum) {
    this.cashService.dayCloseEnableState();
    let dialogEv = this.cashService.openGenericInfo('Information', 'Closing '+ (emp ? 'cashier' : 'day')
      +'...', undefined, undefined, true);

    this.dataStorage.dayClose(emp).subscribe(
      next => {
        console.log(op);
        dialogEv.close();
        this.cashService.openGenericInfo(emp ? 'Cashier' : 'Day' +' Close', 'Complete '+op.toLowerCase()+' operation');
      },
      err => {
        dialogEv.close();
        this.cashService.openGenericInfo('Error', 'Can\'t complete '+ op.toLowerCase()+' operation');
        this.cashService.resetEnableState();
      },
      () => {
        dialogEv.close();
        this.cashService.resetEnableState();
      }
    );
  }

  dayClosePrint(emp?: string, op?: AdminOpEnum, title?: string) {
    this.cashService.dayCloseEnableState();
    this.dataStorage.dayClosePrint(emp).subscribe(
      next => {
        console.log(op);
        this.cashService.openGenericInfo(title +' Close Print', 'Complete '+op.toLowerCase()+' operation');
      },
      err => {
        this.cashService.openGenericInfo('Error', 'Can\'t complete '+
          op.toLowerCase()+' print operation');
        this.cashService.resetEnableState();
      },
      () => {
        this.cashService.resetEnableState();
      }
    );
  }

  confirmDayClose(emp?: string, op?: AdminOpEnum, title?: string){
    this.cashService.openGenericInfo(title + ' Close', 'Do you want close?', '', true)
      .afterClosed().subscribe(next => {
      console.log('confirmDayClose', next);
      if(next){
        this.doDayClose(emp, op);
      }
    }, err => {
      this.cashService.openGenericInfo('Error', 'Can\'t complete '+ op +' operation');
    });
  }

  cashierCloseShift(){
    this.getEmployees( false,i => {
      console.log('getEmployees', i);
      this.operationService.openDialogWithPag(i, (e)=> this.dayCloseType(e.id, AdminOpEnum.CCSZ), 'Employees',
        'Select a employee:','', 'userName' );
    });
  }

  getEmployees(allUsers: boolean, action: any){
    this.dataStorage.getApplicationUsers().subscribe(next =>  {
      console.log('getEmployees', next);
      if(allUsers) next.unshift({id: "-1", userName: "All employees"});
      action(next);
    }, error1 => {
      this.cashService.openGenericInfo('Error', 'Can\'t get the employees')
    });
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

  changePrice() {
    console.log('priceCheck');
    /*(this.currentOperation !== AdminOpEnum.CHANGE_PRICES) ? this.currentOperation = AdminOpEnum.CHANGE_PRICES:
      this.currentOperation = "";*/
    this.currentOperation = AdminOpEnum.CHANGE_PRICES;
    if(this.invoiceService.digits){
      this.doChangePrice();
    } /*else if (this.currentOperation !== AdminOpEnum.CHANGE_PRICES) {
      this.cashService.disabledInputKey = true;
      this.operationService.getField('Enter UPC Number', 'Change Prices').subscribe(
        next => {
          console.log('change price by upc', next);
          if(next.text){
            this.invoiceService.numbers = next.text;
            this.doChangePrice();
          }
        }, error1 => {}, () => this.cashService.disabledInputKey = false
      )
    }*/
  }

  doChangePrice(){
    this.invoiceService.getProductByUpc(EOperationType.PriceCheck).subscribe(prods => {
      this.operationService.selectProd(prods).subscribe( prod => {
        if(prod) {
          this.cashService.openGenericInfo('Change Price', 'Do you want change the price of the '+prod.name,
            prod.unitCost, true)
            .afterClosed().subscribe(next => {
            console.log(next);
            if(next !== undefined && next.confirm ) {
              this.cashService.dialog.open(ProductGenericComponent,
                {
                  width: '480px', height: '650px', data: {name: 'Change Price', label: 'Price', unitCost: prod.unitCost.toFixed(2)},
                  disableClose: true
                }).afterClosed().subscribe(
                next => {
                  if(next){
                    this.invoiceService.updateProductsPrice(prod.upc, next.unitCost, prod.id).subscribe(next => {
                        console.log(next);
                        this.cashService.openGenericInfo('Information', 'The price of product '+
                          next['upc'] + ' was updated to '+ next['price'].toFixed(2));
                      },
                      err => {
                        this.cashService.openGenericInfo('Error', 'Can\'t change price of this product '+prod.upc);
                      });
                  }
                });
            }
          });
        } else {
          this.invoiceService.resetDigits();
        }
      });
    }, err => {
      this.cashService.openGenericInfo('Error', 'Can\'t found this product ' + this.invoiceService.digits);
    }, () =>  {
      this.invoiceService.resetDigits();
      this.currentOperation = "";
    });
  }

  splitName(fullname: string, employee: EmployeedModel){
    let splitFN = fullname.trim().split(" ");
    employee.firstname = splitFN[0];
    if(splitFN.length > 1){
      employee.lastname = splitFN[splitFN.length - 1];
      employee.username = employee.firstname.substr(0,3) + employee.lastname;
    } else if (splitFN.length === 1){
      employee.username = employee.firstname;
    }
    return employee;
  }

  employSetup() {
    let employee = new EmployeedModel();
    this.operationService.getField(AdminOpEnum.EMPLOYEE_SETUP, 'Name', EFieldType.NAME).subscribe(
      name => {
        if(name){
          employee = this.splitName(name.text, employee);
          this.getUsersPosition().subscribe(
            positions => {
              console.log(AdminOpEnum.EMPLOYEE_SETUP, positions);
              this.showUsersPosition(<IPositionModel[]> positions).subscribe(positionSelected => {
                console.log('dialog delivery', positionSelected);
                if (positionSelected) {
                  employee.userPositionId = positionSelected.id;
                  this.operationService.getNumField(AdminOpEnum.EMPLOYEE_SETUP, 'Password', EFieldType.PASSWORD)
                    .subscribe(
                      code => {
                        if (code) {
                          employee.password = code.number;
                          this.operationService.openSwipeCredentialCard('Password card', 'Swipe password card')
                            .subscribe(
                              next => {
                                console.log('Swipe password card', next);
                                employee.passwordByCard = (next) ? next.pass : this.initService.userScanned;
                                this.initService.cleanUserScanned();
                                employee.companyId = 1;
                                console.log(AdminOpEnum.EMPLOYEE_SETUP, employee);
                                this.dataStorage.employSetup(employee).subscribe(
                                  next => {
                                    console.log(AdminOpEnum.EMPLOYEE_SETUP, next);
                                    this.cashService.openGenericInfo(InformationType.INFO, 'The employee '+ next.userName +' was setup.')
                                  },
                                  err => { this.cashService.openGenericInfo("Error",err); }
                                );

                              }, err => { console.error(err)}, () => console.log('complete', this)
                          )
                        }
                        else {
                          this.cashService.openGenericInfo("Error",
                            "Can't setup the employee because no was specified the code");
                        }
                      });
                } else {
                  this.cashService.openGenericInfo("Error", "Can't setup the employee because no was" +
                    " selected the position");
                }
              });
            },
            error1 => {
              this.cashService.openGenericInfo("Error", "Can't get users positions");
            }
          );
        } else {
          this.cashService.openGenericInfo("Error", "Can't setup the employee because no was" +
            " selected the name");
        }
      });
  }

  employSetupOp(employee: EmployeedModel){
    this.dataStorage.employSetup(employee).subscribe(
      next => {
        console.log(AdminOpEnum.EMPLOYEE_SETUP, next);
        this.cashService.openGenericInfo(InformationType.INFO, 'The employee '+ next.userName +' was setup.')
      },
      err => { this.cashService.openGenericInfo("Error","Can't setup the employee"); }
    );
  }

  getUsersPosition(): Observable<any> {
    return this.dataStorage.getUsersPosition();
  }

  showUsersPosition(positions: Array<IPositionModel>){
    return this.cashService.dialog.open(DialogInvoiceComponent,
      {
        width: '780px',
        height: '660px',
        data: {invoice: positions, detail: 'name', title: 'Work position', subtitle: 'Select a position'}
        ,
        disableClose: true
      }).afterClosed();
  }

  ebtInquiry() {
    console.log('EBT Inquiry');
    //this.currentOperation = 'EBT Inquiry';
    if (this.invoiceService.invoice.total !== 0 || this.invoiceService.invoice.fsTotal !== 0) {
      this.invoiceService.ebtInquiry()
        .subscribe(data => {
          console.log(data);
          if(data) {
            this.cashService.dialog.open(EbtInquiryInfoComponent, {
              width: '360px', height: '320px', disableClose: true, data: {title: AdminOpEnum.EBT_INQUIRY, content: data }
            });
            this.cashService.resetEnableState();
          } else {
            this.cashService.openGenericInfo('Error', 'Can\'t complete ebt inquiry operation');
            this.cashService.ebtEnableState();
          }
        },err => {
          console.log(err);
          //this.cashService.openGenericInfo('Error', 'Can\'t complete ebt inquiry operation');
          this.cashService.openGenericInfo('Error', err);
          this.cashService.resetEnableState()
        });
    }
    //this.resetInactivity(false);
  }

  chargeAccountSetup() {
    let client;
    this.operationService.getField(AdminOpEnum.CHARGE_ACCT_SETUP, 'Name', EFieldType.NAME).subscribe(
      name => {
        if(name){
          //employee.username = name.text;
          this.operationService.getNumField(AdminOpEnum.CHARGE_ACCT_SETUP, 'Credit Limit', EFieldType.NUMBER)
            .subscribe(
              credit => {
                if (credit) {
                  client = new ClientModel(name.text, credit.number);
                  this.operationService.getField(AdminOpEnum.CHARGE_ACCT_SETUP, 'Address', EFieldType.ADDRESS).subscribe(
                    address => {
                      if(address) client.address = address.text;
                      this.operationService.getNumField(AdminOpEnum.CHARGE_ACCT_SETUP, 'Phone', EFieldType.PHONE).subscribe(
                        phone => {
                          if(phone) client.phone = phone.number;
                          this.operationService.getField(AdminOpEnum.CHARGE_ACCT_SETUP, 'Company', EFieldType.NAME).subscribe(
                            company => {
                              if(company) client.company = company.text;
                              this.dataStorage.clientSetup(client).subscribe(
                                next => {
                                  console.log(AdminOpEnum.CHARGE_ACCT_SETUP, next);
                                  this.cashService.openGenericInfo('Information', 'Charge account setup operation succesfull');
                                },
                                err => {
                                  this.cashService.openGenericInfo("Error", "Can't setup the charge account");
                                }
                              );
                            });
                        });
                    });
                }
                else {
                  this.cashService.openGenericInfo("Error",
                    "Can't setup the charge account because no was specified the credit limit");
                }
              });
        } else {
          this.cashService.openGenericInfo("Error", "Can't setup the charge account because no was" +
            " specified the name");
        }
      });
  }

  updateCreditLimit() {
    console.log(AdminOpEnum.CREDIT_LIMIT);
    this.currentOperation = AdminOpEnum.CREDIT_LIMIT;
    this.clientService.getClients().subscribe(
      clients=> {
        console.log(CustomerOpEnum.ACCT_BALANCE, clients);
        this.operationService.openDialogWithPag(clients, (c)=> this.setCreditLimit(c), 'Clients', 'Select a client:',
          '', 'name','creditLimit' );
      },
      error1 => {
        this.cashService.openGenericInfo(InformationType.INFO, 'Can\'t get the clients');
      }, () => this.currentOperation = '');
  }

  private setCreditLimit(c: any) {
    this.operationService.getPriceField(AdminOpEnum.CREDIT_LIMIT, 'Amount').subscribe(
      credit => {
        console.log('setCredit', c, credit);
        if(credit) {
          this.dataStorage.updateCreditLimit(c.id, credit.unitCost).subscribe(
            next => {
              console.log('updatedCredit', next);
              this.cashService.openGenericInfo('Credit Limit', 'The credit limit of client '+ c.name +
                ' is: $' + next.creditLimit.toFixed(2));
            }, err => this.cashService.openGenericInfo(InformationType.ERROR, err)

          );
        }
      }
    )
  }

  refundSale() {
    this.dataStorage.refundSale(this.invoiceService.invoice.receiptNumber).subscribe(
      next => {
        console.log('refundSale', next);
        this.invoiceService.setInvoice(next);
      }, err => this.cashService.openGenericInfo(InformationType.ERROR, err)

    )
  }

  weeklyClose(op) {
    this.cashService.dayCloseEnableState();
    //let dialogEv = this.cashService.openGenericInfo('Information', 'Closing week...');

    this.dataStorage.weeklyClosePrint(true).subscribe(
      next => {
        this.cashService.openGenericInfo('Weekly Close Print', 'Completed '+op.toLowerCase()+' operation');
      },
      err => {
        this.cashService.openGenericInfo('Error', 'Can\'t complete '+
          op.toLowerCase()+' print operation');
        this.cashService.resetEnableState();
      },
      () => {
        this.cashService.resetEnableState();
      }
    );
  }
}

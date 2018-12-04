import { Component, OnInit } from '@angular/core';
import {FinancialOpService} from "../../services/financial-op.service";
import {ProductsService} from "../../services/products.service";
import { MatDialog } from '@angular/material';
import { DialogInvoiceComponent } from '../dialog-invoice/dialog-invoice.component';
import {holdOrders} from "../../shared/hold-orders";
import {Observable} from "rxjs/index";
import {Order} from "../../models/order.model";
import {LoginComponent} from "../login/login.component";
import {LoginData} from "../../shared/login-data";
import {Invoice} from "../../models/invoice.model";
import {map} from "rxjs/operators";
import {GenericInfoModalComponent} from "../generic-info-modal/generic-info-modal.component";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-financial-op',
  templateUrl: './financial-op.component.html',
  styleUrls: ['./financial-op.component.css']
})
export class FinancialOpComponent implements OnInit {
  operations = ["Manager Screen", "Reprint", "Hold Order", "Review Check", "Recall Check",
    "Refund", "Logout"];
  loginData: LoginData;

  constructor(private finService: FinancialOpService, public dialog: MatDialog,
              private route: ActivatedRoute, private router: Router) {  }

  ngOnInit() {
  }

  selectOperation(op) {
    switch (op) {
      case "Hold Order": {
        if (this.finService.getProducts().length> 0) {
          this.finService.holdOrder(this.finService.actualOrderId).
          subscribe(result => this.successHoldOrder(result), error1 => this.errorHoldOrder (error1));
        } else {
          console.error('Not possible Hold Order without products this Invoice');
          this.openGenericInfo("Error", "Not possible Hold Order without products in this Invoice")
        }
        break;
      } case "Manager Screen": {
        this.openDialogLogin();
        break;
      } case "Recall Check": {
        if (this.finService.getProducts().length == 0) {
          let digits = this.finService.getDigits();
          console.log("Recall", digits);
          if (digits) {
            this.getOrderById(digits).subscribe(inv => {
              console.log(inv);
              this.setOrder(inv);
            }, error1 => console.log(error1));
          } else {
            this.openDialogHoldOrders();
          }
        } else {
          console.error('Not possible Recall Check with products selected in this Invoice');
          this.openGenericInfo("Error", "Not possible Recall Check with products selected in this Invoice")
        }
        break;
      } case "Logout": {
          this.router.navigateByUrl('/login');
          break;
      }
    }
  }

  successHoldOrder(resp: any) {
      console.log(resp)
      this.finService.createOrder();
  }

  errorHoldOrder(e) {
      console.log(e);
      this.openGenericInfo("Error", "Can't complete hold order operation")
  }

  openDialogHoldOrders() {
    this.finService.recall().subscribe(inv => {
      if (inv.length > 0) {
        // let data = inv.map(i => new DialogData(i.receiptNumber, i.total));
        const dialogRef = this.dialog.open(DialogInvoiceComponent,
          {
            width: '700px', height: '450px', data: inv
          });
        dialogRef.afterClosed().subscribe(orderId => {
          console.log('The dialog was closed', orderId);
          // this.setOrder(this.getOrderById(parseInt(orderId)));
          if(orderId) this.finService.setOrder(orderId);
        });
      } else {
        this.openGenericInfo('Information', 'Not exist hold orders');
      }
    });

  }

  openDialogLogin() {
    // this.loginData = new LoginData("Manager");
    const dialogRef = this.dialog.open(LoginComponent,
      {
        width: '480px', height: '650px'/*, data: this.loginData*/
      });

    dialogRef.afterClosed().subscribe(loginValid => {
      console.log('The dialog was closed', loginValid);
      if(loginValid) {
        this.finService.setUsername(loginValid);
      }
    });
  }

  openGenericInfo(title: string, content?: string) {
    // this.loginData = new LoginData("Manager");
    const dialogRef = this.dialog.open(GenericInfoModalComponent,
      {
        width: '300px', height: '220px', data: {title: title ? title: 'Information', content: content}
      });

    dialogRef.afterClosed().subscribe(loginValid => {
      console.log('The dialog was closed', loginValid);
    });
  }

  getOrderById(id): Observable<Invoice> {
    return this.finService.recallByOrder(id);
  }

  setOrder(order:Invoice) {
    if(order) {
        console.log("recall", order);
        this.finService.setOrder(order);
    } else {
        alert("The specified order not is holded");
    }
  }

}

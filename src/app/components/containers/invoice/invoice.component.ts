import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {InvoiceService} from '../../../services/bussiness-logic/invoice.service';
import {AgGridComponent} from '../../presentationals/ag-grid/ag-grid.component';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {ProductOrder} from '../../../models/product-order.model';

@Component({
  selector: 'invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit, OnDestroy {
  @ViewChild('productstable') productstable: AgGridComponent;
  prodOrders: ProductOrder[];
  cashier: string;
  subtotal = 0;
  tax = 0;
  total = 0;
  fsSubtotal = 0;
  fsTax = 0;
  fsTotal = 0;
  balance = 0;
  subscription: Subscription [] = [];
  isClientView = (route: string) => (route.startsWith('/client') ? true : false);

  constructor(public invoiceService: InvoiceService, private router: Router) {
    console.log('invoice', invoiceService);
    this.subscription.push(this.invoiceService.evNumpadInput.subscribe(num => this.setDigits(num)));
    // this.subscription.push(this.invoiceService.evAddProd.subscribe(num => this.resetDigits()));
    this.subscription.push(this.invoiceService.evDelProd.subscribe(() => this.resetDigits()));
    this.subscription.push(this.invoiceService.evUpdateTotals.subscribe(() => this.updateTotals()));
  }

  ngOnInit() {
    /*if(this.isClientView(this.router.url) && this.invoiceService.invoice){
      this.invoiceService.setTotal();
      //this.productstable.products = this.invoiceService.invoice.productOrders;
      //this.invoiceService.evUpdateProds.emit(this.invoiceService.invoice.productOrders);
      this.prodOrders = this.invoiceService.invoice.productOrders;
    } else {*/
    /*(this.invoiceService.invoice)?
      this.invoiceService.setInvoice(this.invoiceService.invoice):*/
      this.cashier = this.invoiceService.getCashier();
      this.invoiceService.getStationStatus();
      this.invoiceService.createInvoice();
    // }
  }

  updateTotals() {
    this.subtotal = this.invoiceService.invoice.subTotal;
    this.tax = this.invoiceService.invoice.tax;
    this.total = this.invoiceService.invoice.total;

    this.fsTotal = this.invoiceService.invoice.fsTotal ? this.invoiceService.invoice.fsTotal : 0;
  }

  setDigits(number) {
    console.log('number', number, this.invoiceService.digits, this.invoiceService.qty, this.invoiceService.numbers );
    if (number !== "@/FOR") {
      // this.showDigits = true;
      // console.log(this.prodService.digits, this.prodService.qty, val.value );
      this.invoiceService.digits += number.toString();
      this.invoiceService.numbers = this.invoiceService.numbers + number.toString();
    } else {
      if (this.invoiceService.qty === 1) { this.invoiceService.qty = +this.invoiceService.numbers; }
      this.invoiceService.digits += ' @ ';
      this.invoiceService.numbers = '';
    }
  }

  resetDigits() {
    // console.log('resetDigits');
    this.invoiceService.resetDigits();
  }

  ngOnDestroy(){
    this.subscription.map(sub => sub.unsubscribe());
  }
}

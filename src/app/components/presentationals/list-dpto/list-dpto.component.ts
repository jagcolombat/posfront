import {Component, OnInit} from '@angular/core';
import {Department} from '../../../models/department.model';
import {StockService} from "../../../services/bussiness-logic/stock.service";
import {Router} from "@angular/router";
import {EOperationType} from "../../../utils/operation.type.enum";
import {leaveFocusOnButton} from "../../../utils/functions/functions";
import {DialogFilterComponent} from "../../containers/dialog-filter/dialog-filter.component";
import {InformationType} from "../../../utils/information-type.enum";
import {EDepartmentType} from "../../../utils/department-type.enum";

@Component({
  selector: 'list-dpto',
  templateUrl: './list-dpto.component.html',
  styleUrls: ['./list-dpto.component.scss']
})
export class ListDptoComponent implements OnInit {
  dptos: Department[] = [];
  subDept: boolean;
  page = 1;
  sizePage = 20;

  constructor(private router: Router, public stockService: StockService) {
    this.sizePage = this.stockService.getStockCountItems();
    console.log(this.sizePage);
  }

  ngOnInit() {
    this.getDepartments(() => this.setDeptPage());
  }

  doAction(ev, dpto: Department) {
    console.log('doAction', dpto);
    leaveFocusOnButton(ev);
    if (dpto.generic) {
      this.getGenericProdByDpto(dpto);
    } else if (dpto.departmentType === EDepartmentType.PARENT){
      this.getChildrenDept(dpto.id);
    } else {
      this.router.navigateByUrl('/cash/products/' + dpto.id + '/' + dpto.tax);
    }
    this.stockService.operationService.resetInactivity(true, 'select dept');
  }

  getDepartments(action?: any){
    this.stockService.getDepartments().subscribe(dptos => {
      this.stockService.productOrderService.departments = this.dptos = dptos;
      action();
    }, error1 => {
      this.stockService.utils.openGenericInfo(InformationType.ERROR, error1);
    });
  }

  setDeptPage(page?: number){
    this.page = page ? this.stockService.actualPage = page : this.stockService.actualPage;
  }

  getGenericProdByDpto(dpto: Department) {
    this.stockService.getProductsByDepartment(dpto.id).subscribe(
      prods => {
        let prodsFiltered = prods.filter(p => p.name === dpto.name);
        prodsFiltered.length > 0 ?
          prodsFiltered.map(pg => this.stockService.changePriceOrAddProduct(pg)):
          this.stockService.cashService.openGenericInfo(InformationType.INFO, 'Generic product not found');
      });
  }

  private getChildrenDept(id: string) {
    console.log('getChildrenDept', id);
    this.stockService.getSubDeptByDepartment(id).subscribe(
      subDepts => {
        console.log('getSubDeptByDepartment', subDepts);
        this.dptos = [...subDepts];
        this.stockService.productOrderService.departments = [...subDepts];
        this.subDept = true;
      });
  }

  backParentDepts(){
    this.getDepartments(()=> {
      this.setDeptPage(1);
      this.subDept = false;
    });
  }

  setPage(ev){
    if(ev > this.page){
      this.stockService.setOperation(EOperationType.PageNext, 'Stock Departments', 'Departments: ' + ev);
    } else {
      this.stockService.setOperation(EOperationType.PagePrevious, 'Stock Departments', 'Departments: ' + ev);
    }
    this.page = this.stockService.actualPage = ev;
  }

  filter() {
    this.stockService.cashService.dialog.open(DialogFilterComponent, { width: '1024px', height: '600px', disableClose: true})
      .afterClosed()
      .subscribe(next => {
        if (next && next.text) {
          console.log('filterDialog', next);
          this.stockService.getProductsByFilter(next.text).subscribe(prods => {
            this.stockService.productsFiltered.splice(0);
            Object.assign(this.stockService.productsFiltered, prods);
            this.router.navigateByUrl('/cash/filteredproducts/' + next.text);
          }, err => {
            this.stockService.cashService.openGenericInfo('Error', 'Not match any products with ' +
              'the specified filter');
          });
        }
      });
    this.stockService.operationService.resetInactivity(true, 'Filter Dept');
  }
}

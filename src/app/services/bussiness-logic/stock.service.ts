import {Injectable} from '@angular/core';
import {DataStorageService} from "../api/data-storage.service";
import {Observable} from "rxjs";
import {Department} from "../../models/department.model";
import {Product} from "../../models";
import {ProductOrderService} from "./product-order.service";
import {EOperationType} from "../../utils/operation.type.enum";
import {CashService} from "./cash.service";
import {environment as env} from "../../../environments/environment";
import {OperationsService} from "./operations.service";
import {StockOpEnum} from "../../utils/operations/stock-op.enum";
import {AdminOpEnum} from "../../utils/operations/admin-op.enum";
import {UtilsService} from "./utils.service";

@Injectable({
  providedIn: 'root'
})
export class StockService {

  public env = env;
  actualPage: number;
  productsFiltered = new Array<any>();

  constructor(private dataStore: DataStorageService, public productOrderService: ProductOrderService,
              public cashService: CashService, public operationService: OperationsService, public utils: UtilsService) {
    this.cashService.evResetStock.subscribe(ev => this.resetStock(ev));
  }

  getDepartments(): Observable<Department[]> {
    return this.dataStore.getDepartments();
  }

  getSubDeptByDepartment(id: string): Observable<Department[]> {
    return this.dataStore.getSubDepartments(id);
  }

  getProductsByDepartment(id: string, pageNumber?: number, pageSize?: number): Observable<Product[]> {
    return this.dataStore.getProductsByDepartment(id, pageNumber, pageSize);
  }

  getProductsByFilter(filter: string, pageNumber?: number, pageSize?: number): Observable<Product[]> {
    this.operationService.resetInactivity(true, 'Filter Prod');
    return this.dataStore.getProductsByUpc(filter, EOperationType.List, pageNumber, pageSize);
  }

  setOperation(typeOp: EOperationType, entity: string, desc: string){
    this.dataStore.registryOperation({operationType: typeOp, entityName: entity, description: desc}).subscribe(
      next => console.log('OperationService.setOperation', next),
      error1 => console.error('OperationService.setOperation', error1)
    );
    this.operationService.resetInactivity(true, entity);
  }

  getStockCountItems() {
    console.log(env.screenH);
    return (Math.floor((env.screenH/2)/100)*4);
  }

  addProduct(p: Product){
    this.operationService.currentOperation = StockOpEnum.ADD_PROD;
    this.productOrderService.addProduct(p);
  }

  changePriceOrAddProduct(prod: Product){
    (this.cashService.config.sysConfig.changePriceBySelection &&
      this.operationService.currentOperation === AdminOpEnum.CHANGE_PRICES) ?
      this.operationService.changePriceOp(prod) : this.addProduct(prod);
  }


  private resetStock(ev: any) {
    this.actualPage = 1;
  }
}

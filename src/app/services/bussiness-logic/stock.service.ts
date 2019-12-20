import {Injectable} from '@angular/core';
import {DataStorageService} from "../api/data-storage.service";
import {Observable} from "rxjs";
import {Department} from "../../models/department.model";
import {Product} from "../../models";
import {ProductOrderService} from "./product-order.service";
import {EOperationType} from "../../utils/operation.type.enum";
import {CashService} from "./cash.service";
import {environment as env} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class StockService {

  public env = env;
  actualPage: number;
  productsFiltered = new Array<any>();

  constructor(private dataStore: DataStorageService, public productOrderService: ProductOrderService,
              public cashService: CashService) {
  }

  getDepartments(): Observable<Department[]> {
    return this.dataStore.getDepartments();
  }

  getProductsByDepartment(id: string, pageNumber?: number, pageSize?: number): Observable<Product[]> {
    return this.dataStore.getProductsByDepartment(id, pageNumber, pageSize);
  }

  getProductsByFilter(filter: string): Observable<Product[] | Product> {
    return this.dataStore.getProductsByUpc(filter, EOperationType.List);
  }

  setOperation(typeOp: EOperationType, entity: string, desc: string){
    this.dataStore.registryOperation({operationType: typeOp, entityName: entity, description: desc})
  }

  getStockCountItems() {
    console.log(env.screenH);
    return (Math.floor((env.screenH/2)/100)*4);
  }

}

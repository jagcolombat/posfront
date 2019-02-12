import {Injectable} from '@angular/core';
import {DataStorageService} from "../api/data-storage.service";
import {Observable} from "rxjs";
import {Department} from "../../models/department.model";
import {Product} from "../../models";
import {ProductOrderService} from "./product-order.service";
import {EOperationType} from "../../utils/operation.type.enum";
import {CashService} from "./cash.service";

@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor(private dataStore: DataStorageService, public productOrderService: ProductOrderService,
              public cashService: CashService) {
  }

  getDepartments(): Observable<Department[]> {
    return this.dataStore.getDepartments();
  }

  getProductsByDepartment(id: string): Observable<Product[]> {
    return this.dataStore.getProductsByDepartment(id);
  }

  setOperation(typeOp: EOperationType, entity: string, desc: string){
    this.dataStore.registryOperation({operationType: typeOp, entityName: entity, description: desc})
  }

}

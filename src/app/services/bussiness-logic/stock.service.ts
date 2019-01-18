import {Injectable} from '@angular/core';
import {DataStorageService} from "../api/data-storage.service";
import {Observable} from "rxjs";
import {Department} from "../../models/department.model";
import {Product} from "../../models";
import {ProductOrderService} from "./product-order.service";
import {EOperationType} from "../../utils/operation.type.enum";
import {InvoiceService} from "./invoice.service";
import {CashService} from "./cash.service";

@Injectable({
  providedIn: 'root'
})
export class StockService {
  disableOp = false;

  constructor(private dataStore: DataStorageService, public productOrderService: ProductOrderService,
              private cashService: CashService) {
    this.cashService.evEmitReviewCheck.subscribe(next => {
      this.cashService.evReviewCheck.subscribe(resp => {
        if(resp) {
          this.disableOp = true;
        }
      });
    });

    this.cashService.evEmitReviewCheck.subscribe(next => {
      this.cashService.evGoBack.subscribe(resp => {
        if (resp) {
          this.disableOp = false;
        }
      });
    });
  }

  getDepartments(): Observable<Department[]> {
    return this.dataStore.getDepartments();
  }

  getProductsByDepartment(id: number): Observable<Product[]> {
    return this.dataStore.getProductsByDepartment(id);
  }

  setOperation(typeOp: EOperationType, entity: string, desc: string){
    this.dataStore.registryOperation({operationType: typeOp, entityName: entity, description: desc})
  }

}

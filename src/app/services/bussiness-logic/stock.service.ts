import { Injectable } from '@angular/core';
import { DataStorageService } from "../api/data-storage.service";
import { Observable } from "rxjs";
import { Department } from "../../models/department.model";
import { Product } from "../../models";
import {ProductOrderService} from "./product-order.service";

@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor(private dataStore: DataStorageService, public productOrderService: ProductOrderService) { }

  getDepartments(): Observable<Department[]> {
    return this.dataStore.getDepartments();
  }

  getProductsByDepartment(id: number): Observable<Product[]> {
    return this.dataStore.getProductsByDepartment(id);
  }

}

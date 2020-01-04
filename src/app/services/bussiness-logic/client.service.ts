import { Injectable } from '@angular/core';
import {DataStorageService} from "../api/data-storage.service";
import {CashService} from "./cash.service";

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private dataStorage: DataStorageService, private cashService: CashService) { }

  getClients(){
    return this.dataStorage.getClients();
  }
}

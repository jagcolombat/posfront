import {EventEmitter, Injectable, Input, Output} from '@angular/core';
import {EOperationType} from "../../utils/operation.type.enum";
import {DataStorageService} from "../api/data-storage.service";

@Injectable({
  providedIn: 'root'
})
export class InitViewService {
  @Output() evUserScanned = new EventEmitter<string>();
  @Input() userScanned: string;

  constructor(private dataStore: DataStorageService) { }

  cleanUserScanned() {
    this.userScanned = '';
  }

  setOperation(typeOp: EOperationType, entity: string, desc: string){
    console.log(typeOp, entity, desc);
    this.dataStore.registryOperation({operationType: typeOp, entityName: entity, description: desc});
  }
}

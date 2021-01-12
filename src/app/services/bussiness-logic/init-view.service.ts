import {EventEmitter, Injectable, Input, Output} from '@angular/core';
import {EOperationType} from "../../utils/operation.type.enum";
import {DataStorageService} from "../api/data-storage.service";
import {ConfigurationService} from "./configuration.service";
import {InformationType} from '../../utils/information-type.enum';
import {Station} from '../../models';
import {UtilsService} from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class InitViewService {
  @Output() evUserScanned = new EventEmitter<string>();
  @Input() userScanned: string;
  station: Station;

  constructor(public config: ConfigurationService, private dataStore: DataStorageService, private utils: UtilsService) {
    this.getStationStatus();
  }

  cleanUserScanned() {
    this.userScanned = '';
  }

  setOperation(typeOp: EOperationType, entity: string, desc: string){
    console.log(typeOp, entity, desc);
    const descrip = 'Operation: ' + EOperationType[typeOp] + ' | ' + desc;
    this.dataStore.registryOperation({operationType: typeOp, entityName: entity, description: descrip}).subscribe(
      next => console.log('InitViewService.setOperation', next),
      error1 => console.error('InitViewService.setOperation', error1)
    );
  }

  getStationStatus() {
    this.dataStore.getStationsStatus().subscribe(
      next => {
        console.log(next);
        this.getStatusByStation(next);
      },
      error => this.utils.openGenericInfo(InformationType.ERROR, error)
    );
  }

  getStatusByStation(status: Array<Station>) {
    this.station = status.find((v, i) => +v.id === this.config.sysConfig.posNumber);
  }
}

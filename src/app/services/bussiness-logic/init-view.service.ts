import {EventEmitter, Injectable, Input, OnDestroy, Output} from '@angular/core';
import {EOperationType} from '../../utils/operation.type.enum';
import {DataStorageService} from '../api/data-storage.service';
import {ConfigurationService} from './configuration.service';
import {InformationType} from '../../utils/information-type.enum';
import {Station} from '../../models';
import {UtilsService} from './utils.service';
import {WebsocketService} from '../api/websocket.service';
import {Subscription} from 'rxjs';
import {AuthService} from '../api/auth.service';

@Injectable({
  providedIn: 'root'
})
export class InitViewService implements OnDestroy {
  @Output() evUserScanned = new EventEmitter<string>();
  @Input() userScanned: string;
  station: Station;
  sub: Subscription[] = new Array<Subscription>();

  constructor(public config: ConfigurationService, private dataStore: DataStorageService, private utils: UtilsService,
              private ws: WebsocketService, private auth: AuthService) {
    this.sub.push(this.ws.evStationStatus.subscribe(data => this.wsStationStatus(data)));
  }

  cleanUserScanned() {
    this.userScanned = '';
  }

  setOperation(typeOp: EOperationType, entity: string, desc: string) {
    console.log(typeOp, entity, desc);
    const descrip = 'Operation: ' + EOperationType[typeOp] + ' | ' + desc;
    console.log('setOperation', this.auth.token);
    if (this.auth.token) {
      this.dataStore.registryOperation({operationType: typeOp, entityName: entity, description: descrip}).subscribe(
        next => console.log('InitViewService.setOperation', next),
        error1 => console.error('InitViewService.setOperation', error1)
      );
    }
  }

  public wsStationStatus(data: Array<Station>) {
    console.log('wsStationStatus', data);
    this.getStatusByStation(data);
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

  ngOnDestroy() {
    this.sub.map(sub => sub.unsubscribe());
  }
}

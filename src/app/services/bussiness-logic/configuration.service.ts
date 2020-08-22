import { Injectable } from '@angular/core';
import {Configuration} from "../../models/configuration.model";
import {PAXConnTypeEnum} from "../../utils/pax-conn-type.enum";
import {BreakTextEnum} from "../../utils/breaktext.enum";
import {DataStorageService} from "../api/data-storage.service";
import {UtilsService} from "./utils.service";

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  systemConfig: Configuration;

  constructor(private dataStore: DataStorageService, private utils: UtilsService) { }

  load(): Promise<any>{
    return this.getConfig().toPromise().then(next => {
      console.info('getConfig successfull', next);
      this.setSystemConfig(next);
    }, err => {
      console.error('getConfig failed');
      this.utils.openGenericInfo('Error', 'Can\'t get configuration');
    });
  }

  setSystemConfig(conf: any) {
    if(!conf.paxTimeout) conf.paxTimeout = 60;
    if(!conf.paxConnType) conf.paxConnType = PAXConnTypeEnum.OFFLINE;
    if(!conf.inactivityTime) conf.inactivityTime = 60;
    if(!conf.breakText) conf.breakText = BreakTextEnum.ALL;
    this.systemConfig = conf;
    //this.resetEnableState();
  }

  getConfig(){
    return this.dataStore.getConfiguration();
  }

  setConfig(conf: Configuration) {
    return this.dataStore.setConfiguration(conf);
  }

}

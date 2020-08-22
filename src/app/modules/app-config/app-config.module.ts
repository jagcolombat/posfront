import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {ConfigurationService} from "../../services/bussiness-logic/configuration.service";

export function init_app(configService: ConfigurationService){
  return () => configService.load();
}

@NgModule({
  imports: [HttpClientModule],
  providers: [
    ConfigurationService,
    { provide: APP_INITIALIZER, useFactory: init_app, deps: [ConfigurationService],  multi: true }
  ],
  exports: [HttpClientModule]
})
export class AppConfigModule { }

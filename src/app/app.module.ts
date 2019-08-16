import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { AuthInterceptor } from "./services/interceptors/auth.interceptor";
import { AppComponent } from './app.component';
import { SharedModule } from "./modules/shared/shared.module";
import { MaterialModule } from "./modules/material/material.module";
import { HomeModule } from "./modules/home/home.module";
import { baseURL } from './utils/url.path.enum';
import { CloseBatchComponent } from './components/presentationals/close-batch/close-batch.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    MaterialModule,
    HttpClientModule,
    HomeModule
  ],
  declarations: [
    AppComponent,
    CloseBatchComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: 'BaseURL', useValue: baseURL }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

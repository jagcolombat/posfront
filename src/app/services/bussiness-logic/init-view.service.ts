import {EventEmitter, Injectable, Input, Output} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InitViewService {
  @Output() evUserScanned = new EventEmitter<string>();
  @Input() userScanned: string;

  constructor() { }

  cleanUserScanned() {
    this.userScanned = '';
  }
}

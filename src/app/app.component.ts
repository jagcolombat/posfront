import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'pos-front';

  /*@HostListener('document: keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    console.log('handleKeyboardEvent', event);
  }*/
}

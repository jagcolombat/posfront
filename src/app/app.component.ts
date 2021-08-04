import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocationStrategy } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit/*, OnDestroy*/ {
  title = 'pos-front';

  constructor( private location: LocationStrategy){  
    // preventing back button in browser implemented by "Samba Siva"  
     history.pushState(null, null, window.location.href);  
    this.location.onPopState(() => {
      history.pushState(null, null, window.location.href);
    });  
  }
    
  ngOnInit(): void {}
}

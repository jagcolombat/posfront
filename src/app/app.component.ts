import { Component, OnInit, OnDestroy } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit/*, OnDestroy*/ {
  title = 'pos-front';
  ngOnInit(): void {}
}

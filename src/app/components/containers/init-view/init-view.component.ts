import {Component, OnDestroy, OnInit} from '@angular/core';

@Component({
  selector: 'app-init-view',
  templateUrl: './init-view.component.html',
  styleUrls: ['./init-view.component.css']
})
export class InitViewComponent implements OnInit, OnDestroy {
  promotionsPath: string = '/assets/Promotions';
  currentPromo: string= this.promotionsPath + '1.PNG';
  limit: number = 4;
  interval: number;

  constructor() { }

  ngOnInit() {
    this.carouselPromotions();
  }

  carouselPromotions() {
    let counter = 2;
    this.interval = setInterval(()=> {
      this.currentPromo = this.promotionsPath + counter + '.PNG';
      (counter <= this.limit) ? counter++ : counter = 1;
    }, 5000);
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }
}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-init-view',
  templateUrl: './init-view.component.html',
  styleUrls: ['./init-view.component.css']
})
export class InitViewComponent implements OnInit {
  promotionsPath: string = '/assets/Promotions';
  currentPromo: string= this.promotionsPath + '1.PNG';
  limit: number = 4;
  constructor() { }

  ngOnInit() {
    this.carouselPromotions();
  }

  carouselPromotions() {
    let counter = 2;
    setInterval(()=> {
      this.currentPromo = this.promotionsPath + counter + '.PNG';
      (counter <= this.limit) ? counter++ : counter = 1;
    }, 5000);
  }

}

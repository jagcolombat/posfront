import { Component, OnInit } from '@angular/core';
import {IImage} from "ng-simple-slideshow";

@Component({
  selector: 'slide-promotions',
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.scss']
})
export class PromotionsComponent implements OnInit {
  imagesUrl: (string | IImage)[] = [
    { url: '/assets/promotions/promotions1.png', caption: 'The first slide'},
    { url: '/assets/promotions/promotions2.png', caption: 'The second slide'},
    { url: '/assets/promotions/promotions3.png', caption: 'The third slide'},
    { url: '/assets/promotions/promotions4.png', caption: 'The four slide'},
    { url: '/assets/promotions/promotions5.png', caption: 'The five slide'}
  ];
  height: string = '280px';
  autoPlay: boolean = true;
  autoPlayInterval: number = 7000;
  stopAutoPlayOnSlide: boolean = true;
  showDots: boolean = false;
  dotColor: string = '#FFF';
  showCaptions: boolean = false;
  constructor() { }

  ngOnInit() {
  }

}

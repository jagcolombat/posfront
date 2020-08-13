import {Component, Input, OnInit} from '@angular/core';
import {IImage} from "ng-simple-slideshow";

@Component({
  selector: 'slide-promotions',
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.scss']
})
export class PromotionsComponent implements OnInit {
  @Input() path: string;
  imagesUrl: (string | IImage)[];
  @Input() height: string = '280px';
  autoPlay: boolean = true;
  autoPlayInterval: number = 7000;
  stopAutoPlayOnSlide: boolean = true;
  showDots: boolean = false;
  dotColor: string = '#FFF';
  showCaptions: boolean = false;
  constructor() { }

  ngOnInit() {
    this.imagesUrl = [
      { url: this.path + 'promotions1.png', caption: 'The first slide'},
      { url: this.path + 'promotions2.png', caption: 'The second slide'},
      { url: this.path + 'promotions3.png', caption: 'The third slide'},
      { url: this.path + 'promotions4.png', caption: 'The four slide'},
      { url: this.path + 'promotions5.png', caption: 'The five slide'}
    ];
  }

}

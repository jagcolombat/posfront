import {Component, Input, OnInit} from '@angular/core';
import {IImage} from "ng-simple-slideshow";

@Component({
  selector: 'slide-announce',
  templateUrl: './announce.component.html',
  styleUrls: ['./announce.component.scss']
})
export class AnnounceComponent implements OnInit {
  @Input() path: string;
  imagesUrl: (string | IImage)[];
  @Input() height: string = '330px';
  autoPlay: boolean = true;
  autoPlayInterval: number = 5000;
  stopAutoPlayOnSlide: boolean = true;
  showDots: boolean = false;
  dotColor: string = '#FFF';
  showCaptions: boolean = true;

  constructor() { }

  ngOnInit() {
    this.imagesUrl = [
      { url: this.path + 'anuncio1.jpg', caption: 'The first slide'},
      { url: this.path + 'anuncio2.jpg', caption: 'The second slide'},
      { url: this.path + 'anuncio3.jpg', caption: 'The third slide'},
    ];
  }

}

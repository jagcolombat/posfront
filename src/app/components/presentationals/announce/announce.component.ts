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
  height: string = '330px';
  autoPlay: boolean = true;
  autoPlayInterval: number = 5000;
  stopAutoPlayOnSlide: boolean = true;
  showDots: boolean = false;
  dotColor: string = '#FFF';
  showCaptions: boolean = true;

  constructor() { }

  ngOnInit() {
    this.imagesUrl = [
      { url: this.path + '/assets/anuncios/anuncio1.jpg', caption: 'The first slide'},
      { url: this.path + '/assets/anuncios/anuncio2.jpg', caption: 'The second slide'},
      { url: this.path + '/assets/anuncios/anuncio3.jpg', caption: 'The third slide'},
    ];
  }

}

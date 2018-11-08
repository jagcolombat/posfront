import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-info-pos',
  templateUrl: './info-pos.component.html',
  styleUrls: ['./info-pos.component.css']
})
export class InfoPosComponent implements OnInit {
  @Input() title: string;
  @Input() value: number;
  @Input() format= "";
  @Input() align= "start";

  constructor() { }

  ngOnInit() {
  }

}

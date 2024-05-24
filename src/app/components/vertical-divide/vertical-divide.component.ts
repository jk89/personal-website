import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-vertical-divide',
  templateUrl: './vertical-divide.component.html',
  styleUrls: ['./vertical-divide.component.scss'],
})
export class VerticalDivideComponent implements OnInit {

  @Input("sloti") slot: string = "middle";

  constructor() { }

  ngOnInit() {
  }

}

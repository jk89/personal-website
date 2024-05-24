import { Component, OnInit } from '@angular/core';
import { ColoredPageComponent } from 'src/app/components/colored-page/colored-page.component';

@Component({
  selector: 'app-topics',
  templateUrl: './topics.page.html',
  styleUrls: ['./topics.page.scss'],
})
export class TopicsPage extends ColoredPageComponent {
  public pagePath: string = "/topics";
  public color: string = "paletteschemecolor3";
}

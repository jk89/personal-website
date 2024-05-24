import { Component } from '@angular/core';
import { ColoredPageComponent } from 'src/app/components/colored-page/colored-page.component';

@Component({
  selector: 'app-ee',
  templateUrl: './ee.page.html',
  styleUrls: ['./ee.page.scss'],
})
export class EePage extends ColoredPageComponent {
  public pagePath: string = "/projects/ee";
  public color: string = "paletteschemecolor5";
}

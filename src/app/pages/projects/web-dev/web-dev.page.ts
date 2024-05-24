import { Component } from '@angular/core';
import { ColoredPageComponent } from 'src/app/components/colored-page/colored-page.component';

@Component({
  selector: 'app-web-dev',
  templateUrl: './web-dev.page.html',
  styleUrls: ['./web-dev.page.scss'],
})
export class WebDevPage extends ColoredPageComponent {
  public pagePath: string = "/projects/web-dev";
  public color: string = "paletteschemecolor7";
}

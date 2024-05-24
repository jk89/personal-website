import { Component } from '@angular/core';
import { ColoredPageComponent } from 'src/app/components/colored-page/colored-page.component';

@Component({
  selector: 'app-science',
  templateUrl: './science.page.html',
  styleUrls: ['./science.page.scss'],
})
export class SciencePage extends ColoredPageComponent {
  public color: string = "paletteschemecolor4";
  public pagePath: string = "/projects/science";
}

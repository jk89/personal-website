import { Component } from '@angular/core';
import { ColoredPageComponent } from 'src/app/components/colored-page/colored-page.component';

@Component({
  selector: 'app-three-d',
  templateUrl: './three-d.page.html',
  styleUrls: ['./three-d.page.scss'],
})
export class ThreeDPage extends ColoredPageComponent {
  public color: string = "paletteschemecolor6";
  public pagePath: string = "/projects/3d";
}
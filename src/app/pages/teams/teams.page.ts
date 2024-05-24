import { Component } from '@angular/core';
import { ColoredPageComponent } from 'src/app/components/colored-page/colored-page.component';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.page.html',
  styleUrls: ['./teams.page.scss'],
})
export class TeamsPage extends ColoredPageComponent {
  public pagePath: string = "/teams";
  public color: string = "paletteschemecolor2";
}

import { Component } from '@angular/core';
import { ColoredPageComponent } from 'src/app/components/colored-page/colored-page.component';
import { appPages } from '../../routes';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage extends ColoredPageComponent {
  public pagePath: string = "/home";
  public color: string = "paletteschemecolor1";
  appPages = appPages;
}

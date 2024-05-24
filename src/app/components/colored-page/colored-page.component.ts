import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ColorService } from 'src/app/services/color.service';
import * as pageColors from "../../pageColors.json";
import { appPages } from '../../routes';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({})
export abstract class ColoredPageComponent {
  protected color: string;
  protected pagePath: string;
  readonly appPages = appPages;

  constructor(private colorService: ColorService, private navigationService: NavigationService) {

  }

  ionViewWillEnter(): void {
    const overridenColor = this.color;
    let baseColor = null;

    if (!this.pagePath) {
      console.warn("PagePath not defined in derived PageComponent. This page will not be navigable.");
      return;
    } else {
      baseColor = pageColors[this.pagePath];
      this.navigationService.currentPageSubject.next(this.pagePath);
    }

    this.color = overridenColor || baseColor || null;
    if (this.color === null) {
      console.warn("No color provided for this PageComponent by either specification within the class or within the pageColors.json file applying a default.");
      this.color = "primary";
    }

    this.colorService.changeColor(this.color);
  }

}

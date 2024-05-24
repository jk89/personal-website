import { Directive, HostListener, Input } from '@angular/core';
import { NavigationService } from '../services/navigation.service';

@Directive({
  selector: '[appIntraNavLink]'
})
export class IntraNavLinkDirective {

  @Input("basePath") basePath = null;
  @Input("section") section = null;

  constructor(public navService: NavigationService) { }

  @HostListener('click', ['$event'])
  click(event){
    this.navService.changePageSection(this.basePath, this.section);
  }

}

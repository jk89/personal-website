import { Directive, ElementRef, Input } from '@angular/core';
import { NavigationService } from '../services/navigation.service';

@Directive({
  selector: '[linkElementToNavigation]'
})
export class LinkElementToNavigationDirective {

  @Input('linkElementToNavigation') basePath: any = null;

  constructor(public elementRef: ElementRef, private navigationService: NavigationService) {}

  ngAfterViewInit(): void {
    this.navigationService.addNavigationRoute(this.basePath, this.elementRef.nativeElement.id, this.elementRef);
  }

}

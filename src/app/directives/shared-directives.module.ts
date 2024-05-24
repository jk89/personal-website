import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FadeHeaderOnScrollDirective } from './fade-header-on-scroll.directive';
import { LinkElementToNavigationDirective } from './link-element-to-navigation.directive';
import { CurrentBackgroundColorDirective, CurrentBackgroundColorHoverDirective, CurrentBorderColorDirective, CurrentBorderTopColorDirective, CurrentColorDirective} from './color.directive';
import { IntraNavLinkDirective } from './intra-nav-link.directive';

@NgModule({
  declarations: [
    FadeHeaderOnScrollDirective,
    LinkElementToNavigationDirective,
    CurrentColorDirective,
    CurrentBackgroundColorDirective,
    CurrentBorderColorDirective,
    CurrentBorderTopColorDirective,
    CurrentBackgroundColorHoverDirective,
    IntraNavLinkDirective,
  ],
  exports: [
    FadeHeaderOnScrollDirective,
    LinkElementToNavigationDirective,
    CurrentColorDirective,
    CurrentBackgroundColorDirective,
    CurrentBorderColorDirective,
    CurrentBorderTopColorDirective,
    CurrentBackgroundColorHoverDirective,
    IntraNavLinkDirective
  ],
  imports: [
    CommonModule
  ]
})
export class SharedDirectivesModule { }

import { Directive, ElementRef, HostBinding, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ColorService } from '../services/color.service';
import { take } from 'rxjs/operators';

@Directive({
  selector: '[currentColor]'
})
export class CurrentColorDirective implements OnInit, OnDestroy {

  @Input('currentColor') modifier: string = "";
  @HostBinding('style.color')
  color: string;

  colorChangeSubscription: Subscription;

  ngOnInit(): void {
    this.colorChangeSubscription = this.colorService.color$.subscribe((color: string) => { // .pipe(take(2)).
      this.color = `var(--ion-color-${color}${this.modifier}) !important`;
    });
  }

  ngOnDestroy(): void {
    this.colorChangeSubscription.unsubscribe();
  }

  constructor(private colorService: ColorService, private el: ElementRef) {
  }
}

@Directive({
  selector: '[currentBorderColor]'
})
export class CurrentBorderColorDirective implements OnInit, OnDestroy {

  @Input('currentBorderColor') modifier: string = "";
  @HostBinding('style.border-color')
  color: string;

  colorChangeSubscription: Subscription;

  ngOnInit(): void {
    this.colorChangeSubscription = this.colorService.color$.subscribe((color: string) => { // .pipe(take(2))
      this.color = `var(--ion-color-${color}${this.modifier}) !important`;
    });
  }

  ngOnDestroy(): void {
    this.colorChangeSubscription.unsubscribe();
  }

  constructor(private colorService: ColorService, private el: ElementRef) {
  }
}

@Directive({
  selector: '[currentBorderTopColor]'
})
export class CurrentBorderTopColorDirective implements OnInit, OnDestroy {

  @Input('currentBorderTopColor') modifier: string = "";
  @HostBinding('style.border-top-color')
  color: string;

  colorChangeSubscription: Subscription;

  ngOnInit(): void {
    this.colorChangeSubscription = this.colorService.color$.subscribe((color: string) => { // .pipe(take(2))
      this.color = `var(--ion-color-${color}${this.modifier}) !important`;
    });
  }

  ngOnDestroy(): void {
    this.colorChangeSubscription.unsubscribe();
  }

  constructor(private colorService: ColorService, private el: ElementRef) {
  }
}

@Directive({
  selector: '[currentBackgroundColor]',
  inputs: ["childSelector"]
})
export class CurrentBackgroundColorDirective implements OnInit, OnDestroy {

  @Input('currentBackgroundColor') modifier: string = "";
  @Input('childSelector') childSelector: string = null;
  @HostBinding('style.background-color')
  color: string;

  colorChangeSubscription: Subscription;

  ngOnInit(): void {
    this.colorChangeSubscription = this.colorService.color$.subscribe((color: string) => { // .pipe(take(2))
      if (this.childSelector === null) {
        this.color = `var(--ion-color-${color}${this.modifier}) !important`;
      }
      else {
        [...this.el.nativeElement.querySelectorAll(this.childSelector)].forEach((childEl) => {
          const currentColor = `var(--ion-color-${color}${this.modifier})`;
          childEl.style.backgroundColor = currentColor;
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.colorChangeSubscription.unsubscribe();
  }

  constructor(private colorService: ColorService, private el: ElementRef) {
  }
}

/*
CurrentBackgroundColorHoverDirective
*/


@Directive({
  selector: '[currentBackgroundColorHover]'
})
export class CurrentBackgroundColorHoverDirective implements OnInit, OnDestroy {

  @Input('currentBackgroundColor') modifier: string = "";
  @Input('unhoverColor') unhoverColor: string = "var(--ion-text-color)";
  hoverColor: string = null;
  @HostBinding('style.background-color')
  color: string;
  colorChangeSubscription: Subscription;

  @HostListener('mouseenter') onMouseEnter() {
    this.color = this.hoverColor;
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.color = this.unhoverColor;
  }

  ngOnInit(): void {
    this.colorChangeSubscription = this.colorService.color$.pipe(take(2)).subscribe((color: string) => {
      this.hoverColor = `var(--ion-color-${color}${this.modifier}) !important`;

    });
  }

  ngOnDestroy(): void {
    this.colorChangeSubscription.unsubscribe();
  }

  constructor(private colorService: ColorService) {
  }
}

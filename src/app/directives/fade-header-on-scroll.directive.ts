import { Directive, HostListener, Input, OnInit } from '@angular/core';
import { DomController } from '@ionic/angular';

@Directive({
  selector: '[appFadeHeaderOnScroll]'
})
export class FadeHeaderOnScrollDirective implements OnInit {

  @Input('appFadeHeaderOnScroll') toolbar: any = null;
  @Input('header') header: any = null;
  private toolbarHeight = 44;
  private darkMode = false;
  private darkHex = "#1e1e1e";
  private lightHex = "#f0f0f0";
  private hex: string = "0";
  private top: number = 0;

  constructor(private domCtrl: DomController) { }

  ngOnInit() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.darkMode = true;
    }
    if (window.matchMedia) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      prefersDark.addEventListener('change', (mediaQuery) => {
        this.darkMode = !this.darkMode;
        this.updateToolbarBg();
      });
    }
    if (this.toolbar) this.toolbar = this.toolbar.el; // fixme safari
    if (this.header) this.header = this.header.el; // fixme safari

    this.domCtrl.read(() => {
      this.toolbarHeight = this.toolbar.clientHeight;
      this.updateFadeStyle(0);
    });
  }

  updateFadeStyle(opacityNumber: number) {
    const opacity = Math.max(parseInt(this.mapValue(0, 255, 0, 100, opacityNumber)), 0);
    if (this.toolbar &&  this.toolbar.querySelector) { // fixme safari
      this.toolbar.querySelector(".nav-fade").style.opacity = `${opacity}%`;
    }
  }

  mapValue(minA, maxA, minB, maxB, inputVal) {
    return minB + ((inputVal - minA) * (maxB - minB)) / (maxA - minA);
  }

  updateToolbarBg() {
    this.domCtrl.write(() => {
      this.toolbar?.style?.setProperty('--background', `${this.darkMode ? this.darkHex : this.lightHex}${this.hex}`); // fixme this has an error with safari
      this.updateFadeStyle(this.top);
    });
  }

  @HostListener('ionScroll', ['$event'])
  onContentScroll(event) {
    let top = Math.round(event.detail.scrollTop);
    if (top >= 255) {
      top = 255;
    }
    this.top = top;
    this.hex = top.toString(16);
    this.updateToolbarBg();
  }

}

import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { first, throttleTime } from 'rxjs/operators';
import { ColorService } from 'src/app/services/color.service';

@Component({
  selector: 'app-cursor',
  templateUrl: './cursor.component.html',
  styleUrls: ['./cursor.component.scss'],
})
export class CursorComponent implements OnInit, OnDestroy {

  @ViewChild('cursor_inner') cursor_inner: ElementRef<HTMLElement>;
  @ViewChild('cursor_middle') cursor_middle: ElementRef<HTMLElement>;
  @ViewChild('cursor_outer') cursor_outer: ElementRef<HTMLElement>;
  private outerPositionStyle = "";
  private middlePositionStyle = "";
  private innerPositionStyle = "";
  private mouseMoveSubject: Subject<MouseEvent> = new Subject<MouseEvent>();

  // hide until first motion
  cursorFirstMotionSubscription = this.mouseMoveSubject.pipe(first()).subscribe((event) => {
    // remove previous transition class from cursor elements
    this.cursor_inner.nativeElement.classList.remove('hidden');
    this.cursor_outer.nativeElement.classList.remove('hidden');
    this.cursor_middle.nativeElement.classList.remove('hidden');
    this.cursorFirstMotionSubscription.unsubscribe();
  });

  cursorMotionSubscription = this.mouseMoveSubject
    .pipe(throttleTime(60, undefined, { leading: true, trailing: true }))
    .subscribe((event) => {
      const pageX = event.pageX;
      const pageY = event.pageY;
      this.outerPositionStyle = `left: ${pageX - 22}px; top: ${pageY - 22}px;`;
      this.innerPositionStyle = `left: ${pageX - 4}px; top: ${pageY - 4}px;`;
      this.middlePositionStyle = `left: ${pageX - 11}px; top: ${pageY - 11}px;`;
    });

  ngOnDestroy() {
    this.cursorMotionSubscription.unsubscribe();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    this.mouseMoveSubject.next(e);
  }

  @HostListener('document:mouseleave')
  onMouseLeave() {
    this.cursor_inner.nativeElement.classList.add('hidden');
    this.cursor_outer.nativeElement.classList.add('hidden');
    this.cursor_middle.nativeElement.classList.add('hidden');
  }

  @HostListener('document:mouseenter')
  @HostListener('document:click')
  onMouseEnter() {
    this.cursor_inner.nativeElement.classList.remove('hidden');
    this.cursor_outer.nativeElement.classList.remove('hidden');
    this.cursor_middle.nativeElement.classList.remove('hidden');
  }

  @HostListener('document:touchstart', ['$event'])
  @HostListener('document:touchend', ['$event'])
  @HostListener('document:touchcancel', ['$event'])
  handleTouch(event) {
    this.cursor_inner.nativeElement.classList.add('hidden');
    this.cursor_outer.nativeElement.classList.add('hidden');
    this.cursor_middle.nativeElement.classList.add('hidden');
  }

  constructor(private colorService: ColorService) { }

  ngOnInit() { }

}

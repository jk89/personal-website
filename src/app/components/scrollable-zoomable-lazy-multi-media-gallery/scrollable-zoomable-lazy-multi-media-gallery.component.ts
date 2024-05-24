import { AfterContentInit, AfterViewInit, Component, ContentChild, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-scrollable-zoomable-lazy-multi-media-gallery',
  templateUrl: './scrollable-zoomable-lazy-multi-media-gallery.component.html',
  styleUrls: ['./scrollable-zoomable-lazy-multi-media-gallery.component.scss'],
})
export class ScrollableZoomableLazyMultiMediaGalleryComponent implements OnInit, AfterViewInit {
 
  @ViewChild("mediaChildData") mediaChildData: ElementRef<HTMLElement>;
  @Input("ids") ids: Array<string> = [];

  idsIdxs () {
    return this.ids.map((id, idx) => idx)
  }

  ngAfterViewInit() {
    if (this.mediaChildData.nativeElement.childNodes.length) {
      this.ids = Array.prototype.slice.call(this.mediaChildData.nativeElement.childNodes).map(child => child.id);
    }
  }

  constructor() { }

  ngOnInit() {}

}

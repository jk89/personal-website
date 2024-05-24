import { AfterViewInit, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable, Subject, Subscription, fromEvent } from 'rxjs';
import { debounceTime, delay, filter } from 'rxjs/operators';
import { MediaType } from 'src/app/models/media';
import { AssetManagerService } from 'src/app/services/asset-manager.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { MediaZoomModalComponent } from '../media-zoom-modal/media-zoom-modal.component';

// todo fixme this is rubbish inlineStyles look like they are ignored entirely, and not loaded style bit needs a cleanup

@Component({
  selector: 'app-lazy-enlargeable-media',
  templateUrl: './lazy-enlargeable-media.component.html',
  styleUrls: ['./lazy-enlargeable-media.component.scss'],
})
export class LazyEnlargeableMediaComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input("height") height = null;
  @Input("width") width = null;
  @Input("aspectRatio") aspectRatio = null;
  @Input("bgColor") bgColor = null;
  @Input("inlineStyle") inlineStyle = "";
  @Input("mediaType") mediaType: MediaType = MediaType.Unknown;
  @Input("id") id = null;
  @Input("ids") ids = null;
  @Input("idx") idx = null;
  @ViewChild("element") element: ElementRef;
  @ViewChild("wrapper") wrapper: ElementRef;
  private computedHeight = 0;
  private computedWidth = 0;
  private currentAssetId: string = null;
  private showContent = false;
  private href: string = "";
  private inlineStyles = {};
  private notLoadedStyle = {};
  private loadedStyle = {};
  private allMediaTypes = MediaType;
  private assetData: any = null;
  private widthStartedNull = true;
  private heightStartedNull = true;
  private startSub: Subscription;
  private observer: IntersectionObserver | undefined;
  private intersectionSubject = new Subject<{
    entry: IntersectionObserverEntry;
    observer: IntersectionObserver;
  }>();

  constructor(public modalCtrl: ModalController, private navService: NavigationService, private assetManagerService: AssetManagerService) {

  }

  async zoom() {
    // do something fixme to prevent this from happening twice.
    if (this.currentAssetId) {
      if (this.ids === null) {
        // present modal
        const modal = await this.modalCtrl.create({
          component: MediaZoomModalComponent,
          componentProps: {
            id: this.currentAssetId,
            cssClass: 'fullscreen'
          }
        });
        await modal.present();
      }
      else {
        // present multi modal
        const modal = await this.modalCtrl.create({
          component: MediaZoomModalComponent,
          componentProps: {
            ids: this.ids,
            idx: this.idx,
            cssClass: 'fullscreen'
          }
        });
        await modal.present();
      }
    }
  }

  calculateStyles() {
    const styleSplit = this.inlineStyle.split(";");

    const styleExtras = {};
    styleSplit.forEach((segment) => {
      if (segment === "") return;
      const segSplit = segment.split(":");
      if (["height", "width"].includes(segSplit[0])) return;
      styleExtras[segSplit[0].replace(/ /g, "")] = segSplit[1];
    });

    this.inlineStyles = styleExtras;

    if (this.width && this.widthStartedNull == false) {
      this.inlineStyles["max-width"] = `${this.width}px`;
      if (this.ids === null) {
        this.inlineStyles["max-height"] = `${this.height}px`;

      }
      else {
        this.inlineStyles["height"] = `${this.height}px`;
      }
    }

    if (this.height && this.heightStartedNull == false) {
      this.inlineStyles["max-height"] = `${this.height}px`;
      if (this.ids === null) {
        this.inlineStyles["max-width"] = `${this.width}px`;
      }
      else {
        this.inlineStyles["width"] = `${this.width}px`;
      }
    }
    this.loadedStyle = {
      ...styleExtras
    }

    this.notLoadedStyle = {
      ...styleExtras,
      "width": `${this.computedWidth || 10}px`,
      "height": `${this.computedHeight || 10}px`, // here
      "background-color": `${this.bgColor || "#000000"}`,
    }

  }

  movPath: string = null;
  webMPath: string = null;

  loadMedia(id: string) {
    if (this.width) this.widthStartedNull = false;
    if (this.height) this.heightStartedNull = false;
    // we can autocalculate the right dimensions if we have an id
    if (id) {
      const assetData = this.assetManagerService.getAssetData(id);
      if (assetData) {
        this.assetData = assetData;
        // determine media type
        let thumb = null;
        if (assetData.type === MediaType.Video) {
          this.mediaType = MediaType.Video;
          if (assetData.movPath == null || assetData.webMPath == null) {
            this.mediaType = MediaType.Image;
            this.href = `../../../assets/default/_asset-not-found.png.webp`;
            this.bgColor = "transparent";
          }
          else {
            this.movPath = `../../../assets/${assetData.movPath}`;
            this.webMPath = `../../../assets/${assetData.webMPath}`;
          }
        }
        else if (assetData.type === MediaType.Image) {
          this.mediaType = MediaType.Image;
          this.href = `../../../assets/${assetData.webPPath}`; // FIXME remove?
        }
        else if (assetData.type === MediaType.FusionModel) {
          this.mediaType = MediaType.FusionModel;
          // get thumbnail style
          thumb = this.assetManagerService.getAssetData(assetData.thumbnailAssetId);
          if (thumb) {
            assetData.aspectRatio = thumb.aspectRatio;
            assetData.height = thumb.height;
            assetData.width = thumb.width;
            assetData.color = thumb.color;
            this.href = `../../../assets/${thumb.webPPath}`;
          }
        }
        else if (assetData.type === MediaType.EmbeddedDom) {
          this.mediaType = MediaType.EmbeddedDom;
          // get thumbnail style
          thumb = this.assetManagerService.getAssetData(assetData.thumbnailAssetId);
          if (thumb) {
            assetData.aspectRatio = thumb.aspectRatio;
            assetData.height = thumb.height;
            assetData.width = thumb.width;
            assetData.color = thumb.color;
            this.href = `../../../assets/${thumb.webPPath}`;
          }
        }

        // we might have been provided a height and need to scale the width;
        if (this.height && !this.width) {
          this.computedWidth = Math.round(this.height * assetData.aspectRatio);
          this.computedHeight = parseFloat(this.height);
          this.width = this.computedWidth;
          this.height = this.computedHeight;
        }
        // we might have been provided the width and need to scale the height;
        else if (this.width && !this.height) {
          this.computedHeight = Math.round(this.width / assetData.aspectRatio);
          this.computedWidth = parseFloat(this.width);
          this.height = this.computedHeight;
          this.width = this.computedWidth;
        }
        // we might have been given neither
        else if (this.width === null && this.height === null) {
          this.computedHeight = assetData.height;
          this.computedWidth = assetData.width;
          this.width = assetData.width;
          this.height = assetData.height;
        }
        if (!this.bgColor) {
          if (assetData.webPPath === "asset-not-found.png.webp") {
            this.bgColor = "transparent";
          }
          else {
            this.bgColor = assetData.color;
          }
        }
      }
      else {
        this.mediaType = MediaType.Image;
        this.href = `../../../assets/default/_asset-not-found.png.webp`;
        this.bgColor = "transparent";
      }
    }
    else if (
      (this.height === null && this.width && this.aspectRatio) ||  // if the height is undefined by we have a non-zero width and aspect ratio or... 
      (this.width === null && this.height && this.aspectRatio) // if we an undefined width but we have the height and aspect ration
    ) {
      // calculate missing value
      // width to its height a = w / h
      // so w = a * h and h = w / a
      if (this.height === null) {
        this.computedHeight = this.width / this.aspectRatio;
        this.computedWidth = parseFloat(this.width);
        this.height = this.computedHeight;
      }
      if (this.width === null) {
        this.computedWidth = this.height * this.aspectRatio;
        this.computedHeight = parseFloat(this.height);
        this.width = this.computedWidth;
      }
    }

    if (this.height) {
      if (!this.computedHeight) this.computedHeight = parseFloat(this.height);
    }

    if (this.width) {
      if (!this.computedWidth) this.computedWidth = parseFloat(this.width);
    }

    if (!(this.computedWidth && this.computedHeight && this.bgColor)) {
      console.error("Too many missing values to present unloaded style", id);
    }

    this.calculateStyles();
    this.createObserver();
  }

  resize$: Observable<Event>;
  resizeSubscription$: Subscription;

  parentForSizing: HTMLElement;

  ngOnInit() {
    if (this.id) {
      this.currentAssetId = this.id;
    }
    else {
      if (
        this.ids !== null &&
        this.idx !== null &&
        Array.isArray(this.ids) &&
        this.ids.every(id => typeof id === "string") &&
        Number.isInteger(this.idx) && Math.sign(this.idx) >= 0 &&
        this.idx < this.ids.length
      ) {
        this.currentAssetId = this.ids[this.idx];
      }
      else {
        return console.error("Lazy enlargable component: id or ids/idx were inproperly formatted or do not exist.");
      }
    }
    this.loadMedia(this.currentAssetId);

    this.resize$ = fromEvent(window, 'resize')
    this.resizeSubscription$ = this.resize$.pipe(
      debounceTime(50)
    ).subscribe(event => this.resizeHandler(event));
  }

  resizeHandler(event: any) {
    const parentWidthOffset = this.parentForSizing.offsetWidth - (16 * 7);
    if (this.ids === null) {
      this.computedWidth = parentWidthOffset;
      const possibleHeight = Math.round(this.computedWidth / this.assetData.aspectRatio);
      this.computedHeight = possibleHeight;
      this.calculateStyles();
    }
  }

  ngAfterViewInit() {
    this.parentForSizing = this.element.nativeElement.closest(".content2");
    setTimeout(() => this.resizeHandler(null), 100);
    if (this.startSub) return;
    this.startSub = this.navService.pageFullyLoaded$.subscribe((e) => {
      this.startObservingElements(); // here
      this.startSub.unsubscribe();
    });
  }

  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = undefined;
    }

    this.intersectionSubject.next();
    this.intersectionSubject.complete();
  }

  ngOnDestroy() {
    this.resizeSubscription$.unsubscribe();
    this.disconnect();
  }

  private createObserver() {
    const options = {
      rootMargin: '0px',
      threshold: [0.0]
    };

    this.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        this.intersectionSubject.next({ entry, observer });
      });
    }, options);
  }

  private startObservingElements() {
    if (!this.observer) {
      return;
    }

    this.observer.observe(this.element.nativeElement);

    this.intersectionSubject
      .pipe(delay(0), filter(Boolean))
      .subscribe(async ({ entry, observer } : {entry:IntersectionObserverEntry, observer: IntersectionObserver}) => {
        const target = entry.target as HTMLElement;

        if (entry.intersectionRatio > 0.0) {
          observer.unobserve(target);
          this.showContent = true;
          this.disconnect();
        }

      });
  }
}


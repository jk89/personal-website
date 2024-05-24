import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { CookieService } from "../../services/cookie.service";
@Component({
  selector: 'app-youtube-video',
  templateUrl: './youtube-video.component.html',
  styleUrls: ['./youtube-video.component.scss'],
})
export class YoutubeVideoComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input("ytVideoId") ytVideoId: string = null;
  @Input("width") width: string = null;
  @Input("height") height: string = null;
  @Input("title") title: string = "YouTube video player";
  @ViewChildren("iframe_yt") private iframes: QueryList<HTMLElement>;
  @ViewChild("iframe_yt") private viewChildIframe: ElementRef<HTMLElement>;
  private iframe: ElementRef<HTMLElement>;
  private videoSrc: string = "";
  private thumbnailSrc: string = "";
  private thumbnailStyle: string = "";
  private dimensionsStyle: string = "";
  private acceptedCookie: Observable<boolean>;
  private acceptanceSub: Subscription;
  private iframesSubChange: Subscription;

  acceptCookie(){
    this.cookieService.acceptCookie("youtube");
  }

  private checkAcceptanceAndFadeInIframe() {
    this.acceptanceSub?.unsubscribe();
    this.acceptanceSub = this.acceptedCookie.subscribe((hasAccepted) => {
      if (hasAccepted) {
        const ref = ((this.iframe || this.viewChildIframe) as ElementRef<HTMLElement>);
        if (ref) ref.nativeElement.classList.add("iframe-fade-in");
      }
    });
  }

  constructor(private cookieService: CookieService) { 

  }

  ngOnDestroy(): void {
    this.acceptanceSub.unsubscribe();
    this.iframesSubChange.unsubscribe();
  }

  ngAfterViewInit(): void {
    // see if element is already present after view init
    this.checkAcceptanceAndFadeInIframe();
    // otherwise check if the iframe element becomes visible
    this.iframesSubChange = this.iframes.changes.subscribe(async (iframes: QueryList<HTMLElement>) => {
      this.iframe = iframes.first as any;
      this.checkAcceptanceAndFadeInIframe();
    });
  }

  ngOnInit() {
    if (this.ytVideoId != null) {
      this.videoSrc = `https://www.youtube.com/embed/${this.ytVideoId}`;
      this.thumbnailSrc = `https://img.youtube.com/vi/${this.ytVideoId}/0.jpg`;
      this.dimensionsStyle = `width: ${this.width}px; height: ${this.height}px;`;
      this.thumbnailStyle = `width: ${this.width}px; height: ${this.height}px; background: url("${this.thumbnailSrc}") black no-repeat center center;`
    }
    this.acceptedCookie = this.cookieService.hasAccepted("youtube");
  }

}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageSectionComponent } from './page-section/page-section.component';
import { CursorComponent } from './cursor/cursor.component';
import { PageSectionNavigationBarComponent } from './page-section-navigation-bar/page-section-navigation-bar.component';
import { LazyEnlargeableMediaComponent } from './lazy-enlargeable-media/lazy-enlargeable-media.component';
import { MediaZoomModalComponent } from './media-zoom-modal/media-zoom-modal.component';
import { SharedDirectivesModule } from '../directives/shared-directives.module';
import { PageCoverComponent } from './page-cover/page-cover.component';
import { VerticalDivideComponent } from './vertical-divide/vertical-divide.component';
import { YoutubeVideoComponent } from './youtube-video/youtube-video.component';
import { SafePipe } from 'safe-pipe';
import { ScrollableZoomableLazyMultiMediaGalleryComponent } from './scrollable-zoomable-lazy-multi-media-gallery/scrollable-zoomable-lazy-multi-media-gallery.component';
import { MediaElementComponent } from './media-element/media-element.component';
import { ElapsedTimeComponent } from './elapsed-time/elapsed-time.component';
import { QuoteComponent } from './quote/quote.component';
import { QuoteWithAuthorComponent } from './quote-with-author/quote-with-author.component';
import { WebgpuBannerComponent } from './webgpu-banner/webgpu-banner.component';
import { WebgpuSierpinskiGasketComponent } from './webgpu-sierpinski-gasket/webgpu-sierpinski-gasket.component';

@NgModule({
  declarations: [
    PageSectionComponent,
    CursorComponent,
    PageSectionNavigationBarComponent,
    LazyEnlargeableMediaComponent,
    MediaZoomModalComponent,
    PageCoverComponent,
    VerticalDivideComponent,
    YoutubeVideoComponent,
    SafePipe,
    ScrollableZoomableLazyMultiMediaGalleryComponent,
    MediaElementComponent,
    ElapsedTimeComponent,
    QuoteComponent,
    QuoteWithAuthorComponent,
    WebgpuBannerComponent,
    WebgpuSierpinskiGasketComponent
  ],
  exports: [
    PageSectionComponent,
    CursorComponent,
    PageSectionNavigationBarComponent,
    LazyEnlargeableMediaComponent,
    MediaZoomModalComponent,
    PageCoverComponent,
    VerticalDivideComponent,
    YoutubeVideoComponent,
    ScrollableZoomableLazyMultiMediaGalleryComponent,
    MediaElementComponent,
    ElapsedTimeComponent,
    QuoteComponent,
    QuoteWithAuthorComponent,
    WebgpuBannerComponent,
    WebgpuSierpinskiGasketComponent
  ],
  imports: [
    CommonModule,
    SharedDirectivesModule
  ]
})
export class ComponentsModule { }

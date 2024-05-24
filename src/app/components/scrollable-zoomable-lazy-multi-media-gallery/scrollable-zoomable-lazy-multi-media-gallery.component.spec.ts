import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ScrollableZoomableLazyMultiMediaGalleryComponent } from './scrollable-zoomable-lazy-multi-media-gallery.component';

describe('ScrollableZoomableLazyMultiMediaGalleryComponent', () => {
  let component: ScrollableZoomableLazyMultiMediaGalleryComponent;
  let fixture: ComponentFixture<ScrollableZoomableLazyMultiMediaGalleryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ScrollableZoomableLazyMultiMediaGalleryComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ScrollableZoomableLazyMultiMediaGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

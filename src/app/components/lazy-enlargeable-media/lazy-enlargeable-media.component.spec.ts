import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LazyEnlargeableMediaComponent } from './lazy-enlargeable-media.component';

describe('LazyEnlargeableMediaComponent', () => {
  let component: LazyEnlargeableMediaComponent;
  let fixture: ComponentFixture<LazyEnlargeableMediaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LazyEnlargeableMediaComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LazyEnlargeableMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PageSectionNavigationBarComponent } from './page-section-navigation-bar.component';

describe('IntraPageNavigationBarComponent', () => {
  let component: PageSectionNavigationBarComponent;
  let fixture: ComponentFixture<PageSectionNavigationBarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PageSectionNavigationBarComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PageSectionNavigationBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

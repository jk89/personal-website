import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WebgpuSierpinskiGasketComponent } from './webgpu-sierpinski-gasket.component';

describe('WebgpuSierpinskiGasketComponent', () => {
  let component: WebgpuSierpinskiGasketComponent;
  let fixture: ComponentFixture<WebgpuSierpinskiGasketComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WebgpuSierpinskiGasketComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WebgpuSierpinskiGasketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

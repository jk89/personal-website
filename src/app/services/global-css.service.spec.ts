import { TestBed } from '@angular/core/testing';

import { GlobalCssService } from './global-css.service';

describe('GlobalCssService', () => {
  let service: GlobalCssService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalCssService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

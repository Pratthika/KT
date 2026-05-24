import { TestBed } from '@angular/core/testing';

import { PayslippdfService } from './payslippdf.service';

describe('PayslippdfService', () => {
  let service: PayslippdfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayslippdfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayslippdfComponent } from './payslippdf.component';

describe('PayslippdfComponent', () => {
  let component: PayslippdfComponent;
  let fixture: ComponentFixture<PayslippdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayslippdfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayslippdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

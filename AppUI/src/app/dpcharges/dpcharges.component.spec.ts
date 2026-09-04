import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DPChargesComponent } from './dpcharges.component';

describe('DPChargesComponent', () => {
  let component: DPChargesComponent;
  let fixture: ComponentFixture<DPChargesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DPChargesComponent]
    });
    fixture = TestBed.createComponent(DPChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

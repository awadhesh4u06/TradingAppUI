import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FyFundsComponent } from './fy-funds.component';

describe('FyFundsComponent', () => {
  let component: FyFundsComponent;
  let fixture: ComponentFixture<FyFundsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FyFundsComponent]
    });
    fixture = TestBed.createComponent(FyFundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

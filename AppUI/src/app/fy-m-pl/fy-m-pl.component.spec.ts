import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FyMPLComponent } from './fy-m-pl.component';

describe('FyMPLComponent', () => {
  let component: FyMPLComponent;
  let fixture: ComponentFixture<FyMPLComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FyMPLComponent]
    });
    fixture = TestBed.createComponent(FyMPLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FYPLComponent } from './fy-pl.component';

describe('FYPLComponent', () => {
  let component: FYPLComponent;
  let fixture: ComponentFixture<FYPLComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FYPLComponent]
    });
    fixture = TestBed.createComponent(FYPLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

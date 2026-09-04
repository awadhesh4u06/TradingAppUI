import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FYDividentComponent } from './fy-divident.component';

describe('FYDividentComponent', () => {
  let component: FYDividentComponent;
  let fixture: ComponentFixture<FYDividentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FYDividentComponent]
    });
    fixture = TestBed.createComponent(FYDividentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

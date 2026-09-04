import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LICDetailsComponent } from './lic-details.component';

describe('LICDetailsComponent', () => {
  let component: LICDetailsComponent;
  let fixture: ComponentFixture<LICDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LICDetailsComponent]
    });
    fixture = TestBed.createComponent(LICDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

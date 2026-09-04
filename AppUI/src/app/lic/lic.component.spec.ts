import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LICComponent } from './lic.component';

describe('LICComponent', () => {
  let component: LICComponent;
  let fixture: ComponentFixture<LICComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LICComponent]
    });
    fixture = TestBed.createComponent(LICComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

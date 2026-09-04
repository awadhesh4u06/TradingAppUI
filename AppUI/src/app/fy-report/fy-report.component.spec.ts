import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FYReportComponent } from './fy-report.component';

describe('FYReportComponent', () => {
  let component: FYReportComponent;
  let fixture: ComponentFixture<FYReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FYReportComponent]
    });
    fixture = TestBed.createComponent(FYReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

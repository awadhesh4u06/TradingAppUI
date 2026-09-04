import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectorReportComponent } from './sector-report.component';

describe('SectorReportComponent', () => {
  let component: SectorReportComponent;
  let fixture: ComponentFixture<SectorReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SectorReportComponent]
    });
    fixture = TestBed.createComponent(SectorReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

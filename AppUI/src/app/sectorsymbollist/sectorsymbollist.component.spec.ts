import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectorsymbollistComponent } from './sectorsymbollist.component';

describe('SectorsymbollistComponent', () => {
  let component: SectorsymbollistComponent;
  let fixture: ComponentFixture<SectorsymbollistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SectorsymbollistComponent]
    });
    fixture = TestBed.createComponent(SectorsymbollistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

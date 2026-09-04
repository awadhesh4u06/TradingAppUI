import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ICGraphComponent } from './icgraph.component';

describe('ICGraphComponent', () => {
  let component: ICGraphComponent;
  let fixture: ComponentFixture<ICGraphComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ICGraphComponent]
    });
    fixture = TestBed.createComponent(ICGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

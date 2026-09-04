import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DivgraphComponent } from './divgraph.component';

describe('DivgraphComponent', () => {
  let component: DivgraphComponent;
  let fixture: ComponentFixture<DivgraphComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DivgraphComponent]
    });
    fixture = TestBed.createComponent(DivgraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

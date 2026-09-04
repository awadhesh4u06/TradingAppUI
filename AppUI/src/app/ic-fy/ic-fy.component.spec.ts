import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ICFyComponent } from './ic-fy.component';

describe('ICFyComponent', () => {
  let component: ICFyComponent;
  let fixture: ComponentFixture<ICFyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ICFyComponent]
    });
    fixture = TestBed.createComponent(ICFyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

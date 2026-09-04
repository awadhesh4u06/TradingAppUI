import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeLotComponent } from './trade-lot.component';

describe('TradeLotComponent', () => {
  let component: TradeLotComponent;
  let fixture: ComponentFixture<TradeLotComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TradeLotComponent]
    });
    fixture = TestBed.createComponent(TradeLotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

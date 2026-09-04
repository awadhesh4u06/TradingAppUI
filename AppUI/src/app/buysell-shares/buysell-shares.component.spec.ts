import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuySellSharesComponent } from './buysell-shares.component';

describe('BuySellSharesComponent', () => {
  let component: BuySellSharesComponent;
  let fixture: ComponentFixture<BuySellSharesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BuySellSharesComponent]
    });
    fixture = TestBed.createComponent(BuySellSharesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetFundsComponent } from './get-funds.component';

describe('GetFundsComponent', () => {
  let component: GetFundsComponent;
  let fixture: ComponentFixture<GetFundsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GetFundsComponent]
    });
    fixture = TestBed.createComponent(GetFundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetBrokerageComponent } from './get-brokerage.component';

describe('GetBrokerageComponent', () => {
  let component: GetBrokerageComponent;
  let fixture: ComponentFixture<GetBrokerageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GetBrokerageComponent]
    });
    fixture = TestBed.createComponent(GetBrokerageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

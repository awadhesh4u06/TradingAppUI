import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetDividentsComponent } from './get-dividents.component';

describe('GetDividentsComponent', () => {
  let component: GetDividentsComponent;
  let fixture: ComponentFixture<GetDividentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GetDividentsComponent]
    });
    fixture = TestBed.createComponent(GetDividentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmdailogComponent } from './confirmdailog.component';

describe('ConfirmdailogComponent', () => {
  let component: ConfirmdailogComponent;
  let fixture: ComponentFixture<ConfirmdailogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmdailogComponent]
    });
    fixture = TestBed.createComponent(ConfirmdailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

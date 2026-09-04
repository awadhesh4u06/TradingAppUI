import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDividentComponent } from './update-divident.component';

describe('UpdateDividentComponent', () => {
  let component: UpdateDividentComponent;
  let fixture: ComponentFixture<UpdateDividentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateDividentComponent]
    });
    fixture = TestBed.createComponent(UpdateDividentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

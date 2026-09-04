import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSymbolComponent } from './add-symbol.component';

describe('AddSymbolComponent', () => {
  let component: AddSymbolComponent;
  let fixture: ComponentFixture<AddSymbolComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddSymbolComponent]
    });
    fixture = TestBed.createComponent(AddSymbolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateQueryComponent } from './generate-query.component';

describe('GenerateQueryComponent', () => {
  let component: GenerateQueryComponent;
  let fixture: ComponentFixture<GenerateQueryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenerateQueryComponent]
    });
    fixture = TestBed.createComponent(GenerateQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AmcComponent } from './amc.component';

describe('AmcComponent', () => {
  let component: AmcComponent;
  let fixture: ComponentFixture<AmcComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AmcComponent]
    });
    fixture = TestBed.createComponent(AmcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

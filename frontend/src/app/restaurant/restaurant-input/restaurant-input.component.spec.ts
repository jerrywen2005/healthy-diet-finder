import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantInputComponent } from './restaurant-input.component';

describe('InputComponent', () => {
  let component: RestaurantInputComponent;
  let fixture: ComponentFixture<RestaurantInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestaurantInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestaurantInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

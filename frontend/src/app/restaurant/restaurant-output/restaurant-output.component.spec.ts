import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantOutputComponent } from './restaurant-output.component';

describe('RestaurantOutputComponent', () => {
  let component: RestaurantOutputComponent;
  let fixture: ComponentFixture<RestaurantOutputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestaurantOutputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestaurantOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

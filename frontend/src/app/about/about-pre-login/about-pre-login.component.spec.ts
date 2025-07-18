import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutPreLoginComponent } from './about-pre-login.component';

describe('AboutPreLoginComponent', () => {
  let component: AboutPreLoginComponent;
  let fixture: ComponentFixture<AboutPreLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutPreLoginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutPreLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

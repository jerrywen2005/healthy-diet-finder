import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AboutPostLoginComponent } from './about-post-login.component';

describe('AboutPostLoginComponent', () => {
  let component: AboutPostLoginComponent;
  let fixture: ComponentFixture<AboutPostLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutPostLoginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutPostLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

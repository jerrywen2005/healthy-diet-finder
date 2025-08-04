import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DnaOutputComponent } from './dna-output.component';

describe('DnaOutputComponent', () => {
  let component: DnaOutputComponent;
  let fixture: ComponentFixture<DnaOutputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DnaOutputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DnaOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EolicaComponent } from './eolica.component';

describe('EolicaComponent', () => {
  let component: EolicaComponent;
  let fixture: ComponentFixture<EolicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EolicaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EolicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

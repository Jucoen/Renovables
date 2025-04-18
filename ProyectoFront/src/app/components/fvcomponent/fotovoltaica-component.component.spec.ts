import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FotovoltaicaComponentComponent } from './fotovoltaica-component.component';

describe('FotovoltaicaComponentComponent', () => {
  let component: FotovoltaicaComponentComponent;
  let fixture: ComponentFixture<FotovoltaicaComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FotovoltaicaComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FotovoltaicaComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

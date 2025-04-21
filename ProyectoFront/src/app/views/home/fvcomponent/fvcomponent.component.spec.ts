import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FVComponentComponent } from './fvcomponent.component';

describe('FVComponentComponent', () => {
  let component: FVComponentComponent;
  let fixture: ComponentFixture<FVComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FVComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FVComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FVComponentFormComponent } from './fvcomponentform.component';


describe('FvcomponentformComponent', () => {
  let component: FVComponentFormComponent;
  let fixture: ComponentFixture<FVComponentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FVComponentFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FVComponentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

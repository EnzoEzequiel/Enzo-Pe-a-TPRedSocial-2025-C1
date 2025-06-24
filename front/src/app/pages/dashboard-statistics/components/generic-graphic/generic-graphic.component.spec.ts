import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericGraphicComponent } from './generic-graphic.component';

describe('GenericGraphicComponent', () => {
  let component: GenericGraphicComponent;
  let fixture: ComponentFixture<GenericGraphicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericGraphicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericGraphicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

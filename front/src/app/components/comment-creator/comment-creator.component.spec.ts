import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentCreatorComponent } from './comment-creator.component';

describe('CommentCreatorComponent', () => {
  let component: CommentCreatorComponent;
  let fixture: ComponentFixture<CommentCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentCreatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

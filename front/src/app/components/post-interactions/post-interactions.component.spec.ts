import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostInteractionsComponent } from './post-interactions.component';

describe('PostInteractionsComponent', () => {
  let component: PostInteractionsComponent;
  let fixture: ComponentFixture<PostInteractionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostInteractionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostInteractionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

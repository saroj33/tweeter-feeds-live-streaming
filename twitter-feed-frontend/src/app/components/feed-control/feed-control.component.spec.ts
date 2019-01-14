import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedControlComponent } from './feed-control.component';

describe('FeedControlComponent', () => {
  let component: FeedControlComponent;
  let fixture: ComponentFixture<FeedControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

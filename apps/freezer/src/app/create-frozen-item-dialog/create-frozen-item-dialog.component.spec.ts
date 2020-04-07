import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFrozenItemDialogComponent } from './create-frozen-item-dialog.component';

describe('CreateFrozenItemDialogComponent', () => {
  let component: CreateFrozenItemDialogComponent;
  let fixture: ComponentFixture<CreateFrozenItemDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateFrozenItemDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateFrozenItemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

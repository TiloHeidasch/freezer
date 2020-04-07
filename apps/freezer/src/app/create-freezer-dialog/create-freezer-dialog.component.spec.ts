import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFreezerDialogComponent } from './create-freezer-dialog.component';

describe('CreateFreezerDialogComponent', () => {
  let component: CreateFreezerDialogComponent;
  let fixture: ComponentFixture<CreateFreezerDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateFreezerDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateFreezerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

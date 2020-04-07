import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFreezerSlotDialogComponent } from './create-freezer-slot-dialog.component';

describe('CreateFreezerSlotDialogComponent', () => {
  let component: CreateFreezerSlotDialogComponent;
  let fixture: ComponentFixture<CreateFreezerSlotDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateFreezerSlotDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateFreezerSlotDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

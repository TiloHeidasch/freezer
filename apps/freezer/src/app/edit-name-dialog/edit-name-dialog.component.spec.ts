import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditNameDialogComponent } from './edit-name-dialog.component';

describe('EditNameDialogComponent', () => {
  let component: EditNameDialogComponent;
  let fixture: ComponentFixture<EditNameDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditNameDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditNameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

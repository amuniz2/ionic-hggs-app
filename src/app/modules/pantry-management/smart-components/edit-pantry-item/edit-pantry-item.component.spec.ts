import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPantryItemComponent } from './edit-pantry-item.component';

describe('AddPantryItemComponent', () => {
  let component: EditPantryItemComponent;
  let fixture: ComponentFixture<EditPantryItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPantryItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPantryItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

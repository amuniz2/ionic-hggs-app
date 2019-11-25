import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPantryItemDetailsComponent } from './edit-pantry-item-details.component';

describe('EditPantryItemDetailsComponent', () => {
  let component: EditPantryItemDetailsComponent;
  let fixture: ComponentFixture<EditPantryItemDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPantryItemDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPantryItemDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

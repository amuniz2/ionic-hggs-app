import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPantryItemLocationComponent } from './edit-pantry-item-location.component';

describe('AddPantryItemLocationComponent', () => {
  let component: EditPantryItemLocationComponent;
  let fixture: ComponentFixture<EditPantryItemLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPantryItemLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPantryItemLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

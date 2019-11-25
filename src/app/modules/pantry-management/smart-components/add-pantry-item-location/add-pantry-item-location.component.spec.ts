import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPantryItemLocationComponent } from './add-pantry-item-location.component';

describe('AddPantryItemLocationComponent', () => {
  let component: AddPantryItemLocationComponent;
  let fixture: ComponentFixture<AddPantryItemLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPantryItemLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPantryItemLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

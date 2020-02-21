import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPantryItemComponent } from './add-pantry-item.component';

describe('AddPantryItemComponent', () => {
  let component: AddPantryItemComponent;
  let fixture: ComponentFixture<AddPantryItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPantryItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPantryItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

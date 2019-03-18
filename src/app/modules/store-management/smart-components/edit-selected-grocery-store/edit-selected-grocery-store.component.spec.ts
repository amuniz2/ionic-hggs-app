import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSelectedGroceryStoreComponent } from './edit-selected-grocery-store.component';

describe('EditSelectedGroceryStoreComponent', () => {
  let component: EditSelectedGroceryStoreComponent;
  let fixture: ComponentFixture<EditSelectedGroceryStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSelectedGroceryStoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSelectedGroceryStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

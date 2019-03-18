import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGroceryStoreComponent } from './edit-grocery-store.component';

describe('EditGroceryStoreComponent', () => {
  let component: EditGroceryStoreComponent;
  let fixture: ComponentFixture<EditGroceryStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditGroceryStoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGroceryStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

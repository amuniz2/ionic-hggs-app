import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGroceryStoreComponent } from './add-grocery-store';

describe('StoreManagementComponent', () => {
  let component: AddGroceryStoreComponent;
  let fixture: ComponentFixture<AddGroceryStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddGroceryStoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGroceryStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

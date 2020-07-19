import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGroceryStoreModalComponent } from './add-grocery-store-modal.component';

describe('AddGroceryStoreModalComponent', () => {
  let component: AddGroceryStoreModalComponent;
  let fixture: ComponentFixture<AddGroceryStoreModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddGroceryStoreModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGroceryStoreModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

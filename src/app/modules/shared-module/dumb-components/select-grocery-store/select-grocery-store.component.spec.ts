import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectGroceryStoreComponent } from './select-grocery-store.component';

describe('SelectGroceryStoreComponent', () => {
  let component: SelectGroceryStoreComponent;
  let fixture: ComponentFixture<SelectGroceryStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectGroceryStoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectGroceryStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

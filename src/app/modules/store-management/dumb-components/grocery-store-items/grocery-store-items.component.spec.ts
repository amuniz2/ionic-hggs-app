import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroceryStoreItemsComponent } from './grocery-store-items.component';

describe('GroceryStoreItemsComponent', () => {
  let component: GroceryStoreItemsComponent;
  let fixture: ComponentFixture<GroceryStoreItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroceryStoreItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroceryStoreItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

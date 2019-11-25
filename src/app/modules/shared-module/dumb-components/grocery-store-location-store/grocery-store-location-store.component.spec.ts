import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroceryStoreLocationStoreComponent } from './grocery-store-location-store.component';

describe('GroceryStoreLocationStoreComponent', () => {
  let component: GroceryStoreLocationStoreComponent;
  let fixture: ComponentFixture<GroceryStoreLocationStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroceryStoreLocationStoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroceryStoreLocationStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

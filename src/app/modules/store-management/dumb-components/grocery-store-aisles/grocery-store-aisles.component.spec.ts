import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroceryStoreAislesComponent } from './grocery-store-aisles.component';

describe('GroceryStoreAislesComponent', () => {
  let component: GroceryStoreAislesComponent;
  let fixture: ComponentFixture<GroceryStoreAislesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroceryStoreAislesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroceryStoreAislesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

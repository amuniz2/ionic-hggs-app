import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroceryStoreLocationAisleOrSectionComponent } from './grocery-store-location-aisle-or-section.component';

describe('GroceryStoreLocationAisleComponent', () => {
  let component: GroceryStoreLocationAisleOrSectionComponent;
  let fixture: ComponentFixture<GroceryStoreLocationAisleOrSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroceryStoreLocationAisleOrSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroceryStoreLocationAisleOrSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

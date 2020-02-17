import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroceryStoreAislesOrSectionsComponent } from './grocery-store-aisles-or-sections.component';

describe('GroceryStoreAislesComponent', () => {
  let component: GroceryStoreAislesOrSectionsComponent;
  let fixture: ComponentFixture<GroceryStoreAislesOrSectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroceryStoreAislesOrSectionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroceryStoreAislesOrSectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

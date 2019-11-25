import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroceryStoreSectionsComponent } from './grocery-store-sections.component';

describe('GroceryStoreSectionsComponent', () => {
  let component: GroceryStoreSectionsComponent;
  let fixture: ComponentFixture<GroceryStoreSectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroceryStoreSectionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroceryStoreSectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

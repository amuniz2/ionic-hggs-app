import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PantryItemListComponent } from './pantry-item-list.component';

describe('PantryInventoryListComponent', () => {
  let component: PantryItemListComponent;
  let fixture: ComponentFixture<PantryItemListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PantryItemListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PantryItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

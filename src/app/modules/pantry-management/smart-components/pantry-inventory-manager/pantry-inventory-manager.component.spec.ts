import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PantryInventoryManagerComponent } from './pantry-inventory-manager.component';

describe('PantryInventoryManagerComponent', () => {
  let component: PantryInventoryManagerComponent;
  let fixture: ComponentFixture<PantryInventoryManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PantryInventoryManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PantryInventoryManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

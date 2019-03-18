import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreInventoryManagerPageComponent } from './store-inventory-manager-page.component';

describe('StoreInventoryManagerPageComponent', () => {
  let component: StoreInventoryManagerPageComponent;
  let fixture: ComponentFixture<StoreInventoryManagerPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreInventoryManagerPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreInventoryManagerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

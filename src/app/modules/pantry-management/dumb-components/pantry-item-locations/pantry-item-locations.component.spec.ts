import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PantryItemLocationsComponent } from './pantry-item-locations.component';

describe('PantryItemLocationsComponent', () => {
  let component: PantryItemLocationsComponent;
  let fixture: ComponentFixture<PantryItemLocationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PantryItemLocationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PantryItemLocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

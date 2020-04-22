import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PantryItemLocationsComponent } from './pantry-item-locations.component';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

describe('PantryItemLocationsComponent', () => {
  let component: PantryItemLocationsComponent;
  let fixture: ComponentFixture<PantryItemLocationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PantryItemLocationsComponent ],
      imports: [
        IonicModule,
        FormsModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
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

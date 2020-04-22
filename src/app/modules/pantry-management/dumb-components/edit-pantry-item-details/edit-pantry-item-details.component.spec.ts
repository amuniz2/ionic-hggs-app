import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPantryItemDetailsComponent } from './edit-pantry-item-details.component';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {HggsAccordionComponent} from '../../../shared-module/widgets/hggs-accordion/hggs-accordion.component';
import {PantryItemLocationsComponent} from '../pantry-item-locations/pantry-item-locations.component';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';

describe('EditPantryItemDetailsComponent', () => {
  let component: EditPantryItemDetailsComponent;
  let fixture: ComponentFixture<EditPantryItemDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HggsAccordionComponent,
        PantryItemLocationsComponent,
        EditPantryItemDetailsComponent
      ],
      imports: [
        IonicModule,
        FormsModule,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPantryItemDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

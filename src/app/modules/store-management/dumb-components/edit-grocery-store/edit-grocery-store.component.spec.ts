import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGroceryStoreComponent } from './edit-grocery-store.component';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {GroceryStoreAislesOrSectionsComponent} from '../grocery-store-aisles-or-sections/grocery-store-aisles-or-sections.component';
import {HggsAccordionComponent} from '../../../shared-module/widgets/hggs-accordion/hggs-accordion.component';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {RouterTestingModule} from '@angular/router/testing';

describe('EditGroceryStoreComponent', () => {
  let component: EditGroceryStoreComponent;
  let fixture: ComponentFixture<EditGroceryStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EditGroceryStoreComponent,
        GroceryStoreAislesOrSectionsComponent,
        HggsAccordionComponent
      ],
      imports: [
        IonicModule,
        FormsModule,
        RouterTestingModule,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGroceryStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroceryStoreLocationAisleOrSectionComponent } from './grocery-store-location-aisle-or-section.component';
import {IonicModule} from '@ionic/angular';
import {ControlContainer, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

describe('GroceryStoreLocationAisleOrSectionComponent', () => {
  let component: GroceryStoreLocationAisleOrSectionComponent;
  let fixture: ComponentFixture<GroceryStoreLocationAisleOrSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroceryStoreLocationAisleOrSectionComponent ],
      imports: [
        BrowserModule,
        CommonModule,
        IonicModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [
        { provide: ControlContainer,  useValue: { control: new FormGroup({locationAisle: new FormControl()})} }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroceryStoreLocationAisleOrSectionComponent);
    component = fixture.componentInstance;
    component.inputControlName = 'locationAisle:';
    component.groceryStoreAislesOrSections = [];
    component.label = 'Aisles';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

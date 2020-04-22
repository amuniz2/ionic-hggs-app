import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPantryItemComponent } from './add-pantry-item.component';
import {HggsAccordionComponent} from '../../../shared-module/widgets/hggs-accordion/hggs-accordion.component';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';

describe('AddPantryItemComponent', () => {
  let component: AddPantryItemComponent;
  let fixture: ComponentFixture<AddPantryItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HggsAccordionComponent,
        AddPantryItemComponent,
      ],
      imports: [
        IonicModule,
        FormsModule,
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPantryItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

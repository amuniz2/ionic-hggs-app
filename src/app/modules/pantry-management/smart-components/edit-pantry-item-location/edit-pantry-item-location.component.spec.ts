import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPantryItemLocationComponent } from './edit-pantry-item-location.component';
import {IonicModule} from '@ionic/angular';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// tslint:disable-next-line:max-line-length
import {GroceryStoreLocationStoreComponent} from '../../../shared-module/dumb-components/grocery-store-location-store/grocery-store-location-store.component';
// tslint:disable-next-line:max-line-length
import {RouterTestingModule} from '@angular/router/testing';
import {StoreModule} from '@ngrx/store';
import {reducers} from '../../../../store/app.reducers';
import {FakePantryDataService} from '../../../../services/fake-pantry-data.service';
import {IPantryDataService} from '../../../../services/IPantryDataService';
import {Inject} from '@angular/core';
import {GroceryStoreLocationAisleOrSectionComponent} from '../../../shared-module/dumb-components/grocery-store-location-aisle-or-section/grocery-store-location-aisle-or-section.component';

describe('EditPantryItemLocationComponent', () => {
  let component: EditPantryItemLocationComponent;
  let fixture: ComponentFixture<EditPantryItemLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EditPantryItemLocationComponent,
        GroceryStoreLocationStoreComponent,
        GroceryStoreLocationAisleOrSectionComponent,
      ],
      imports: [
        IonicModule,
        FormsModule,
        RouterTestingModule,
        ReactiveFormsModule,
        StoreModule.forRoot(reducers, {
        }),
      ],
      providers: [
        [{provide: 'IPantryDataService', useClass: FakePantryDataService}]
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPantryItemLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

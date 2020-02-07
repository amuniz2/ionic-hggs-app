import {Component, Inject, OnInit} from '@angular/core';
import {GroceryStore} from '../../../../model/grocery-store';
import {Observable, of} from 'rxjs';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../store/app.state';
import * as fromSelectors from '../../../../store/store-management.selectors';
import {GroceryStoreLocation} from '../../../../model/grocery-store-location';
import {LoadGroceryStores, LocationGroceryStoreSelected} from '../../../../store';
import {IPantryDataService} from '../../../../services/IPantryDataService';
// tslint:disable-next-line:max-line-length
import {GroceryStoreSelected} from '../../../shared-module/dumb-components/grocery-store-location-store/grocery-store-location-store.component';
import {
  getGroceryItemsLocationsState,
  getGroceryStoreLocation,
  getGroceryStoresState, selectGroceryStoreLocation,
  selectGroceryStoresLoading
} from '../../../../store/store-management.selectors';
// tslint:disable-next-line:max-line-length
import {GroceryStoreAisleOrSectionSelected} from '../../../shared-module/dumb-components/grocery-store-location/grocery-store-location-aisle-or-section.component';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {AddPantryItemLocation, UpdatePantryItemLocation} from '../../store/pantry-management.actions';
import {ActivatedRoute} from '@angular/router';

export interface NewItemLocation {
  itemId: number;
  location: GroceryStoreLocation;
}

@Component({
  selector: 'app-add-pantry-item-location',
  templateUrl: './edit-pantry-item-location.component.html',
  styleUrls: ['./edit-pantry-item-location.component.scss']
})
export class EditPantryItemLocationComponent implements OnInit {

  groceryStores$: Observable<GroceryStore[]>;
  groceryStoreAisles$: Observable<string[]>;
  groceryStoreSections$: Observable<string[]>;

  selectedGroceryStoreId$: Observable<number>;

  AisleLabel = 'Aisle';
  SectionLabel = 'Section';

  locationForm: FormGroup;

  selectedGroceryStoreLocation$: Observable<GroceryStoreLocation>;
  selectedGroceryStoreId: number;
  selectedGroceryStoreAisle: string;
  selectedGroceryStoreSection: string;

  private groceryStoresLoading$: Observable<boolean>;
  private locationId: any;

  constructor(private store: Store<AppState>,
              @Inject('IPantryDataService') private pantryDataService: IPantryDataService,
              private fb: FormBuilder,
              private activeRoute: ActivatedRoute) {
    this.store.dispatch(new LoadGroceryStores());
    this.locationId = this.activeRoute.snapshot.params.locationId;
  }

  ngOnInit() {
    this.groceryStoresLoading$ = this.store.select(selectGroceryStoresLoading);
    this.groceryStores$ = this.store.select(fromSelectors.selectAllGroceryStores);
    if (this.locationId != null) {
      this.selectedGroceryStoreLocation$ = this.store.select(selectGroceryStoreLocation(this.locationId));
    } else {
      this.selectedGroceryStoreLocation$ = of({
          id: null,
          aisle: '',
          section: '',
          storeId: null,
          storeName: null
        });
    }
    this.locationForm = this.fb.group({
      locationStore: [this.selectedGroceryStoreId],
      locationAisle: [this.selectedGroceryStoreAisle],
      locationSection: [this.selectedGroceryStoreSection]
    });
  }

  getSelectedGroceryStore(): Observable<GroceryStore> {
    let storeId: number = null;

    this.selectedGroceryStoreLocation$.subscribe(location => {
      storeId = location.storeId;
    });
    return this.store.select(fromSelectors.selectGroceryStore(storeId));
  }

  onChangeLocationGroceryStore($event: GroceryStoreSelected) {
    // this.groceryStoreLocation.storeId = $event.id;
    this.store.dispatch(new LocationGroceryStoreSelected($event.id));
    this.selectedGroceryStoreId = $event.id;
    this.groceryStoreAisles$ = this.store.select(fromSelectors.selectGroceryStoreAisles($event.id));
    this.groceryStoreSections$ = this.store.select(fromSelectors.selectGroceryStoreSections($event.id));
  }

  onChangeAisle($event: GroceryStoreAisleOrSectionSelected) {
    this.selectedGroceryStoreAisle = $event.name;
  }

  onChangeSection($event: GroceryStoreAisleOrSectionSelected) {
    this.selectedGroceryStoreSection = $event.name;
  }

  onSubmit(value: any) {
    // add the location to the pantry item
    console.log(`GroceryStoreLocation: ${this.selectedGroceryStoreId},
    aisle: ${this.selectedGroceryStoreAisle}, section: ${this.selectedGroceryStoreSection}`);
    console.log('LocationForm: ');
    console.log(this.locationForm);
    if (this.locationForm.valid) {
      if (this.locationId == null) {
        this.store.dispatch(new AddPantryItemLocation({
          itemId: +this.activeRoute.snapshot.params.id,
          location: {
            storeName: null,
            storeId: this.selectedGroceryStoreId,
            aisle: this.selectedGroceryStoreAisle,
            section: this.selectedGroceryStoreSection,
            id: null
          }
        }));
      } else {
        this.store.dispatch(new UpdatePantryItemLocation(+this.locationId, {
          itemId: +this.activeRoute.snapshot.params.id,
          location: {
            storeName: null,
            storeId: this.selectedGroceryStoreId,
            aisle: this.selectedGroceryStoreAisle,
            section: this.selectedGroceryStoreSection,
            id: +this.locationId
          }
        }));
      }
    }
  }
}

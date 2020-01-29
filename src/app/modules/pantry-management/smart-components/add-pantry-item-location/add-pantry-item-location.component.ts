import {Component, Inject, OnInit} from '@angular/core';
import {GroceryStore} from '../../../../model/grocery-store';
import {Observable, of} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../../store/app.state';
import * as fromSelectors from '../../../../store/store-management.selectors';
import {GroceryStoreLocation} from '../../../../model/grocery-store-location';
import {LoadGroceryStores, LocationGroceryStoreSelected} from '../../../../store';
import {IPantryDataService} from '../../../../services/IPantryDataService';
// tslint:disable-next-line:max-line-length
import {GroceryStoreSelected} from '../../../shared-module/dumb-components/grocery-store-location-store/grocery-store-location-store.component';
import {selectGroceryStoresLoading} from '../../../../store/store-management.selectors';
// tslint:disable-next-line:max-line-length
import {GroceryStoreAisleOrSectionSelected} from '../../../shared-module/dumb-components/grocery-store-location/grocery-store-location-aisle-or-section.component';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-add-pantry-item-location',
  templateUrl: './add-pantry-item-location.component.html',
  styleUrls: ['./add-pantry-item-location.component.scss']
})
export class AddPantryItemLocationComponent implements OnInit {

  groceryStores$: Observable<GroceryStore[]>;
  groceryStoreAisles$: Observable<string[]>;
  groceryStoreSections$: Observable<string[]>;
  selectedGroceryStoreId$: Observable<number>;

  AisleLabel = 'Aisle';
  SectionLabel = 'Section';

  locationStore = new FormControl('');
  locationAisle = new FormControl('');
  locationSection =  new FormControl('');

  locationForm: FormGroup;
  // = new FormGroup({
  //   locationStore: this.locationStore,
  //   locationAisle: this.locationAisle,
  //   locationSection:  this.locationSection,
  //   selectGroceryStoreControl: new FormControl('')
  // });

  groceryStoreLocation: GroceryStoreLocation;
  private groceryStoresLoading$: Observable<boolean>;

//  selectedGroceryStoreId: number = null;
  constructor(private store: Store<AppState>, @Inject('IPantryDataService') private pantryDataService: IPantryDataService, private fb: FormBuilder) {
    this.store.dispatch(new LoadGroceryStores());
    this.groceryStoreLocation = {
      id: null,
      aisle: '',
      section: '',
      storeId: null
    };

    this.locationForm = this.fb.group({
      locationStore: [''],
      locationAisle: [''],
      locationSection: ['']
    })
  }

  ngOnInit() {
    this.groceryStoresLoading$ = this.store.select(selectGroceryStoresLoading);
    this.groceryStores$ = this.store.select(fromSelectors.selectAllGroceryStores);
    this.selectedGroceryStoreId$ = of(null);
  }

  getSelectedGroceryStore(): Observable<GroceryStore> {
    let storeId: number = null;
    this.selectedGroceryStoreId$.subscribe(id => {
      storeId = id;
    });
    return this.store.select(fromSelectors.selectGroceryStore(storeId));
  }

  onChangeLocationGroceryStore($event: GroceryStoreSelected) {
    this.groceryStoreLocation.storeId = $event.id;
    this.store.dispatch(new LocationGroceryStoreSelected($event.id));
    this.selectedGroceryStoreId$ = of($event.id);
    this.groceryStoreAisles$ = this.store.select(fromSelectors.selectGroceryStoreAisles($event.id));
    this.groceryStoreSections$ = this.store.select(fromSelectors.selectGroceryStoreSections($event.id));
  }

  onChangeAisle($event: GroceryStoreAisleOrSectionSelected) {
    this.groceryStoreLocation.aisle = $event.name;
  }

  onChangeSection($event: GroceryStoreAisleOrSectionSelected) {
    this.groceryStoreLocation.section = $event.name;
  }

  onSubmit(value: any) {
    // add the location to the pantry item
    console.log('GroceryStoreLocation: ');
    console.log(this.groceryStoreLocation);
    console.log('LocationForm: ');
    console.log(this.locationForm);
    // if (this.locationForm.valid)
    //   this.store.dispatch(new AddItemLocation(this.groceryStoreLocation));
    // return to previous form
  }
}

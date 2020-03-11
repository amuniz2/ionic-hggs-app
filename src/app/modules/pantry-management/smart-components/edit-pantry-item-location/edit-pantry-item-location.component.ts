import {Component, Inject, OnInit} from '@angular/core';
import {GroceryStore} from '../../../../model/grocery-store';
import {Observable, of} from 'rxjs';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../store/app.state';
import * as fromSelectors from '../../../../store/store-management.selectors';
import {GroceryStoreLocation} from '../../../../model/grocery-store-location';
import {LoadGroceryStores, LocationGroceryStoreSelected} from '../../../../store';
import {IPantryDataService} from '../../../../services/IPantryDataService';
import {
  selectGroceryStore, selectGroceryStoreLocation,
  selectGroceryStoresLoading
} from '../../../../store/store-management.selectors';
// tslint:disable-next-line:max-line-length
import {GroceryStoreAisleOrSectionSelected} from '../../../shared-module/dumb-components/grocery-store-location/grocery-store-location-aisle-or-section.component';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {AddPantryItemLocation, UpdatePantryItemLocation} from '../../store/pantry-management.actions';
import {ActivatedRoute, Router} from '@angular/router';
import {withLatestFrom} from 'rxjs/operators';

export interface NewItemLocation {
  itemId: number;
  location: GroceryStoreLocation;
}

@Component({
  selector: 'app-edit-pentry-item-location',
  templateUrl: './edit-pantry-item-location.component.html',
  styleUrls: ['./edit-pantry-item-location.component.scss']
})
export class EditPantryItemLocationComponent implements OnInit {

  groceryStores$: Observable<GroceryStore[]>;
  groceryStoreAisles$: Observable<string[]>;
  groceryStoreSections$: Observable<string[]>;
  selectedGroceryStore$: Observable<GroceryStore>;

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
              private activeRoute: ActivatedRoute,
              private router: Router) {
    this.store.dispatch(new LoadGroceryStores());
    this.groceryStoresLoading$ = this.store.select(selectGroceryStoresLoading);
    this.groceryStores$ = this.store.select(fromSelectors.selectAllGroceryStores);
    this.locationId = this.activeRoute.snapshot.params.locationId;
    if (this.locationId != null) {
      this.selectedGroceryStoreLocation$ = this.store.select(selectGroceryStoreLocation(this.locationId));
      this.selectedGroceryStoreAisle = this.router.getCurrentNavigation().extras.queryParams.aisle;
      this.selectedGroceryStoreSection = this.router.getCurrentNavigation().extras.queryParams.section;
      this.selectedGroceryStoreId = this.router.getCurrentNavigation().extras.queryParams.storeId;
      this.selectedGroceryStore$ = this.store.select(fromSelectors.selectGroceryStore(this.selectedGroceryStoreId));

      this.selectGroceryStore(this.selectedGroceryStoreId);
      // this.selectedGroceryStoreName = this.router.getCurrentNavigation().extras.queryParams.storeName;
    } else {
      this.selectedGroceryStoreLocation$ = of({
        id: null,
        aisle: '',
        section: '',
        storeId: null,
        storeName: null
      });
    }
    let groceryStoreValue: GroceryStore = null;
    if (this.selectedGroceryStore$ != null) {
      this.selectedGroceryStore$.subscribe((groceryStore: GroceryStore) => {
        groceryStoreValue = groceryStore;
      });
    }
    this.locationForm = this.fb.group({
      locationStore: [groceryStoreValue],
      locationAisle: [this.selectedGroceryStoreAisle],
      locationSection: [this.selectedGroceryStoreSection]
    });
  }

  ngOnInit() {
    // if (this.locationId != null) {
    //   this.selectedGroceryStoreLocation$ = this.store.select(selectGroceryStoreLocation(this.locationId));
    //   this.selectedGroceryStoreAisle = this.router.getCurrentNavigation().extras.queryParams.aisle;
    //   this.selectedGroceryStoreSection = this.router.getCurrentNavigation().extras.queryParams.section;
    //   this.selectedGroceryStoreId = this.router.getCurrentNavigation().extras.queryParams.storeId;
    //   // this.selectedGroceryStoreName = this.router.getCurrentNavigation().extras.queryParams.storeName;
    // } else {
    //   this.selectedGroceryStoreLocation$ = of({
    //       id: null,
    //       aisle: '',
    //       section: '',
    //       storeId: null,
    //       storeName: null
    //     });
    // }
    const tabs = document.querySelectorAll('.show-tabbar');
    if (tabs !== null) {
      Object.keys(tabs).map((key) => {
        tabs[key].style.display = 'flex';
      });
    }
  }


  onChangeLocationGroceryStore($event: GroceryStore) {
    // this.groceryStoreLocation.storeId = $event.id;
    if ($event.id !== this.selectedGroceryStoreId) {
      this.selectGroceryStore($event.id);
      // this.selectedGroceryStore$ = this.store.select(fromSelectors.selectGroceryStore(this.selectedGroceryStoreId));
    }
  }

  private selectGroceryStore(groceryStoreId: number) {
    this.store.dispatch(new LocationGroceryStoreSelected(groceryStoreId));
    this.selectedGroceryStoreId = groceryStoreId;
    this.groceryStoreAisles$ = this.store.select(fromSelectors.selectGroceryStoreAisles(groceryStoreId));
    this.groceryStoreSections$ = this.store.select(
      fromSelectors.selectPossibleGroceryStoreSectionsInAisle(this.selectedGroceryStoreId, this.selectedGroceryStoreAisle));
  }
  onChangeAisle($event: GroceryStoreAisleOrSectionSelected) {
    this.selectedGroceryStoreAisle = $event.name;
    this.groceryStoreSections$ = this.store.select(fromSelectors.selectPossibleGroceryStoreSectionsInAisle(
      this.selectedGroceryStoreId, this.selectedGroceryStoreAisle));
  }

  onCancel() {
    const route = `/home/pantry-items/pantry-item-details?id=${this.activeRoute.snapshot.params.id}&isNewItem=false`;
    this.router.navigateByUrl(route);
  }

  onChangeSection($event: GroceryStoreAisleOrSectionSelected) {
    this.selectedGroceryStoreSection = $event.name;
    this.groceryStoreAisles$ = this.store.select(fromSelectors.selectPossibleGroceryStoreAislesForSection(
      this.selectedGroceryStoreId, this.selectedGroceryStoreSection));
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

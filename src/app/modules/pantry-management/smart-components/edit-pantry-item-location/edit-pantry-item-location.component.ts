import {Component, Inject, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {GroceryStore, GroceryStoreState} from '../../../../model/grocery-store';
import {Observable, of} from 'rxjs';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../store/app.state';
import * as fromSelectors from '../../../../store/store-management.selectors';
import {GroceryStoreLocation} from '../../../../model/grocery-store-location';
import {AddGroceryStoreSection, AddStoreAisle, LoadGroceryStores, LocationGroceryStoreSelected} from '../../../../store';
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
import {selectGroceryStoresItemIsLocatedIn} from '../../store/pantry-management.selectors';
import {CreateStore} from '../../../store-management/store/store-management.actions';

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

  private groceryStores$: Observable<GroceryStoreState[]>;
  private groceryStoreAisles$: Observable<string[]>;
  private groceryStoreSections$: Observable<string[]>;
  private selectedGroceryStore$: Observable<GroceryStore>;

  selectedGroceryStoreId$: Observable<number>;

  AisleLabel = 'Aisle';
  SectionLabel = 'Section';

  locationForm: FormGroup;

  selectedGroceryStoreLocation$: Observable<GroceryStoreLocation>;
  groceryStoreIdsItemIsLocatedIn$: Observable<number[]>;
  selectedGroceryStoreId: number;
  selectedGroceryStoreAisle?: string;
  selectedGroceryStoreSection?: string;

  private groceryStoresLoading$: Observable<boolean>;
  private locationId: any;
  private pantryItemId: number;

  constructor(private store: Store<AppState>,
              @Inject('IPantryDataService') private pantryDataService: IPantryDataService,
              private fb: FormBuilder,
              private activeRoute: ActivatedRoute,
              private router: Router) {
    this.store.dispatch(new LoadGroceryStores());
    this.groceryStoresLoading$ = this.store.select(selectGroceryStoresLoading);
    this.groceryStores$ =  this.store.select(fromSelectors.selectAllGroceryStores);
    this.pantryItemId = +this.activeRoute.snapshot.params.id;
    this.groceryStoreIdsItemIsLocatedIn$ = this.store.select(selectGroceryStoresItemIsLocatedIn(this.pantryItemId));
    this.locationId = this.activeRoute.snapshot.params.locationId;

    if (this.locationId != null) {
      this.selectedGroceryStoreLocation$ = this.store.select(selectGroceryStoreLocation(this.locationId));
      this.selectedGroceryStoreAisle = this.router.getCurrentNavigation().extras.queryParams.aisle;
      this.selectedGroceryStoreSection = this.router.getCurrentNavigation().extras.queryParams.section;
      this.selectedGroceryStoreId = this.router.getCurrentNavigation().extras.queryParams.storeId;
      // this.selectedGroceryStore$ = this.store.select(fromSelectors.selectGroceryStore(this.selectedGroceryStoreId));

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
    this.selectedGroceryStore$ = this.store.select(fromSelectors.selectCurrentGroceryStore());
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
    // todo: continue here - need to dispatch this when new store is selected;
    // need to make storeId observable as well?
    this.store.dispatch(new LocationGroceryStoreSelected(groceryStoreId));
    this.selectedGroceryStoreId = groceryStoreId;
    this.groceryStoreAisles$ = this.store.select(fromSelectors.selectGroceryStoreAisles(
      this.selectedGroceryStoreId));
    this.groceryStoreSections$ = this.store.select(
      fromSelectors.selectPossibleGroceryStoreSectionsInAisle(this.selectedGroceryStoreId, this.selectedGroceryStoreAisle));
  }

  onChangeAisle($event: GroceryStoreAisleOrSectionSelected) {
    console.log(`in onChangeAisles, selectedGroceryStoreAisle: ${this.selectedGroceryStoreAisle}, new: ${$event.name}`);
    if (this.selectedGroceryStoreAisle !== $event.name) {
      this.selectedGroceryStoreAisle = $event.name;
      this.locationForm.patchValue({locationAisle: $event.name});
      this.groceryStoreSections$ = this.store.select(fromSelectors.selectPossibleGroceryStoreSectionsInAisle(
        this.selectedGroceryStoreId, this.selectedGroceryStoreAisle));
    }
  }

  onCancel() {
    const route = `/home/pantry-items/pantry-item-details?id=${this.pantryItemId}&isNewItem=false`;
    this.router.navigateByUrl(route);
  }

  onChangeSection($event: GroceryStoreAisleOrSectionSelected) {
    if(this.selectedGroceryStoreSection !== $event.name) {
      this.selectedGroceryStoreSection = $event.name;
      this.locationForm.patchValue({locationSection: $event.name});
      this.groceryStoreAisles$ = this.store.select(fromSelectors.selectPossibleGroceryStoreAislesForSection(
        this.selectedGroceryStoreId, this.selectedGroceryStoreSection));
    }
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
          itemId: this.pantryItemId,
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
          itemId: this.pantryItemId,
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

  onCreateAndSelectGroceryStore($event: string) {
    this.store.dispatch(new CreateStore({ name: $event }));
  }

  onCreateAndSelectGroceryStoreAisle($event: string) {
    this.store.dispatch(new AddStoreAisle(
      { groceryStoreId: this.selectedGroceryStoreId, name: $event }));
    this.onChangeAisle({ name: $event });
  }

  onCreateAndSelectGroceryStoreSection($event: string) {
    this.store.dispatch(new AddGroceryStoreSection(
      { groceryStoreId: this.selectedGroceryStoreId, name: $event }));
    this.onChangeSection({ name: $event });
  }
}

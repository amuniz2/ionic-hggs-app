import {Component, Inject, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {GroceryStore, GroceryStoreState} from '../../../../model/grocery-store';
import {Observable, of} from 'rxjs';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../store/app.state';
import * as fromSelectors from '../../../../store/store-management.selectors';
import {GroceryStoreLocation} from '../../../../model/grocery-store-location';
import {
  AddGroceryStoreSection,
  AddStoreAisle,
  LocationGroceryStoreSelected,
  SelectStore
} from '../../../../store';
import {IPantryDataService} from '../../../../services/IPantryDataService';
import {
  selectGroceryStoreLocation,
  selectGroceryStoresLoading
} from '../../../../store/store-management.selectors';
// tslint:disable-next-line:max-line-length
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AddPantryItemLocation, UpdatePantryItemLocation} from '../../../pantry-management/store/pantry-management.actions';
import {ActivatedRoute, Router} from '@angular/router';
import {selectGroceryStoresItemIsLocatedIn} from '../../../pantry-management/store/pantry-management.selectors';
import {CreateStore} from '../../../store-management/store/store-management.actions';
import {groceryStoreFromGrocerStoreState} from '../../../../model/model-helpers';
import {withLatestFrom} from 'rxjs/operators';
import {GroceryStoreAisleOrSectionSelected} from '../../dumb-components/grocery-store-location-aisle-or-section/grocery-store-location-aisle-or-section.component';

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
  private groceryStoreAislesWithSection$: Observable<string[]>;
  private groceryStoreSections$: Observable<string[]>;
  private groceryStoreSectionsInAisle$: Observable<string[]>;
  private groceryStoreLocations$: Observable<GroceryStoreLocation[]>;
  private selectedGroceryStore$: Observable<GroceryStoreState>;


  AisleLabel = `Aisle`;
  SectionLabel = 'Section';

  locationForm: FormGroup;

  selectedGroceryStoreLocation$: Observable<GroceryStoreLocation>;
  groceryStoreIdsItemIsLocatedIn$: Observable<number[]>;
  selectedGroceryStoreId: number;
  selectedGroceryStoreId$: Observable<number>
  selectedGroceryStoreAisle?: string;
  selectedGroceryStoreSection?: string;
  selectedGroceryStoreName?: string;

  private groceryStoresLoading$: Observable<boolean>;
  private readonly locationId: any;
  private readonly pantryItemId: number;
  private readonly returnUrl: string;

  constructor(private store: Store<AppState>,
              @Inject('IPantryDataService') private pantryDataService: IPantryDataService,
              private fb: FormBuilder,
              private activeRoute: ActivatedRoute,
              private router: Router) {
    // this.store.dispatch(new LoadGroceryStores());
    this.groceryStoresLoading$ = this.store.select(selectGroceryStoresLoading);
    this.groceryStores$ =  this.store.select(fromSelectors.selectAllGroceryStores);
    this.pantryItemId = +this.activeRoute.snapshot.params.id;
    this.groceryStoreIdsItemIsLocatedIn$ = this.store.select(selectGroceryStoresItemIsLocatedIn(this.pantryItemId));
    this.locationId = this.activeRoute.snapshot.params.locationId;

    if (this.locationId) {
      this.selectedGroceryStoreId = this.router.getCurrentNavigation().extras.queryParams.storeId;
      this.store.dispatch(new SelectStore(this.selectedGroceryStoreId));
      this.selectedGroceryStoreLocation$ = this.store.select(selectGroceryStoreLocation(this.locationId));
      this.selectedGroceryStoreAisle = this.router.getCurrentNavigation().extras.queryParams.aisle;
      this.selectedGroceryStoreSection = this.router.getCurrentNavigation().extras.queryParams.section;
//      this.selectedGroceryStore$ = this.store.select(fromSelectors.selectGroceryStore(this.selectedGroceryStoreId));
      this.selectGroceryStore(this.selectedGroceryStoreId);

      // this.selectGroceryStore(this.selectedGroceryStoreId);

      this.selectedGroceryStoreName = this.router.getCurrentNavigation().extras.queryParams.storeName;
    } else {
      this.selectedGroceryStoreLocation$ = of({
        id: null,
        aisle: '',
        section: '',
        storeId: null,
        storeName: null
      });
    }
    this.returnUrl = this.router.getCurrentNavigation().extras.state.returnUrl;
    this.locationForm = this.fb.group({
      locationStore: [{ value: this.selectedGroceryStoreName, disabled: !!this.locationId }, Validators.required ],
      locationAisle: [this.selectedGroceryStoreAisle],
      locationSection: [this.selectedGroceryStoreSection]
    });
    if (this.selectedGroceryStore$ != null) {
      this.selectedGroceryStore$.pipe(
        withLatestFrom((groceryStore: GroceryStoreState) => {
          this.locationForm.patchValue( {
            locationStore: groceryStoreFromGrocerStoreState(groceryStore).name
          });
      }));
    }
  }

  ngOnInit() {
    // this.selectedGroceryStore$ = this.store.select(fromSelectors.selectCurrentGroceryStore());
    // this.selectedGroceryStore$ = this.store.select(fromSelectors.selectCurrentGroceryStore());
    const tabs = document.querySelectorAll('.show-tabbar');
    if (tabs !== null) {
      Object.keys(tabs).map((key) => {
        tabs[key].style.display = 'flex';
      });
    }
    this.selectedGroceryStoreId$ = this.store.select(fromSelectors.selectCurrentGroceryStoreId());

    this.selectedGroceryStoreId$.subscribe((storeId) => {
      // this.selectedGroceryStore$ = this.store.select(fromSelectors.selectCurrentGroceryStore());
      this.selectedGroceryStore$ = this.store.select(fromSelectors.selectGroceryStore(storeId));
      this.groceryStoreAisles$ = this.store.select(fromSelectors.selectGroceryStoreAisles(
        storeId));
      this.groceryStoreAislesWithSection$ = this.store.select(fromSelectors.selectGroceryStoreAisles(
        storeId));
      this.groceryStoreSections$ = this.store.select(fromSelectors.selectGroceryStoreSections(
        storeId));
      this.groceryStoreSectionsInAisle$ = this.store.select(fromSelectors.selectGroceryStoreSections(
        storeId));
      this.groceryStoreLocations$ = this.store.select(fromSelectors.selectGroceryStoreLocations(
        storeId))
      this.selectedGroceryStoreId = storeId;
    })
  }

  onChangeLocationGroceryStore($event: GroceryStore) {
    // this.groceryStoreLocation.storeId = $event.id;
    if ($event.id !== this.selectedGroceryStoreId) {
      this.selectGroceryStore($event.id);
      this.selectedGroceryStoreId$ = this.store.select(fromSelectors.selectCurrentGroceryStoreId());
    }
  }

  private selectGroceryStore(groceryStoreId: number) {
    this.store.dispatch(new LocationGroceryStoreSelected(groceryStoreId));
    // this.selectedGroceryStoreId = groceryStoreId;
    // this.groceryStoreAisles$ = this.store.select(fromSelectors.selectGroceryStoreAisles(
    //   groceryStoreId));
    // this.groceryStoreSections$ = this.store.select(fromSelectors.selectGroceryStoreSections(
    //   groceryStoreId));
    // this.groceryStoreLocations$ = this.store.select(fromSelectors.selectGroceryStoreLocations(groceryStoreId))
  }

  onChangeAisle($event: GroceryStoreAisleOrSectionSelected) {
    if (this.selectedGroceryStoreAisle !== $event.name) {
      this.selectedGroceryStoreAisle = $event.name;
      this.locationForm.patchValue({locationAisle: $event.name});
      this.selectedGroceryStoreSection = undefined;
      this.locationForm.patchValue({locationSection: undefined});
      this.groceryStoreSectionsInAisle$ = this.store.select(fromSelectors.selectPossibleGroceryStoreSectionsInAisle(
        this.selectedGroceryStoreId, this.selectedGroceryStoreAisle));
    }
  }

  async onCancel() {
    console.log('returning to: ', this.returnUrl);
    this.router.navigateByUrl(this.returnUrl);
  }

  onChangeSection($event: GroceryStoreAisleOrSectionSelected) {
    if(this.selectedGroceryStoreSection !== $event.name) {
      this.selectedGroceryStoreSection = $event.name;
      this.groceryStoreAislesWithSection$ = this.store.select(fromSelectors.selectPossibleGroceryStoreAislesForSection(
        this.selectedGroceryStoreId, this.selectedGroceryStoreSection));
    }
  }

  onSubmit(value: any) {
    // add the location to the pantry item
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
          },
        }, this.returnUrl
          ));
      }
    }
  }

  onCreateAndSelectGroceryStore($event: string) {
    this.store.dispatch(new CreateStore({ name: $event }));
    // todo: is this why we are getting error?
    this.locationForm.patchValue(
      { locationStore: this.selectedGroceryStoreName }
    )
  }

  onCreateAndSelectGroceryStoreAisle($event: string) {
    this.store.dispatch(new AddStoreAisle(
      { groceryStoreId: this.selectedGroceryStoreId, name: $event }));
    //  this.locationForm.patchValue({locationAisle: $event});
    this.onChangeAisle({ name: $event });
    this.locationForm.patchValue( {locationSection: undefined });
  }

  onCreateAndSelectGroceryStoreSection($event: string) {
    this.store.dispatch(new AddGroceryStoreSection(
      { groceryStoreId: this.selectedGroceryStoreId, name: $event }));
    this.locationForm.patchValue({locationSection: $event});
    this.onChangeSection({ name: $event });
  }
}

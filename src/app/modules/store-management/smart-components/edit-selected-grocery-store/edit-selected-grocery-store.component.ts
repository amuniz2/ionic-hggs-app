import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {GroceryStore} from '../../../../model/grocery-store';
import {selectGroceryStore, selectGroceryStoreAisles} from '../../../../store/store-management.selectors';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../../store/app.state';
import * as fromActions from '../../store/store-management.actions';
import * as fromAppActions from '../../../../store/app.actions';
import {
  StoreAisleOrSection,
  StoreAisleOrSectionActionRequest
} from '../../dumb-components/grocery-store-aisles-or-sections/grocery-store-aisles-or-sections.component';
import {IPantryDataService} from '../../../../services/IPantryDataService';

@Component({
  selector: 'app-edit-selected-grocery-store',
  templateUrl: './edit-selected-grocery-store.component.html',
  styleUrls: ['./edit-selected-grocery-store.component.scss']
})
export class EditSelectedGroceryStoreComponent implements OnInit {

  groceryStoreId: number;
  aislesSectionIsOpen: boolean;

  groceryStore$: Observable<GroceryStore>;
  groceryStoreAisles$: Observable<string[]>;

  aislesInUse$: Observable<string[]>;
  sectionsInUse$: Observable<string[]>;

  constructor(private store: Store<AppState>, private route: ActivatedRoute,
              private router: Router,
              @Inject('IPantryDataService') private groceryStoreManagementService: IPantryDataService) {
    this.groceryStoreId = this.router.getCurrentNavigation().extras.queryParams.id;
    this.groceryStore$ = this.store.pipe(select(selectGroceryStore(this.groceryStoreId)));
    this.groceryStoreAisles$ = this.store.pipe(select(selectGroceryStoreAisles(this.groceryStoreId)));
    this.aislesInUse$ = this.groceryStoreManagementService.getAislesInUse(this.groceryStoreId);
    this.sectionsInUse$ = this.groceryStoreManagementService.getSectionsInUse(this.groceryStoreId);
  }

  ngOnInit() {
    this.store.dispatch(new fromActions.NavigatedToStoreDetailsPage(this.groceryStoreId));
    // this.store.dispatch(new fromActions.NavigatedToStoreDetailsPage())
  }
  onNotifyNewStoreAisleRequest($event: StoreAisleOrSectionActionRequest) {
    this.store.dispatch(new fromAppActions.AddStoreAisle({
      name: $event.aisleOrSectionName,
      groceryStoreId: $event.groceryStoreId}));
}

  onDeleteStoreAisleRequest($event: StoreAisleOrSection) {
    console.log(`dispatching delete store aisle event: ${$event.name}`);
    this.store.dispatch(new fromAppActions.DeleteStoreAisle($event));
  }
  onNotifyExpandAisles($event: number) {
    this.store.dispatch(new fromAppActions.LoadGroceryStoreAisles($event));
  }

  onNotifyNewGrocerStoreSectionRequest($event: StoreAisleOrSectionActionRequest) {
    this.store.dispatch(new fromAppActions.AddGroceryStoreSection({
      groceryStoreId: $event.groceryStoreId,
      name: $event.aisleOrSectionName}));
  }

  onDeleteGroceryStoreSectionRequest($event: StoreAisleOrSection) {
    console.log(`dispatching delete store aisle event: ${$event.name}`);
    this.store.dispatch(new fromAppActions.DeleteGroceryStoreSection($event));
  }
  onNotifyExpandSections($event: number) {
    this.store.dispatch(new fromAppActions.LoadGroceryStoreSections($event));
  }
}

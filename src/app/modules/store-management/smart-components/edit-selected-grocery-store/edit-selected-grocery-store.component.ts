import {Component, Inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {GroceryStoreState} from '../../../../model/grocery-store';
import {
  selectAislesInUse,
  selectGroceryStore,
  selectGroceryStoreAisles,
  selectSectionsInUse
} from '../../../../store/store-management.selectors';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../../store/app.state';
import * as fromActions from '../../store/store-management.actions';
import * as fromAppActions from '../../../../store/app.actions';
import {
  StoreAisleOrSection,
  StoreAisleOrSectionActionRequest,
  UpdateStoreAisleOrSectionActionRequest
} from '../../dumb-components/grocery-store-aisles-or-sections/grocery-store-aisles-or-sections.component';
import {UiCrudAction} from '../../../../ui-crud-actions';

@Component({
  selector: 'app-edit-selected-grocery-store',
  templateUrl: './edit-selected-grocery-store.component.html',
  styleUrls: ['./edit-selected-grocery-store.component.scss']
})
export class EditSelectedGroceryStoreComponent implements OnInit {

  groceryStoreId: number;

  groceryStore$: Observable<GroceryStoreState>;
  groceryStoreAisles$: Observable<string[]>;

  aislesInUse$: Observable<string[]>;
  sectionsInUse$: Observable<string[]>;

  constructor(private store: Store<AppState>,
              private router: Router) {
    this.groceryStoreId = this.router.getCurrentNavigation().extras.queryParams.id;
    this.groceryStore$ = this.store.pipe(select(selectGroceryStore(this.groceryStoreId)));
    this.groceryStoreAisles$ = this.store.pipe(select(selectGroceryStoreAisles(this.groceryStoreId)));
    this.aislesInUse$ = this.store.pipe(select(selectAislesInUse(this.groceryStoreId)));
    this.sectionsInUse$ = this.store.pipe(select(selectSectionsInUse(this.groceryStoreId)));
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

  onUpdateAisle($event: UpdateStoreAisleOrSectionActionRequest) {
    if ($event.action === UiCrudAction.Update) {
      this.store.dispatch(new fromAppActions.UpdateAisle($event));
    }
  }
}

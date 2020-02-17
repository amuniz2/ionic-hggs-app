import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {GroceryStore} from '../../../../model/grocery-store';
import {selectGroceryStore, selectGroceryStoreAisles} from '../../../../store/store-management.selectors';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../../store/app.state';
import * as fromActions from '../../store/store-management.actions';
import * as fromAppActions from '../../../../store/app.actions';
import {StoreAisle} from '../../dumb-components/grocery-store-aisles/grocery-store-aisles.component';
import {StoreSection} from '../../dumb-components/grocery-store-sections/grocery-store-sections.component';

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

  constructor(private store: Store<AppState>, private route: ActivatedRoute, private router: Router) {
    this.groceryStoreId = this.router.getCurrentNavigation().extras.queryParams.id;
    this.groceryStore$ = this.store.pipe(select(selectGroceryStore(this.groceryStoreId)));
    this.groceryStoreAisles$ = this.store.pipe(select(selectGroceryStoreAisles(this.groceryStoreId)));
  }

  ngOnInit() {
    this.store.dispatch(new fromActions.NavigatedToStoreDetailsPage(this.groceryStoreId));
    // this.store.dispatch(new fromActions.NavigatedToStoreDetailsPage())
  }
  onNotifyNewStoreAisleRequest($event: StoreAisle) {
    this.store.dispatch(new fromAppActions.AddStoreAisle($event));
}

  onDeleteStoreAisleRequest($event: StoreAisle) {
    console.log(`dispatching delete store aisle event: ${$event.aisle}`);
    this.store.dispatch(new fromAppActions.DeleteStoreAisle($event));
  }
  onNotifyExpandAisles($event: number) {
    this.store.dispatch(new fromAppActions.LoadGroceryStoreAisles($event));
  }

  onNotifyNewGrocerStoreSectionRequest($event: StoreSection) {
    this.store.dispatch(new fromAppActions.AddGroceryStoreSection($event));
  }

  onDeleteGroceryStoreSectionRequest($event: StoreSection) {
    console.log(`dispatching delete store aisle event: ${$event.section}`);
    this.store.dispatch(new fromAppActions.DeleteGroceryStoreSection($event));
  }
  onNotifyExpandSections($event: number) {
    this.store.dispatch(new fromAppActions.LoadGroceryStoreSections($event));
  }
}

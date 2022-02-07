import { Component, OnInit } from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Observable, of} from 'rxjs';
import * as fromSelectors from '../../../../store/store-management.selectors';
import {GroceryStore, GroceryStoreState} from '../../../../model/grocery-store';
import * as fromActions from '../../store/store-management.actions';
import {AppState} from '../../../../store/app.state';
import {DeleteGroceryStoreRequest, NewGroceryStoreRequest} from '../../dumb-components/store-list/store-list.component';
import {selectGroceryStoresLoading} from '../../../../store/store-management.selectors';
import {LoadGroceryStores} from '../../../../store';

@Component({
  selector: 'app-store-inventory-manager',
  templateUrl: './store-inventory-manager-page.component.html',
  styleUrls: ['./store-inventory-manager-page.component.scss']
})
export class StoreInventoryManagerPageComponent implements OnInit {
  title: string;
  groceryStores$: Observable<GroceryStoreState[]>;
  groceryStoresLoading$: Observable<boolean>;
  addingStore$: Observable<boolean>;

  constructor(private store: Store<AppState>) {
    this.title = 'Manage Stores';
    this.addingStore$ = of(false);
  }

  ngOnInit() {
    // dispatch action that list has been navigated to
    // this.store.dispatch(new LoadGroceryStores());
    console.log('selecting stores');
    this.groceryStores$ = this.store.pipe(select(fromSelectors.selectAllGroceryStores));
    this.groceryStoresLoading$ = this.store.select(selectGroceryStoresLoading);
  }

  onNotifyNewStoreRequest($event: NewGroceryStoreRequest) {
    this.addingStore$ = of(false);
    if ($event.name) {
      this.store.dispatch(new fromActions.CreateStore($event));
    }
  }

  onDeleteStoreRequest($event: DeleteGroceryStoreRequest) {
    this.store.dispatch(new fromActions.DeleteStore($event));
  }

  // onNavigateToEditStoreRequest($event: NavigateToEditStoreRequest) {
  //   const groceryStoreId = $event.id;
  //   const groceryStore$ = select(this.groceryStores$);
  //   this.store.dispatch(new fromActions.NavigateToEditStore($event));
  // }

  onAddStoreClick() {
    this.addingStore$ = of(true);
  }
}

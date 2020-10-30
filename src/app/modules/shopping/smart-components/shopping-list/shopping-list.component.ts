import { Component, OnInit } from '@angular/core';
import {SelectStore} from '../../../../store';
import {selectAllGroceryStores, selectCurrentGroceryStore, selectGroceryStoresLoading} from '../../../../store/store-management.selectors';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../store/app.state';
import {Observable} from 'rxjs';
import {GroceryStore, GroceryStoreState} from '../../../../model/grocery-store';
import {ItemPlacedInOrRemovedFromCart, LoadShoppingList} from '../../store/shopping.actions';
import {ShoppingItem} from '../../../../model/shopping-item';
import {
  selectStoreShoppingItems,
} from '../../store/shopping.selectors';
import {StoreShoppingItemUpdate} from '../../dumb-components/shopping-item-list/shopping-item-list.component';
import {map, withLatestFrom} from 'rxjs/operators';
import {EditItemLocationRequest} from '../../../pantry-management/dumb-components/pantry-item-locations/pantry-item-locations.component';
import {EditPantryItemLocationRequest} from '../../../pantry-management/store/pantry-management.actions';
import {Router} from '@angular/router';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit {
  groceryStoresLoading$: Observable<boolean>;
  groceryStores$: Observable<GroceryStoreState[]>;
  shoppingList$: Observable<ShoppingItem[]>;
  shoppingStore$: Observable<GroceryStoreState>;

  selectedStore: GroceryStore;

  private filterList: boolean;
  filter: string;


  constructor(private store: Store<AppState>, private router: Router) {
    // this.store.dispatch(new LoadGroceryStores());
    this.groceryStoresLoading$ = this.store.select(selectGroceryStoresLoading);
    this.groceryStores$ = this.store.select(selectAllGroceryStores);
  }

  ngOnInit() {
    this.shoppingStore$ = this.store.select(selectCurrentGroceryStore());
    this.shoppingStore$.pipe(
      withLatestFrom(store => {
        this.selectedStore = {
          ...store,
          aisles: new Set(store.aisles),
          sections: new Set(store.sections)
        };
        this.shoppingList$ = this.store.select(selectStoreShoppingItems(this.selectedStore?.id));
      }));
  }

  onGroceryStoreSelected($event: GroceryStore) {
    this.store.dispatch(new SelectStore($event.id));
    this.selectedStore = $event;
    console.log('disatching LoadShoppingList');
    this.store.dispatch(new LoadShoppingList(this.selectedStore?.id));
    this.shoppingList$ = this.store.select(selectStoreShoppingItems(this.selectedStore?.id));
  }

  onItemPlacedInOrRemovedFromCart($event: StoreShoppingItemUpdate) {
    console.log(`dispatching ItemPlacedInOrRemovedFromCart: ${JSON.stringify($event)}`);
    this.store.dispatch(new ItemPlacedInOrRemovedFromCart($event))
  }

  filterItems() {
    this.filterList = true;
  }

  cancelFilter() {
    this.filterList = false;
  }

  onItemLocationChangeRequested($event: EditItemLocationRequest) {
    this.store.dispatch((new EditPantryItemLocationRequest($event, this.router.routerState.snapshot.url)));
  }
}

import { Component, OnInit } from '@angular/core';
import {LoadGroceryStores, SelectStore} from '../../../../store';
import {selectAllGroceryStores, selectCurrentGroceryStore, selectGroceryStoresLoading} from '../../../../store/store-management.selectors';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../store/app.state';
import {Observable} from 'rxjs';
import {GroceryStore, GroceryStoreState} from '../../../../model/grocery-store';
import {ItemPlacedInOrRemovedFromCart, LoadShoppingList} from '../../store/shopping.actions';
import {ShoppingItem} from '../../../../model/shopping-item';
import {
  selectShoppingList,
  selectShoppingListItemsGroupedByAisle,
  selectShoppingListItemsGroupedBySection
} from '../../store/shopping.selectors';
import {AisleItems, IStoreShoppingList, SectionItems, ShoppingListState} from '../../store/shopping.reducers';
import {ShoppingItemUpdate} from '../../dumb-components/shopping-item/shopping-item.component';
import {StoreShoppingItemUpdate} from '../../dumb-components/shopping-item-list/shopping-item-list.component';
import {map, withLatestFrom} from 'rxjs/operators';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit {
  groceryStoresLoading$: Observable<boolean>;
  groceryStores$: Observable<GroceryStoreState[]>;
  shoppingList$: Observable<IStoreShoppingList>;
  shoppingStore$: Observable<GroceryStoreState>;

  selectedStoreId: number;

  private filterList: boolean;
  filter: string;


  constructor(private store: Store<AppState>) {
    // this.store.dispatch(new LoadGroceryStores());
    this.groceryStoresLoading$ = this.store.select(selectGroceryStoresLoading);
    this.groceryStores$ = this.store.select(selectAllGroceryStores);
  }

  ngOnInit() {
    this.shoppingStore$ = this.store.select(selectCurrentGroceryStore());
    this.shoppingStore$.pipe(
      withLatestFrom(store => {
        this.selectedStoreId = store.id;
      }));
  }

  onGroceryStoreSelected($event: GroceryStore) {
    this.store.dispatch(new SelectStore($event.id));
    this.selectedStoreId = $event.id;
    console.log('disatching LoadShoppingList');
    this.store.dispatch(new LoadShoppingList(this.selectedStoreId));
    this.shoppingList$ = this.store.select(selectShoppingList(this.selectedStoreId));
  }

  onItemPlacedInOrRemovedFromCart($event: StoreShoppingItemUpdate) {
    console.log(`dispatching ItemPlacedInOrRemovedFromCart: ${JSON.stringify($event)}`);
    this.store.dispatch(new ItemPlacedInOrRemovedFromCart($event))
  }

  storeNotSelected() {
    return !!!this.selectedStoreId;
  }

  filterItems() {
    this.filterList = true;
  }

  cancelFilter() {
    this.filterList = false;
  }
}

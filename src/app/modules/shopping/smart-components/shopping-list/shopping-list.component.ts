import { Component, OnInit } from '@angular/core';
import {LoadGroceryStores} from '../../../../store';
import {selectAllGroceryStores, selectGroceryStoresLoading} from '../../../../store/store-management.selectors';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../store/app.state';
import {Observable} from 'rxjs';
import {GroceryStore} from '../../../../model/grocery-store';
import {LoadShoppingList} from '../../store/shopping.actions';
import {ShoppingItem} from '../../../../model/shopping-item';
import {
  selectShoppingList,
  selectShoppingListItemsGroupedByAisle,
  selectShoppingListItemsGroupedBySection
} from '../../store/shopping.selectors';
import {AisleItems, IStoreShoppingList, SectionItems, ShoppingListState} from '../../store/shopping.reducers';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit {
  groceryStoresLoading$: Observable<boolean>;
  groceryStores$: Observable<GroceryStore[]>;
  shoppingList$: Observable<IStoreShoppingList>;
  // shoppingItemsGroupedByAisle$: Observable<AisleItems[]>;
  // shoppingItems$: Observable<ShoppingItem[]>;
  // shoppingItemsGroupedBySection$: Observable<SectionItems[]>;

  selectedStoreId: number;

  constructor(private store: Store<AppState>) {
    this.store.dispatch(new LoadGroceryStores());
    this.groceryStoresLoading$ = this.store.select(selectGroceryStoresLoading);
    this.groceryStores$ = this.store.select(selectAllGroceryStores);
  }

  ngOnInit() {
  }

  onGroceryStoreSelected($event: GroceryStore) {
    this.selectedStoreId = $event.id;
    this.store.dispatch(new LoadShoppingList(this.selectedStoreId));
    this.shoppingList$ = this.store.select(selectShoppingList(this.selectedStoreId));
    // this.shoppingItemsGroupedByAisle$ = this.store.select(selectShoppingListItemsGroupedByAisle(this.selectedStoreId));
    // this.shoppingItemsGroupedBySection$ = this.store.select(selectShoppingListItemsGroupedBySection(this.selectedStoreId));
    // this.shoppingItems$ = this.store.select(selectShoppingListItems(this.selectedStoreId));
  }
}

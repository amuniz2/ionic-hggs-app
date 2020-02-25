import { Component, OnInit } from '@angular/core';
import {LoadGroceryStores} from '../../../../store';
import {selectAllGroceryStores, selectGroceryStoresLoading} from '../../../../store/store-management.selectors';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../store/app.state';
import {Observable} from 'rxjs';
import {GroceryStore} from '../../../../model/grocery-store';
import {selectPantryItemsNeededFromStore} from '../../store/pantry-management.selectors';
import {ShoppingItem} from '../../../../model/pantry-item';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit {
  groceryStoresLoading$: Observable<boolean>;
  groceryStores$: Observable<GroceryStore[]>;
  shoppingItems$: Observable<ShoppingItem[]>;

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
    this.shoppingItems$ = this.store.select(selectPantryItemsNeededFromStore(this.selectedStoreId));
  }
}

import { Component, OnInit } from '@angular/core';
import {SelectStore} from '../../../../store';
import {selectAllGroceryStores, selectCurrentGroceryStore, selectGroceryStoresLoading} from '../../../../store/store-management.selectors';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../store/app.state';
import {Observable, of} from 'rxjs';
import {GroceryStore, GroceryStoreState} from '../../../../model/grocery-store';
import {
  CreateShoppingItemForNewPantryItem,
  ItemPlacedInOrRemovedFromCart,
  LoadShoppingList
} from '../../store/shopping.actions';
import {ShoppingItem} from '../../../../model/shopping-item';
import {
  selectStoreShoppingItems,
} from '../../store/shopping.selectors';
import {StoreShoppingItemUpdate} from '../../dumb-components/shopping-item-list/shopping-item-list.component';
import {withLatestFrom} from 'rxjs/operators';
import {EditItemLocationRequest} from '../../../pantry-management/dumb-components/pantry-item-locations/pantry-item-locations.component';
import {EditPantryItemLocationRequest} from '../../../pantry-management/store/pantry-management.actions';
import {Router} from '@angular/router';
import {CreatePantryItemRequest} from '../../../../helpers';

export class AddShoppingItemRequest {
  public itemId: number;
  public storeId: number;
}

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
  addingShoppingItem$: Observable<boolean>;

  selectedStore: GroceryStore;

  private filterList: boolean;
  filter: string;


  constructor(private store: Store<AppState>, private router: Router) {
    // this.store.dispatch(new LoadGroceryStores());
    this.groceryStoresLoading$ = this.store.select(selectGroceryStoresLoading);
    this.groceryStores$ = this.store.select(selectAllGroceryStores);
  }

  ngOnInit() {
    this.addingShoppingItem$ = of(false);
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
    console.log('dispatching LoadShoppingList');
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

  onAddShoppingItemClick() {
    this.addingShoppingItem$ = of(true);

    // ?
    // this.store.dispatch(new AddNewShoppingItem( { itemId: this., storeId: this.selectedStore.id});
  }

  onCreateItem($event: CreatePantryItemRequest) {
    this.addingShoppingItem$ = of(false);
    if ($event.name) {
      this.store.dispatch(new CreateShoppingItemForNewPantryItem({
        name: $event.name,
        storeId: this.selectedStore.id
      }));
    }
  }
}


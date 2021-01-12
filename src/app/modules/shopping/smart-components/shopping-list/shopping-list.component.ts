import { Component, OnInit } from '@angular/core';
import {SelectStore} from '../../../../store';
import {selectAllGroceryStores, selectCurrentGroceryStore, selectGroceryStoresLoading} from '../../../../store/store-management.selectors';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../store/app.state';
import {Observable, of} from 'rxjs';
import {GroceryStore, GroceryStoreState} from '../../../../model/grocery-store';
import {
  CreateShoppingItemForNewPantryItem, CreateShoppingItemRequest,
  ItemPlacedInOrRemovedFromCart,
  LoadShoppingList
} from '../../store/shopping.actions';
import {ShoppingItem} from '../../../../model/shopping-item';
import {
  selectStoreShoppingItems,
} from '../../store/shopping.selectors';
import {
  AddPantryItemToStoreShoppingList,
  StoreShoppingItemUpdate
} from '../../dumb-components/shopping-item-list/shopping-item-list.component';
import {withLatestFrom} from 'rxjs/operators';
import {EditItemLocationRequest} from '../../../pantry-management/dumb-components/pantry-item-locations/pantry-item-locations.component';
import {
  EditPantryItemLocationRequest
} from '../../../pantry-management/store/pantry-management.actions';
import {Router} from '@angular/router';
import {GroceryStoreLocation} from '../../../../model/grocery-store-location';

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
  addingShoppingItemInAisle$: Observable<boolean>;

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
    this.addingShoppingItemInAisle$ = of (false);
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
    this.store.dispatch(new LoadShoppingList(this.selectedStore?.id));
    this.shoppingList$ = this.store.select(selectStoreShoppingItems(this.selectedStore?.id));
  }

  onItemPlacedInOrRemovedFromCart($event: StoreShoppingItemUpdate) {
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

  onAddShoppingItemInAisleClick(request: CreateShoppingItemRequest) {
    this.addingShoppingItemInAisle$ = of(true);

    // this.store.dispatch(new CreatePantryItem(
    //   {name: request.name, initialStoreLocation:
    //       { storeName: '', id: 0, storeId: request.storeId, aisle: request.aisle}}));
  }

  onCreateShoppingItem($event: CreateShoppingItemRequest) {
    this.addingShoppingItem$ = of(false);
    this.addingShoppingItemInAisle$ = of(false);
    if ($event.name) {
      const request = {
        name: $event.name,
        aisle: $event.aisle,
        storeId: this.selectedStore?.id,
        section: $event.section
      };
      this.store.dispatch(new CreateShoppingItemForNewPantryItem(request));
    }
  }

  onAddPantryItemToStoreShoppingList($event: AddPantryItemToStoreShoppingList) {
    this.addingShoppingItem$ = of(true);
    // this.store.dispatch(new CreateShoppingItemForNewPantryItem({
    //   name: $event.name,
    //   aisle: $event.aisle.name,
    //   storeId: this.selectedStore.id
    // }));
  }

  onCancelAddShoppingItem($event: GroceryStoreLocation) {
    this.addingShoppingItemInAisle$ = of(false);
    this.addingShoppingItem$ = of(false);
  }
}


import {Action} from '@ngrx/store';
import {ShoppingItem} from '../../../model/shopping-item';
import {StoreShoppingItemUpdate} from '../dumb-components/shopping-item-list/shopping-item-list.component';
import {PantryItem} from '../../../model/pantry-item';
import {GroceryStoreLocation} from '../../../model/grocery-store-location';

export enum ShoppingActionTypes {
  AddOrRemoveItemFromShoppingLists = '[Shopping] Add or remove item',
  LoadShoppingList = '[Shopping] Load Shopping List',
  LoadShoppingListFailed = '[Shopping] Load Shopping List Failed',
  LoadShoppingListSucceeded = '[Shopping] Load Shopping List Save Succeeded',
  ItemPlacedInOrRemovedFromCart = '[Shopping] Item update requested',
  ShoppingItemUpdateSucceeded = '[Shopping] Item update succeeded',
  UpdateStoreShoppingList = '[Store Manager] Update store shopping list',
}

export class AddOrRemoveItemFromShoppingLists implements Action {
  readonly type = ShoppingActionTypes.AddOrRemoveItemFromShoppingLists;

  constructor(public pantryItem: PantryItem, public locations: GroceryStoreLocation[]) {}
}

export class LoadShoppingList implements Action {
  readonly type = ShoppingActionTypes.LoadShoppingList;

  constructor(public storeId: number) {}
}

export class LoadShoppingListFailed implements Action {
  readonly type = ShoppingActionTypes.LoadShoppingListFailed;

  constructor(public storeId: number, public error: Error) {}
}

export class LoadShoppingListSucceeded implements Action {
  readonly type = ShoppingActionTypes.LoadShoppingListSucceeded;
  constructor(public storeId: number, public shoppingList: ShoppingItem[]) {}
}

export class ItemPlacedInOrRemovedFromCart implements Action {
  readonly type = ShoppingActionTypes.ItemPlacedInOrRemovedFromCart;
  constructor(public update: StoreShoppingItemUpdate) {
  }
}

export class ShoppingItemUpdateSucceeded implements Action {
  readonly type = ShoppingActionTypes.ShoppingItemUpdateSucceeded;
  constructor(public storeId: number, public shoppingItem: ShoppingItem){}
}

export class UpdateStoreShoppingList implements Action {
  readonly type = ShoppingActionTypes.UpdateStoreShoppingList;
  constructor(public storeId: number) {};
}

export type ShoppingActions =
  LoadShoppingList
  | LoadShoppingListSucceeded
  | LoadShoppingListFailed
  | ItemPlacedInOrRemovedFromCart
  | ShoppingItemUpdateSucceeded
  | UpdateStoreShoppingList
  | AddOrRemoveItemFromShoppingLists;

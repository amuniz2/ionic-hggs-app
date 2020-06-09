import {Action} from '@ngrx/store';
import {ShoppingItem} from '../../../model/shopping-item';
import {ShoppingItemUpdate} from '../dumb-components/shopping-item/shopping-item.component';
import {StoreShoppingItemUpdate} from '../dumb-components/shopping-item-list/shopping-item-list.component';

export enum ShoppingActionTypes {
  LoadShoppingList = '[Shopping] Load Shopping List',
  LoadShoppingListFailed = '[Shopping] Load Shopping List Failed',
  LoadShoppingListSucceeded = '[Shopping] Load Shopping List Save Succeeded',
  ItemPlacedInOrRemovedFromCart = '[Shopping] Item update requested',
  ShoppingItemUpdateSucceeded = '[Shopping] Item update succeeded',
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
  constructor(public storeId: number, public id: number){}
}

export type ShoppingActions =
  LoadShoppingList
  | LoadShoppingListSucceeded
  | LoadShoppingListFailed
  | ItemPlacedInOrRemovedFromCart
  | ShoppingItemUpdateSucceeded;

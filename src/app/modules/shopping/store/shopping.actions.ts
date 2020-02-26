import {Action} from '@ngrx/store';
import {PantryItem} from '../../../model/pantry-item';
import {ShoppingItem} from '../../../model/pantry-item';

export enum ShoppingActionTypes {
  LoadShoppingList = '[Shopping] Load Shopping List',
  LoadShoppingListFailed = '[Shopping] Load Shopping List Failed',
  LoadShoppingListSucceeded = '[Shopping] Load Shopping List Save Succeeded',
}

export class LoadShoppingList implements Action {
  readonly type = ShoppingActionTypes.LoadShoppingList;

  constructor(public storeId: number, public pantryItemsNeeded: PantryItem[] ){}
}

export class LoadShoppingListFailed implements Action {
  readonly type = ShoppingActionTypes.LoadShoppingListFailed;

  constructor(public storeId: number, public error: Error) {}
}

export class LoadShoppingListSucceeded implements Action {
  readonly type = ShoppingActionTypes.LoadShoppingListSucceeded;
  constructor(public storeId: number, public shoppingList: ShoppingItem[]) {}
}


export type ShoppingActions =
  LoadShoppingList
  | LoadShoppingListSucceeded
  | LoadShoppingListFailed;

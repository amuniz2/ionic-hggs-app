import {Action} from '@ngrx/store';
import {ShoppingItem} from '../../../model/shopping-item';
import {StoreShoppingItemUpdate} from '../dumb-components/shopping-item-list/shopping-item-list.component';
import {PantryItem} from '../../../model/pantry-item';
import {GroceryStoreLocation} from '../../../model/grocery-store-location';
import {AddShoppingItemRequest} from '../smart-components/shopping-list/shopping-list.component';
import {CreatePantryItemRequest} from '../../../helpers';
import {NavigateToEditPantryItemRequest} from '../../pantry-management/dumb-components/pantry-item-list/pantry-item-list.component';
import {PantryActionTypes} from '../../pantry-management/store/pantry-management.actions';

export enum ShoppingActionTypes {
  AddOrRemoveItemFromShoppingLists = '[Shopping] Add or remove item',
  CreateShoppingItemForNewPantryItem = '[Shopping] Create new Pantry Item in Store Shopping List',
  LoadShoppingList = '[Shopping] Load Shopping List',
  LoadShoppingListFailed = '[Shopping] Load Shopping List Failed',
  LoadShoppingListSucceeded = '[Shopping] Load Shopping List Save Succeeded',
  NavigateToNewShoppingItemPage = '[Shopping] Navigate to new shopping item',
  NavigatedToShoppingItemPage  = '[Shopping] Navigated To Shopping Item Details',
  ItemPlacedInOrRemovedFromCart = '[Shopping] Item update requested',
  ShoppingItemUpdateSucceeded = '[Shopping] Item update succeeded',
  UpdateStoreShoppingList = '[Store Manager] Update store shopping list',
}

export interface CreateShoppingItemRequest {
  name: string;
  storeId: number;
}

export class AddOrRemoveItemFromShoppingLists implements Action {
  readonly type = ShoppingActionTypes.AddOrRemoveItemFromShoppingLists;

  constructor(public pantryItem: PantryItem, public locations: GroceryStoreLocation[]) {}
}

export class CreateShoppingItemForNewPantryItem implements  Action {
  readonly type = ShoppingActionTypes.CreateShoppingItemForNewPantryItem;

  constructor(public request: CreateShoppingItemRequest) {}
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

export class NavigateToNewShoppingItemPage implements Action {
  readonly type = ShoppingActionTypes.NavigateToNewShoppingItemPage;

  constructor(public itemId: number, public storeId: number) {}
}

export class NavigatedToShoppingItemPage implements Action {
  readonly type = ShoppingActionTypes.NavigatedToShoppingItemPage;

  constructor(public pantryItemId: number){}
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
  CreateShoppingItemForNewPantryItem
  | LoadShoppingList
  | LoadShoppingListSucceeded
  | LoadShoppingListFailed
  | ItemPlacedInOrRemovedFromCart
  | NavigateToNewShoppingItemPage
  | ShoppingItemUpdateSucceeded
  | UpdateStoreShoppingList
  | AddOrRemoveItemFromShoppingLists;

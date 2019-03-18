import {Action} from '@ngrx/store';

export enum GroceryItemActionTypes {
  SelectGroceryItem = '[Grocery Item] Select',
  UpdateGroceryItem = '[Grocery Item] Update',
  DeleteGroceryItem = '[Grocery Item] Delete',
  CreateGroceryItem = '[Grocery Item] Create',
  GroceryItemCreated = '[Grocery Item] Created',
  AddStoreLocation = '[Grocery Item] Add Store Location',
  RemoveStoreLocation = '[Grocery Item] Remove Store Location',
}

export class CreateGroceryItem implements Action {
  readonly type = GroceryItemActionTypes.CreateGroceryItem;
}

export class GroceryItemCreated implements Action {
  readonly type = GroceryItemActionTypes.GroceryItemCreated;
}

export type StoreManagementActions =
  CreateGroceryItem
  | GroceryItemCreated;

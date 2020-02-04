import {Action} from '@ngrx/store';
import {PantryItem} from '../../../model/pantry-item';
import {DeletePantryItemRequest, NavigateToEditPantryItemRequest} from '../dumb-components/pantry-item-list/pantry-item-list.component';
import {NewItemLocationRequest} from '../dumb-components/pantry-item-locations/pantry-item-locations.component';
import {GroceryStoreLocation} from '../../../model/grocery-store-location';
import {NewItemLocation} from '../smart-components/add-pantry-item-location/add-pantry-item-location.component';
import {PantryItemLocation} from '../../../model/PantryItemLocation';

export enum PantryActionTypes {
  PantryLoadedSuccessfully = '[Pantry] Loaded',
  PantryLoadFailed = '[Pantry] Load Failed',
  SelectGroceryItem = '[Grocery Item] Select',
  UpdateGroceryItem = '[Grocery Item] Update',
  CreateItem = '[Pantry Item] Create',
  CreateItemFailed = '[Pantry Item] Create Failed',
  DeletePantryItemFailed = '[Pantry Item] Delete Failed',
  DeletePantryItem = '[Pantry item] Delete',
  ItemCreated = '[Pantry Item] Created',
  PantryItemDeleted = '[Pantry Item] Deleted',
  NavigatedToPantryPage = '[Pantry] Navigated to',
  NavigateToPantryItemPage = '[Pantry Item] Navigate to',
  NavigatedToPantryItemPage = '[Pantry Item] Navigated to',
  AddPantryItemLocation = '[Pantry Item] add location',
  AddPantryItemLocationFailed = '[Pantry Item] add location failed',
  AddPantryItemLocationRequest = '[Pantry Item] add location requested',
  PantryItemLocationAdded = '[Pantry Item] add location succeeded',
  SavePantryItem = '[Pantry Item] Save',
  SavePantryItemFailed = '[Pantry Item] Save Failed',
  SavePantryItemSucceeded = '[Pantry Item] Save Succeeded',
  SaveNewPantryItem = '[Pantry Item] Save New Requested',
}

export class AddPantryItemLocationRequest implements Action {
  readonly type = PantryActionTypes.AddPantryItemLocationRequest;

  constructor(public request: NewItemLocationRequest) {}
}

export class AddPantryItemLocation implements Action {
  readonly type = PantryActionTypes.AddPantryItemLocation;

  constructor(public addPantryItemLocation: NewItemLocation) {}
}

export class CreatePantryItem implements Action {
  readonly type = PantryActionTypes.CreateItem;

  constructor(public pantryItemRequest: NavigateToEditPantryItemRequest) {}
}

export class NavigateToPantryItemPage implements Action {
  readonly type = PantryActionTypes.NavigateToPantryItemPage;

  constructor(public pantryItemRequest: NavigateToEditPantryItemRequest) {}
}

export class CreateItemFailed implements Action {
  readonly type = PantryActionTypes.CreateItemFailed;

  constructor(public item: PantryItem, public error: Error) {}
}

export class DeletePantryItemFailed implements Action {
  readonly type = PantryActionTypes.DeletePantryItemFailed;

  constructor(public error: Error) {}
}

export class DeletePantryItem implements Action {
  readonly type = PantryActionTypes.DeletePantryItem;
  constructor(public deletePantryItemRequest: DeletePantryItemRequest) {}
}

export class ItemCreated implements Action {
  readonly type = PantryActionTypes.ItemCreated;
  constructor(public pantryItem: PantryItem) {
  }
}

export class PantryItemLocationAdded implements Action {
  readonly type = PantryActionTypes.PantryItemLocationAdded;
  constructor(public pantryItemLocation: PantryItemLocation) {}
}

export class AddPantryItemLocationFailed implements Action {
  readonly type = PantryActionTypes.AddPantryItemLocationFailed;
  constructor(public error: Error) {}
}

export class PantryItemDeleted implements Action {
  readonly type = PantryActionTypes.PantryItemDeleted;
  constructor(public id: number) {
  }
}

export class NavigatedToPantryPage implements Action {
  readonly type = PantryActionTypes.NavigatedToPantryPage;
}

export class NavigatedToPantryItemPage implements Action {
  readonly type = PantryActionTypes.NavigatedToPantryItemPage;

  constructor(public pantryItemId: number) {}
}

export class PantryLoadedSuccessfully implements Action {
  readonly type = PantryActionTypes.PantryLoadedSuccessfully;

  constructor(public pantryItems: PantryItem[]) {}
}

export class PantryLoadFailed implements Action {
  readonly type = PantryActionTypes.PantryLoadFailed;

  constructor(public error: Error) {}
}

export class SavePantryItem implements Action {
  readonly type = PantryActionTypes.SavePantryItem;

  constructor(public pantryItem: PantryItem) {}
}

export class SaveNewPantryItem implements Action {
  readonly type = PantryActionTypes.SaveNewPantryItem;

  constructor(public pantryItem: PantryItem) {}
}

export class SavePantryItemSucceeded implements Action {
  readonly type = PantryActionTypes.SavePantryItemSucceeded;

  constructor(public pantryItem: PantryItem) {}
}

export class SavePantryItemFailed implements Action {
  readonly type = PantryActionTypes.SavePantryItemFailed;

  constructor(public error: Error, public item: PantryItem) {}
}

export type PantryActions =
  CreatePantryItem
  | AddPantryItemLocation
  | AddPantryItemLocationFailed
  | AddPantryItemLocationRequest
  | CreateItemFailed
  | DeletePantryItemFailed
  | DeletePantryItem
  | DeletePantryItemFailed
  | ItemCreated
  | PantryItemDeleted
  | NavigatedToPantryPage
  | NavigatedToPantryItemPage
  | NavigateToPantryItemPage
  | PantryItemLocationAdded
  | PantryLoadedSuccessfully
  | PantryLoadFailed
  | SaveNewPantryItem
  | SavePantryItem
  | SavePantryItemFailed
  | SavePantryItemSucceeded;

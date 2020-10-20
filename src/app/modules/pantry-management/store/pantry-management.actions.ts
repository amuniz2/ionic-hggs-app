import {Action} from '@ngrx/store';
import {PantryItem} from '../../../model/pantry-item';
import {
  CreatePantryItemRequest,
  DeletePantryItemRequest,
  NavigateToEditPantryItemRequest
} from '../dumb-components/pantry-item-list/pantry-item-list.component';
import {EditItemLocationRequest, NewItemLocationRequest} from '../dumb-components/pantry-item-locations/pantry-item-locations.component';
import {GroceryStoreLocation} from '../../../model/grocery-store-location';
import {NewItemLocation} from '../smart-components/edit-pantry-item-location/edit-pantry-item-location.component';
import {ProductInfo} from '../smart-components/edit-pantry-item/edit-pantry-item.component';
import {ToggleAction} from '@ngrx/store-devtools/src/actions';

export enum PantryActionTypes {
  ToggleNeed = '[Pantry Item] Toggle Need',
  PantryItemLoaded = '[Pantry Item] Loaded',
  PantryLoadedSuccessfully = '[Pantry] Loaded',
  PantryLoadFailed = '[Pantry] Load Failed',
  SelectGroceryItem = '[Grocery Item] Select',
  UpdateGroceryItem = '[Grocery Item] Update',
  CreatePantryItem = '[Pantry Item] Create',
  CreateItemFailed = '[Pantry Item] Create Failed',
  DeletePantryItemFailed = '[Pantry Item] Delete Failed',
  DeletePantryItem = '[Pantry item] Delete',
  PantryItemCreated = '[Pantry Item] Created',
  PantryItemDeleted = '[Pantry Item] Deleted',
  LoadPantryItemLocations = '[Pantry Item] Load Locations',
  LoadPantryItems = '[Pantry] Navigated to',
  NavigateToPantryItemPage = '[Pantry Item] Navigate to',
  NavigatedToPantryItemPage = '[Pantry Item] Navigated to',
  AddPantryItemLocation = '[Pantry Item] add location',
  AddPantryItemLocationFailed = '[Pantry Item] add location failed',
  AddPantryItemLocationRequest = '[Pantry Item] add location requested',
  DeletePantryItemLocation = '[Pantry Item] dleete location',
  EditPantryItemLocationRequest = '[Pantry Item] edit location requested',
  NewPantryItemScanned = '[Pantry Item] new item scanned',
  PantryItemInfoScanned = '[Pantry Item] info scanned',
  PantryItemLocationAdded = '[Pantry Item] add location succeeded',
  PantryItemLocationDeleted = '[Pantry Item] location deleted',
  PantryItemLocationUpdated = '[Pantry Item] location updated',
  PantryItemLocationsLoadedSuccessfully = '[Pantry Item] locations loaded successfully',
  SavePantryItem = '[Pantry Item] Save',
  SavePantryItemFailed = '[Pantry Item] Save Failed',
  SavePantryItemSucceeded = '[Pantry Item] Save Succeeded',
  SaveNewPantryItem = '[Pantry Item] Save New Requested',
  UpdatePantryItemLocation = '[Pantry Item] Update Requested',
  PantryImportedSuccessfully = '[Pantry Item] Imported Successfully',
  NoOp = '[Pantry Item] Do nothing, needed for conditional effect'
}

export class ToggleNeed implements Action {
  readonly type = PantryActionTypes.ToggleNeed;

  constructor(public request: PantryItem){}
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
  readonly type = PantryActionTypes.CreatePantryItem;

  constructor(public pantryItemRequest: CreatePantryItemRequest) {
    console.log('Creating CreatePantryItem action.');
    console.log(pantryItemRequest);
  }
}

export class DeletePantryItemLocation implements Action {
  readonly type = PantryActionTypes.DeletePantryItemLocation;

  constructor(public request: EditItemLocationRequest) {}
}

export class EditPantryItemLocationRequest implements Action {
  readonly type = PantryActionTypes.EditPantryItemLocationRequest;

  constructor(public request: EditItemLocationRequest) {}
}

export class NavigateToPantryItemPage implements Action {
  readonly type = PantryActionTypes.NavigateToPantryItemPage;

  constructor(public pantryItemRequest: NavigateToEditPantryItemRequest) {}
}

export class CreateItemFailed implements Action {
  readonly type = PantryActionTypes.CreateItemFailed;

  constructor(public name: string, public error: Error) {}
}

export class DeletePantryItemFailed implements Action {
  readonly type = PantryActionTypes.DeletePantryItemFailed;

  constructor(public error: Error) {}
}

export class DeletePantryItem implements Action {
  readonly type = PantryActionTypes.DeletePantryItem;
  constructor(public deletePantryItemRequest: DeletePantryItemRequest) {}
}

export class PantryItemCreated implements Action {
  readonly type = PantryActionTypes.PantryItemCreated;
  constructor(public pantryItem: PantryItem) {
  }
}

export class PantryItemLocationAdded implements Action {
  readonly type = PantryActionTypes.PantryItemLocationAdded;
  constructor(public itemId: number, public pantryItemLocation: GroceryStoreLocation) {
  }
}


export class PantryItemLocationDeleted implements Action {
  readonly type = PantryActionTypes.PantryItemLocationDeleted;
  constructor(public itemId: number, public location: GroceryStoreLocation) {
  }
}

export class PantryItemLocationUpdated implements Action {
  readonly type = PantryActionTypes.PantryItemLocationUpdated

  constructor(public itemId: number, public originalLocationId: number, public pantryItemLocation: GroceryStoreLocation) {
  }
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

export class PantryItemLoaded implements Action {
  readonly type = PantryActionTypes.PantryItemLoaded;
  constructor(public pantryItem: PantryItem) {
  }
}

export class LoadPantryItemLocations implements Action {
  readonly type = PantryActionTypes.LoadPantryItemLocations;
  constructor(public itemId: number) {}
}

export class LoadPantryItems implements Action {
  readonly type = PantryActionTypes.LoadPantryItems;
}

export class NavigatedToPantryItemPage implements Action {
  readonly type = PantryActionTypes.NavigatedToPantryItemPage;

  constructor(public pantryItemId: number) {}
}

export class PantryItemInfoScanned implements Action {
  readonly type = PantryActionTypes.PantryItemInfoScanned;

  constructor(public pantryItemId: number, public infoScanned: ProductInfo[]) {}
}

export class NewPantryItemScanned implements Action {
  readonly type = PantryActionTypes.NewPantryItemScanned;

  constructor(public infoScanned: ProductInfo[]) {}
}

export class PantryLoadedSuccessfully implements Action {
  readonly type = PantryActionTypes.PantryLoadedSuccessfully;

  constructor(public pantryItems: PantryItem[]) {}
}

export class PantryImportedSuccessfully implements Action {
  readonly type = PantryActionTypes.PantryImportedSuccessfully;

  constructor(public pantryItems: PantryItem[], public returnUrl: string) {}
}

export class PantryItemLocationsLoadedSuccessfully implements Action {
  readonly type = PantryActionTypes.PantryItemLocationsLoadedSuccessfully;

  constructor(public itemId: number, public locations: GroceryStoreLocation[]) {}
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

export class UpdatePantryItemLocation implements Action {
  readonly type = PantryActionTypes.UpdatePantryItemLocation;

  constructor(public originalLocationId: number, public updatePantryItemLocation: NewItemLocation) {}
}

export class NoOp implements Action {
  readonly type = PantryActionTypes.NoOp;
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
  | DeletePantryItemLocation
  | EditPantryItemLocationRequest
  | PantryItemCreated
  | LoadPantryItemLocations
  | PantryItemDeleted
  | LoadPantryItems
  | NavigatedToPantryItemPage
  | NavigateToPantryItemPage
  | NewPantryItemScanned
  | PantryItemInfoScanned
  | PantryItemLocationAdded
  | PantryItemLocationUpdated
  | PantryItemLoaded
  | PantryLoadedSuccessfully
  | PantryItemLocationDeleted
  | PantryItemLocationsLoadedSuccessfully
  | PantryLoadFailed
  | SaveNewPantryItem
  | SavePantryItem
  | SavePantryItemFailed
  | SavePantryItemSucceeded
  | UpdatePantryItemLocation
  | PantryImportedSuccessfully
  | ToggleNeed
  | NoOp;

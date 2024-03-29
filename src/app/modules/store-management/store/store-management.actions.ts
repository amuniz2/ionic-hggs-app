import {Action} from '@ngrx/store';
import {DeleteGroceryStoreRequest,
  NavigateToEditStoreRequest,
  NewGroceryStoreRequest} from '../dumb-components/store-list/store-list.component';
import {PantryItem} from '../../../model/pantry-item';
import {PantryActionTypes} from '../../pantry-management/store/pantry-management.actions';
import {GroceryStore} from '../../../model/grocery-store';

export enum StoreManagerActionTypes {
  CreateStore = '[Store Manager] Create',
  NavigateToStoreDetailsPage = '[Store Manager] Navigate to Store Details Page',
  NavigatedToStoreDetailsPage = '[Store Manager] Navigated to Store Details Page',
  UpdateStore = '[Store Manager] Update',
  DeleteStore = '[Store Manager] Delete',
  GetGroceryStoreAislesFailed =  '[Store Manager] Store Aisles Failed To Load',
  GetGroceryStoreSectionsFailed =  '[Store Manager] Store Sections Failed To Load',
  GetGroceryStoreLocationsFailed = '[Store Manager] Store Locations Failed to Load',
  UpdateStoreAisle = '[Store Manager] Update Aisle',
  SelectStoreAisle = '[Store Manager] Select Aisle',
  GroceryStoresImportedSuccessfully = '[Store Manager] Grocery Stores Imported',
}

export class NavigateToStoreDetailsPage implements Action {
  readonly type = StoreManagerActionTypes.NavigateToStoreDetailsPage;
  constructor(public navigateToEditStorePayload: NavigateToEditStoreRequest) {}
}

export class NavigatedToStoreDetailsPage implements Action {
  readonly type = StoreManagerActionTypes.NavigatedToStoreDetailsPage;
  constructor(public groceryStoreId: number) {}
}

// export class NavigateToEditStore implements Action {
//   readonly type = StoreManagerActionTypes.NavigateToEditStorePageRequest;
//   constructor(public navigateToEditStorePayload: NavigateToEditStoreRequest) {}
// }

export class CreateStore implements Action {
  readonly type = StoreManagerActionTypes.CreateStore;
  constructor(public createGroceryStorePayload: NewGroceryStoreRequest) {}
}

export class DeleteStore implements Action {
  readonly type = StoreManagerActionTypes.DeleteStore;
  constructor(public deleteGroceryStorePayload: DeleteGroceryStoreRequest) {
  }
}
export class GetGroceryStoreLocationsFailed implements Action {
  constructor(public error: Error) {
  }
  readonly type = StoreManagerActionTypes.GetGroceryStoreLocationsFailed;
}

export class GetStoreAislesFailed implements Action {
  constructor(public error: Error) {
  }
  readonly type = StoreManagerActionTypes.GetGroceryStoreAislesFailed;
}

export class GetStoreSectionsFailed implements Action {
  constructor(public error: Error) {
  }
  readonly type = StoreManagerActionTypes.GetGroceryStoreSectionsFailed;
}


export class UpdateStore implements Action {
  readonly type = StoreManagerActionTypes.UpdateStore;
}

export class SelectStoreAisle implements Action {
  readonly type = StoreManagerActionTypes.SelectStoreAisle;
}

export class UpdateStoreAisle implements Action {
  readonly type = StoreManagerActionTypes.UpdateStoreAisle;
}

export type StoreManagementActions =
  | CreateStore
  | DeleteStore
  | NavigateToStoreDetailsPage
  | NavigatedToStoreDetailsPage
  | GetGroceryStoreLocationsFailed;

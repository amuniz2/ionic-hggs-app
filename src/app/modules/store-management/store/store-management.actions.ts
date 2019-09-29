import {Action, Store} from '@ngrx/store';
import {GroceryStore} from '../model/grocery-store';
import {DeleteGroceryStoreRequest,
  NavigateToEditStoreRequest,
  NewGroceryStoreRequest} from '../dumb-components/store-list/store-list.component';
import {StoreAisle} from '../dumb-components/grocery-store-aisles/grocery-store-aisles.component';

export enum StoreManagerActionTypes {
  LoadGroceryStoresFailed = '[Store Manager] Load Grocery Stores failed',
  LoadStores = '[Store Manager] Load Stores',
  CreateStore = '[Store Manager] Create',
  CreateStoreFailed = '[Store Manager] Create Store failed',
  NavigatedToStoreListPage = '[Store Manager] Store List Page',
  NavigateToStoreDetailsPage = '[Store Manager] Navigate to Store Details Page',
  StoresLoadedSuccessfully = '[Store Manager] Stores Loaded Successfully',
  StoreCreated = '[Store Manager] Created',
  StoreDeleted = '[Store Manager] Deleted',
  SelectStore = '[Store Manager] Select',
  UpdateStore = '[Store Manager] Update',
  DeleteStore = '[Store Manager] Delete',
  DeleteStoreFailed = '[Store Manager] Delete Store failed',
  DeleteStoreSucceeded = '[Store Manager] Delete Store succeeded',
  AddStoreAisle = '[Store Manager] Add Store Aisle',
  AddStoreAisleFailed = '[Store Manager] Add Store Aisle Failed',
  StoreAisleAdded = '[Store Manager] Aisle Added',
  StoreAisleRemoved = '[Store Manager] Aisle Removed',
  UpdateStoreAisle = '[Store Manager] Update Aisle',
  SelectStoreAisle = '[Store Manager] Select Aisle',
  DeleteStoreAisle = '[Store Manager] Delete Aisle',
  CreateStoreSection = '[Store Manager] Create Grocery Section',
  UpdateStoreSection = '[Store Manager] Update Aisle',
  DeleteStoreSection = '[Store Manager] Delete Aisle',
  SelectStoreSection = '[Store Manager] Select Aisle',
  CreateStoreLocation = '[Store Manager] Create Location',
  UpdateStoreLocation = '[Store Manager] Update Location',
  DeleteStoreLocation = '[Store Manager] Delete Location',
  SelectStoreLocation = '[Store Manager] Select Location',
}

export class NavigatedToStoreListPage implements Action {
  readonly type = StoreManagerActionTypes.NavigatedToStoreListPage;
}

export class NavigateToStoreDetailsPage implements Action {
  readonly type = StoreManagerActionTypes.NavigateToStoreDetailsPage;
  constructor(public navigateToEditStorePayload: NavigateToEditStoreRequest) {}
}

// export class NavigateToEditStore implements Action {
//   readonly type = StoreManagerActionTypes.NavigateToEditStorePageRequest;
//   constructor(public navigateToEditStorePayload: NavigateToEditStoreRequest) {}
// }

export class StoresLoadedSuccessfully implements  Action {
  constructor(public groceryStores: GroceryStore[]) {
  }
  readonly type = StoreManagerActionTypes.StoresLoadedSuccessfully;
}

export class LoadGroceryStoresFailed implements Action {
  constructor(public error: Error) {
  }
  readonly type = StoreManagerActionTypes.LoadGroceryStoresFailed;
}
export class CreateStore implements Action {
  readonly type = StoreManagerActionTypes.CreateStore;
  constructor(public createGroceryStorePayload: NewGroceryStoreRequest) {}
}

export class StoreCreated implements Action {
  readonly type = StoreManagerActionTypes.StoreCreated;

  constructor(public payload: GroceryStore ) {}
}

export class DeleteStoreSucceeded implements Action {
  constructor(public id: number) {
  }
  readonly type = StoreManagerActionTypes.DeleteStoreSucceeded;
}

export class CreateStoreFailed implements Action {
  constructor(public error: Error) {
  }
  readonly type = StoreManagerActionTypes.CreateStoreFailed;
}

export class DeleteStore implements Action {
  readonly type = StoreManagerActionTypes.DeleteStore;
  constructor(public deleteGroceryStorePayload: DeleteGroceryStoreRequest) {
    console.log ('created DeleteStore action with ');
    console.log(deleteGroceryStorePayload);
  }
}

export class StoreDeleted implements Action {
  readonly type = StoreManagerActionTypes.StoreDeleted;

  constructor(public id: number ) {}
}

export class DeleteStoreFailed implements Action {
  constructor(public error: Error) {
  }
  readonly type = StoreManagerActionTypes.DeleteStoreFailed;
}

export class AddStoreAisle implements Action {
  readonly type = StoreManagerActionTypes.AddStoreAisle;
  constructor(public newStoreAisleRequest: StoreAisle) {
  }
}
export class RemoveStoreAisle implements Action {
  readonly type = StoreManagerActionTypes.DeleteStoreAisle;
  constructor(public deleteStoreAisleRequest: StoreAisle) {
  }
}

export class StoreAisleAdded implements Action {
  readonly type = StoreManagerActionTypes.StoreAisleAdded;

  constructor(public payload: GroceryStore ) {}
}
export class AddStoreAisleFailed implements Action {
  constructor(public error: Error) {
  }
  readonly type = StoreManagerActionTypes.AddStoreAisleFailed;
}

export class StoreAisleRemoved implements Action {
  readonly type = StoreManagerActionTypes.StoreAisleRemoved;

  constructor(public payload: StoreAisle ) {}
}

export class SelectStore implements Action {
  readonly type = StoreManagerActionTypes.SelectStore;
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
  NavigatedToStoreListPage
  | NavigateToStoreDetailsPage
  | CreateStore
  | CreateStoreFailed
  | StoreCreated
  | DeleteStore
  | StoreDeleted
  | DeleteStoreFailed
  | StoresLoadedSuccessfully
  | AddStoreAisle
  | StoreAisleAdded
  | AddStoreAisleFailed
  | RemoveStoreAisle
  | StoreAisleRemoved
  | LoadGroceryStoresFailed;

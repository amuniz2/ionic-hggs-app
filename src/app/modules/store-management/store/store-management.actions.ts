import {Action} from '@ngrx/store';
import {GroceryStore} from '../../../model/grocery-store';
import {DeleteGroceryStoreRequest,
  NavigateToEditStoreRequest,
  NewGroceryStoreRequest} from '../dumb-components/store-list/store-list.component';
import {StoreAisle} from '../dumb-components/grocery-store-aisles/grocery-store-aisles.component';
import {StoreSection} from '../dumb-components/grocery-store-sections/grocery-store-sections.component';

export enum StoreManagerActionTypes {
  CreateStore = '[Store Manager] Create',
  CreateStoreFailed = '[Store Manager] Create Store failed',
  NavigateToStoreDetailsPage = '[Store Manager] Navigate to Store Details Page',
  NavigatedToStoreDetailsPage = '[Store Manager] Navigated to Store Details Page',
  StoreCreated = '[Store Manager] Created',
  StoreDeleted = '[Store Manager] Deleted',
  SelectStore = '[Store Manager] Select',
  UpdateStore = '[Store Manager] Update',
  DeleteStore = '[Store Manager] Delete',
  DeleteStoreFailed = '[Store Manager] Delete Store failed',
  DeleteStoreSucceeded = '[Store Manager] Delete Store succeeded',
  GetGroceryStoreAislesFailed =  '[Store Manager] Store Aisles Failed To Load',
  GetGroceryStoreSectionsFailed =  '[Store Manager] Store Sections Failed To Load',
  UpdateStoreAisle = '[Store Manager] Update Aisle',
  SelectStoreAisle = '[Store Manager] Select Aisle',
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

export class StoreCreated implements Action {
  readonly type = StoreManagerActionTypes.StoreCreated;

  constructor(public groceryStore: GroceryStore ) {}
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
  | CreateStore
  | CreateStoreFailed
  | DeleteStore
  | DeleteStoreFailed
  | NavigateToStoreDetailsPage
  | NavigatedToStoreDetailsPage
  | StoreCreated
  | StoreDeleted;

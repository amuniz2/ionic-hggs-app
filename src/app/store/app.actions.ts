import {Action} from '@ngrx/store';
import {GroceryStore} from '../model/grocery-store';
import {StoreAisle} from '../modules/store-management/dumb-components/grocery-store-aisles/grocery-store-aisles.component';
import {StoreSection} from '../modules/store-management/dumb-components/grocery-store-sections/grocery-store-sections.component';
import {GroceryStoreLocation} from '../model/grocery-store-location';
import {StoreManagerActionTypes} from '../modules/store-management/store/store-management.actions';

export const APP_READY = '[App] Ready';

export class AppReady implements Action {
  readonly type = APP_READY;
}
export enum AppActionTypes {
  StartAppInitializer = '[AppActionTypes] Start App Initializer',
  FinishAppInitializer = '[AppActionTypes] Finish App Initializer',
  DatabaseOpenFailed = '[AppActionTypes] Failed to open database',
  DatabaseReady = '[AppActionTypes] Database initialized',
  AddGroceryStoreSection = '[Store Manager] Add Grocery Store Section',
  AddStoreAisleFailed = '[AppActionTypes] Store Aisle Add Failed',
  AddGroceryStoreSectionFailed = '[Store Manager] Add Grocery Store Section Failed',
  AddStoreAisle = '[App] Add Store Aisle',
  DeleteStoreAisle = '[Store Manager] Delete Aisle',
  DeleteStoreAisleFailed = '[App] Delete Groery Store Aisle Failed',
  LoadStoreAisles = '[AppActionTypes] Get Store Aisles',
  LoacGroceryStoreSections = '[appActionTypes] Get Grocery Store Sections',
  LoadGroceryStores = '[Shared] Load Grocery Stores',
  LoadGroceryStoresFailed = '[Store Manager] Load Grocery Stores failed',
  StoresLoadedSuccessfully = '[Store Manager] Stores Loaded Successfully',
  GroceryStoreAislesLoaded = '[App] Grocery Store Aisles Loaded',
  GroceryStoreSectionsLoaded = '[App] Grocery Store Sections Loaded',
  LocationGroceryStoreSelected = '[App] Grocery Store selected for location',
  StoreAisleAdded = '[App] Aisle Added',
  GroceryStoreAisleDeleted = '[Store Manager] Delete Aisle Succeeded',
  DeleteGroceryStoreAisleFailed = '[Store Manager] Delete Aisle Failed',
  DeleteGroceryStoreSection = '[Store Manager] Delete Grocery Story Section',
  GroceryStoreSectionDeleted = '[Store Manager] Delete Grocery Section Succeeded',
  DeleteGroceryStoreSectionFailed = '[Store Manager] Delete Grocery Store Section Failed',
  GroceryStoreSectionAdded = '[Store Manager] Grocery Store Section Added',
  GroceryStoreLocationPossiblyAdded = '[Store Manager] Grocery Store Location Possibly Added',
  StoreCreated = '[Store Manager] Grocery Store Created',
  CreateStoreFailed = '[Store Manager] Create Store failed',
  StoreDeleted = '[Store Manager] Deleted',
  DeleteStoreFailed = '[Store Manager] Delete Store failed',
  DeleteStoreSucceeded = '[Store Manager] Delete Store succeeded',
}

export class StartAppInitializer implements Action {
  public readonly type = AppActionTypes.StartAppInitializer;
}

export class FinishAppInitializer implements Action {
  public readonly type = AppActionTypes.FinishAppInitializer;
}

export class DatabaseOpenFailed implements Action {
  public readonly type = AppActionTypes.DatabaseOpenFailed;
  constructor(err: any) {}
}

export class DatabaseReady implements Action {
  public readonly type = AppActionTypes.DatabaseReady;
  constructor(err: any) {}
}

// region GroceryStores
export class StoresLoadedSuccessfully implements  Action {
  constructor(public groceryStores: GroceryStore[]) {
  }
  readonly type = AppActionTypes.StoresLoadedSuccessfully;
}

export class LoadGroceryStores implements Action {
  readonly type = AppActionTypes.LoadGroceryStores;
}

export class LoadGroceryStoresFailed implements Action {
  constructor(public error: Error) {
  }
  readonly type = AppActionTypes.LoadGroceryStoresFailed;
}

export class LoadGroceryStoreAisles implements Action {
  readonly type = AppActionTypes.LoadStoreAisles;

  constructor(public groceryStoreId: number) {}
}

export class LoadGroceryStoreSections implements Action {
  readonly type = AppActionTypes.LoacGroceryStoreSections;

  constructor(public groceryStoreId: number) {}
}

export class GroceryStoreAislesLoaded implements Action {
  readonly type = AppActionTypes.GroceryStoreAislesLoaded;

  constructor(public payload: { groceryStoreId: number, aisles: string[] }) {}
}

export class GroceryStoreSectionsLoaded implements Action {
  readonly type = AppActionTypes.GroceryStoreSectionsLoaded;

  constructor(public payload: { groceryStoreId: number, sections: string[] }) {}
}

export class LocationGroceryStoreSelected implements Action {
  readonly type = AppActionTypes.LocationGroceryStoreSelected;

  constructor(public storeId: number) {}
}

export class StoreAisleAdded implements Action {
  readonly type = AppActionTypes.StoreAisleAdded;

  constructor(public payload: { groceryStoreId: number, newAisle: string }) {}
}

export class GroceryStoreAisleDeleted implements Action {
  readonly type = AppActionTypes.GroceryStoreAisleDeleted;

  constructor(public payload: { groceryStoreId: number, aisle: string }) {}
}

export class AddStoreAisleFailed implements Action {
  constructor(public error: Error) {
  }
  readonly type = AppActionTypes.AddStoreAisleFailed;
}
export class GroceryStoreSectionAdded implements Action {
  readonly type = AppActionTypes.GroceryStoreSectionAdded;

  constructor(public payload: { groceryStoreId: number, newSection: string }) {}
}

export class AddGroceryStoreSectionFailed implements Action {
  constructor(public error: Error) {
  }
  readonly type = AppActionTypes.AddGroceryStoreSectionFailed;
}
export class AddStoreAisle implements Action {
  readonly type = AppActionTypes.AddStoreAisle;
  constructor(public newStoreAisleRequest: StoreAisle) {
  }
}

export class DeleteStoreAisle implements Action {
  readonly type = AppActionTypes.DeleteStoreAisle;
  constructor(public deleteStoreAisleRequest: StoreAisle) {
  }
}

export class AddGroceryStoreSection implements Action {
  readonly type = AppActionTypes.AddGroceryStoreSection;
  constructor(public newGroceryStoreSectionRequest: StoreSection) {
  }
}
export class RemoveStoreAisle implements Action {
  readonly type = AppActionTypes.DeleteStoreAisle;
  constructor(public deleteStoreAisleRequest: StoreAisle) {
  }
}

export class DeleteGroceryStoreSection implements Action {
  readonly type = AppActionTypes.DeleteGroceryStoreSection;

  constructor(public deleteGroceryStoreSectionRequest: StoreSection) {
  }
}
export class DeleteStoreAisleFailed implements Action {
  constructor(public error: Error) {
  }
  readonly type = AppActionTypes.DeleteStoreAisleFailed;
}

export class DeleteGroceryStoreSectionFailed implements Action {
  constructor(public error: Error) {
  }
  readonly type = AppActionTypes.DeleteGroceryStoreSectionFailed;
}

export class GroceryStoreSectionDeleted implements Action {
  readonly type = AppActionTypes.GroceryStoreSectionDeleted;

  constructor(public payload: { groceryStoreId: number, section: string }) {}
}

export class GroceryStoreLocationPossiblyAdded implements Action {
  readonly type = AppActionTypes.GroceryStoreLocationPossiblyAdded;

  constructor(public payload: GroceryStoreLocation) {}
}

export class StoreCreated implements Action {
  readonly type = AppActionTypes.StoreCreated;

  constructor(public groceryStore: GroceryStore ) {}
}

export class CreateStoreFailed implements Action {
  constructor(public error: Error) {
  }
  readonly type = AppActionTypes.CreateStoreFailed;
}

export class StoreDeleted implements Action {
  readonly type = AppActionTypes.StoreDeleted;

  constructor(public id: number ) {}
}

export class DeleteStoreFailed implements Action {
  constructor(public error: Error) {
  }
  readonly type = AppActionTypes.DeleteStoreFailed;
}

export class DeleteStoreSucceeded implements Action {
  constructor(public id: number) {
  }
  readonly type = AppActionTypes.DeleteStoreSucceeded;
}

// endregion
export type AppActions = AppReady
  | StartAppInitializer
  | FinishAppInitializer
  | DatabaseOpenFailed
  | LoadGroceryStoreAisles
  | LoadGroceryStoreSections
  | LoadGroceryStores
  | LoadGroceryStoresFailed
  | StoresLoadedSuccessfully
  | GroceryStoreAislesLoaded
  | GroceryStoreSectionsLoaded
  | LocationGroceryStoreSelected
  | AddGroceryStoreSection
  | AddStoreAisle
  | AddStoreAisleFailed
  | DeleteGroceryStoreSection
  | DeleteGroceryStoreSectionFailed
  | DeleteStoreAisle
  | DeleteStoreAisleFailed
  | GroceryStoreSectionAdded
  | GroceryStoreAisleDeleted
  | GroceryStoreSectionAdded
  | GroceryStoreSectionDeleted
  | GroceryStoreLocationPossiblyAdded
  | StoreAisleAdded
  | StoreCreated
  | CreateStoreFailed
  | DeleteStoreFailed
  | StoreDeleted
  | DeleteStoreSucceeded;
